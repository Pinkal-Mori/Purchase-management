import { useEffect, useState } from "react";
import api from "../../api/axios";
import RequirementForm from "./RequirementForm";

function parseRef(refId) {
  if (!refId) return { refLinkText: "N/A", refLinkUrl: "" };
  try {
    const u = new URL(refId);
    const hostname = u.hostname.startsWith("www.")
      ? u.hostname.slice(4)
      : u.hostname;
    return { refLinkText: hostname, refLinkUrl: refId };
  } catch {
    return { refLinkText: refId, refLinkUrl: "" };
  }
}

export default function RequirementList({ user }) {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ user: "", date: "", status: "", month: "", year: "" }); // 🆕 default year is now empty string
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("/auth/all-users");
        setAllUsers(res.data.users || []);
      } catch (e) {
        console.error("Failed to load users", e);
      }
    }
    fetchUsers();
  }, []);

  // 🆕 Function to get all unique years from the data
  const getAllYears = () => {
    const years = new Set();
    items.forEach(item => {
      if (item.date) {
        years.add(new Date(item.date).getFullYear());
      }
    });
    // Add the current year if it's not already in the data
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => a - b);
  };

  async function load() {
    const params = {};
    if (filters.user) params.user = filters.user;
    if (filters.date) params.date = filters.date;
    if (filters.status) params.status = filters.status;
    if (filters.month) params.month = filters.month; 
    if (filters.year) params.year = filters.year; 

    try {
      const res = await api.get("/requirements", { params });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load requirements", err);
    }
  }

  // 🆕 The useEffect now depends on the 'filters' state
  useEffect(() => {
    load();
  }, [filters]);

  const save = async (payload) => {
    const { refLinkText, refLinkUrl } = parseRef(payload.refId);
    const body = {
      part: payload.part,
      quantity: Number(payload.quantity),
      note: payload.note,
      reason: payload.reason,
      refLinkText,
      refLinkUrl,
      date: payload.date,
      addedBy: payload.addedBy,
      orderId: editing?.orderId || "",
      orderedBy: editing?.orderedBy || "",
      amount: payload.amount || 0,
    };

    try {
      if (editing?._id) await api.put(`/requirements/${editing._id}`, body);
      else await api.post("/requirements", body);

      setModalOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      console.error("❌ Failed to save requirement:", err);
      let message = "Failed to save. Please check your input.";
      if (err.response?.data?.details) message = err.response.data.details;
      else if (err.response?.data?.error) message = err.response.data.error;
      alert("⚠️ " + message);
    }
  };

  const updateRow = async (row, newOrderId, newOrderedBy, newAmount) => {
    if (!newOrderId || newOrderId.trim() === "") {
      alert("⚠️ Please add an Order ID before saving!");
      return;
    }
    await api.put(`/requirements/${row._id}`, {
      ...row,
      orderId: newOrderId,
      orderedBy: newOrderedBy,
      amount: newAmount,
    });
    await load();
  };

  const delRow = async (row) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;
    await api.delete(`/requirements/${row._id}`);
    await load();
  };

  // Sidebar toggle
  const handleFilterToggle = () => setSidebarOpen((prev) => !prev);
  const handleFilterClose = () => setSidebarOpen(false);

  return (
    <div className="main-container">
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={handleFilterClose}
        />
      )}
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h3>Filters</h3>
          <button className="close-sidebar" onClick={handleFilterClose}>
            ✖
          </button>
        </div>
        <div className="filters">
          <div className="filter-group">
            <div className="filter-toggle">
              <span>Filter by User</span>
            </div>
            <div className="filter-content active">
              <input
                type="text"
                placeholder="Enter User Name"
                value={filters.user}
                onChange={(e) =>
                  setFilters({ ...filters, user: e.target.value })
                }
              />
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-toggle">
              <span>Filter by Date</span>
            </div>
            <div className="filter-content active">
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-toggle">
              <span>Filter by Month</span>
            </div>
            <div className="filter-content active">
              <select
                value={filters.month}
                onChange={(e) =>
                  setFilters({ ...filters, month: e.target.value })
                }
              >
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-toggle">
              <span>Filter by Year</span>
            </div>
            <div className="filter-content active">
              <select
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
              >
                <option value="">All Years</option>
                {/* 🆕 Dynamically generate year options */}
                {getAllYears().map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-toggle">
              <span>Filter by Status</span>
            </div>
            <div className="filter-content active">
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="placed">Order Placed</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button
              onClick={() => {
                // 🆕 The filter state is reset. The useEffect will handle the load.
                setFilters({ user: "", date: "", status: "", month: "", year: "" });
              }}
            >
              Reset
            </button>
            {/* <button onClick={() => load()}>Apply</button> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`content ${sidebarOpen ? "shrunk" : ""}`}>
        <div className="header2">
          <a href="/dashboard" className="back-btn">
            <i className="material-icons">arrow_back</i>
          </a>
          <div className="header-center">
            <h2>
              "Track & Manage Your Requests" <span>{user?.name}</span>
            </h2>
          </div>
          <div className="header-actions">
            {!sidebarOpen && (
              <button className="filter-btn" onClick={handleFilterToggle}>
                <i className="material-icons">filter_list</i>
              </button>
            )}
          </div>
        </div>

        <div className="add-btn-container">
          <button
            id="addBtn"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            + Add Requirement
          </button>
        </div>

        <div id="requirementList">
          <h3>All Requirements:</h3>
          {items.length === 0 ? (
            <p>No requirements found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Part</th>
                  <th>Quantity</th>
                  <th>Note</th>
                  <th>Reference Link</th>
                  <th>Date</th>
                  <th>Added By</th>
                  <th>Order ID</th>
                  <th>Ordered By</th>
                  <th>Amount</th> 
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((req) => {
                  let rowColor = "";
                  if (req.orderId && req.orderId.trim() !== "")
                    rowColor = "row-green";
                  else {
                    const viewedByCurrentUser = req.views?.some(
                      (v) => v.userId === user._id && v.viewed
                    );
                    rowColor = viewedByCurrentUser ? "row-yellow" : "row-white";
                  }

                  return (
                    <tr key={req._id} className={rowColor}>
                      <td>{req.part}</td>
                      <td>{req.quantity}</td>
                      <td>{req.note}</td>
                      <td className="ref-id-cell">
                        {req.refLinkUrl ? (
                          <a
                            href={req.refLinkUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {req.refLinkText}
                          </a>
                        ) : (
                          req.refLinkText
                        )}
                      </td>
                      <td>{req.date}</td>
                      <td>{req.addedBy}</td>
                      <td>
                        <input
                          type="text"
                          defaultValue={req.orderId || ""}
                          id={`order-${req._id}`}
                        />
                      </td>
                      <td>
                        <select
                          defaultValue={req.orderedBy || ""}
                          id={`orderedBy-${req._id}`}
                        >
                          <option value="">-Select User-</option>
                          {allUsers.map((u) => (
                            <option key={u._id} value={u.name}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          defaultValue={req.amount || ""}
                          id={`amount-${req._id}`}
                          placeholder="Enter Amount"
                        />
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            onClick={() => {
                              setEditing(req);
                              setModalOpen(true);
                            }}
                          >
                            ✏️
                          </button>
                          <button onClick={() => delRow(req)}>🗑️</button>
                          <button
                            onClick={() => {
                              const orderIdVal = document.getElementById(
                                `order-${req._id}`
                              ).value;
                              const orderedByVal = document.getElementById(
                                `orderedBy-${req._id}`
                              ).value;
                              const amountVal = document.getElementById(
                                `amount-${req._id}`
                              ).value;
                              updateRow(req, orderIdVal, orderedByVal, amountVal);
                            }}
                          >
                            💾
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <RequirementForm
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
        currentUser={user}
        onSave={save}
      />
    </div>
  );
}