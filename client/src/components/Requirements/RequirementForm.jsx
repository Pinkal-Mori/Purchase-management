import { useEffect, useState } from "react";

// This line is correct. No changes needed here.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RequirementForm({
  open,
  onClose,
  initial,
  onSave,
  currentUser,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState(""); // ✅ NEW
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState(""); // ✅ NEW
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [refId, setRefId] = useState("");
  const [date, setDate] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    setAddedBy(currentUser?.name || "");

    if (initial) {
      const [initCat, initSub] = initial.part.split(" / ");
      setSelectedCategory(initCat || "");
      setSelectedSubcategory(initSub || "");
      setQuantity(initial.quantity || "");
      setNote(initial.note || "");
      setReason(initial.reason || "");
      setRefId(initial.refLinkUrl || "");
      setDate(initial.date || today);
      setAddedBy(initial.addedBy || currentUser?.name || "");
    } else {
      setSelectedCategory("");
      setNewCategory(""); // ✅ Reset new category
      setSelectedSubcategory("");
      setQuantity("");
      setNote("");
      setReason("");
      setRefId("");
    }
  }, [initial, open, currentUser]);

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const categoryToUse =
        selectedCategory === "__other__"
          ? newCategory.trim()
          : selectedCategory.trim();

      const subcategoryToUse =
        selectedSubcategory === "__other__"
          ? newSubcategory.trim()
          : selectedSubcategory.trim();

      if (!categoryToUse) {
        alert("Please select or enter a category.");
        return;
      }

      if (!subcategoryToUse) {
        alert("Please select or enter a subcategory.");
        return;
      }

      const payload = {
        categoryName: categoryToUse,
        subcategoryName: subcategoryToUse || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category data.");
      }

      await fetchCategories();

      onSave({
        part: `${payload.categoryName} / ${payload.subcategoryName}`,
        quantity,
        note,
        reason,
        refId,
        date,
        addedBy,
      });

      // ✅ Reset form
      setSelectedCategory("");
      setNewCategory("");
      setSelectedSubcategory("");
      setQuantity("");
      setNote("");
      setReason("");
      setRefId("");
      setNewSubcategory("");
    } catch (error) {
      console.error("Error in handleSave:", error.message);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const currentCategoryObj = categories.find(
    (c) =>
      typeof c.name === "string" &&
      typeof selectedCategory === "string" &&
      c.name.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
  );

  return (
    <div className="modal2" style={{ display: "flex" }} onClick={onClose}>
      <div className="modal-content2" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={onClose}>
          ×
        </span>
        <h3>{initial ? "Edit Requirement" : "Add Requirement"}</h3>

        {loading && (
          <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
            Loading...
          </div>
        )}

        {/* ✅ Category Dropdown with "Other" */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value);
            setSelectedSubcategory("");
            if (value !== "__other__") {
              setNewCategory("");
            }
          }}
          disabled={loading}
          required
        >
          <option value="">Select Category</option>
          {categories
            .filter(
              (cat) => typeof cat.name === "string" && cat.name.trim() !== ""
            )
            .map((cat, idx) => (
              <option key={idx} value={cat.name.trim()}>
                {cat.name.trim()}
              </option>
            ))}
          <option value="__other__">Other (Add New)</option>
        </select>

        {/* ✅ New Category Input if "Other" selected */}
        {selectedCategory === "__other__" && (
          <input
            type="text"
            placeholder="Enter New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
            disabled={loading}
          />
        )}

        {/* Subcategory Field (unchanged) */}
        {selectedCategory && (
          <>
            <select
              value={selectedSubcategory}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedSubcategory(value);
                if (value !== "__other__") {
                  setNewSubcategory("");
                }
              }}
              disabled={loading}
              required
            >
              <option value="">Select Subcategory</option>
              {currentCategoryObj?.subcategories?.map((sub, idx) => (
                <option key={idx} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="__other__">Other (Add New)</option>
            </select>

            {selectedSubcategory === "__other__" && (
              <input
                type="text"
                placeholder="Enter New Subcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                required
                disabled={loading}
              />
            )}
          </>
        )}

        {/* Quantity, Note, Reason, etc. */}
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={loading}
          required
        />
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
        />
        <textarea
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Reference Link"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          disabled={loading}
        />
        <input type="text" value={date} disabled />
        <input
          type="text"
          placeholder="Added By"
          value={addedBy}
          onChange={(e) => setAddedBy(e.target.value)}
          disabled={loading}
        />

        <div className="actions">
          <button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
