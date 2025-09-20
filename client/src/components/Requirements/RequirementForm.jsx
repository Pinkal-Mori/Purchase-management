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
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [refId, setRefId] = useState("");
  const [date, setDate] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to fetch all categories from the backend
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
      // In case of an error, reset the categories to an empty array
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories when the form opens
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Handle initialization or reset of form fields
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
      const payload = {
        categoryName: selectedCategory.trim(),
        subcategoryName: selectedSubcategory.trim() || undefined,
      };

      // Send the data to the backend API
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category data.");
      }

      // Re-fetch the categories to update the list with the new data
      await fetchCategories();

      // Proceed with saving the form data if both fields are not empty
      if (!payload.categoryName || !payload.subcategoryName) {
        alert("Please select or enter both a category and a subcategory.");
        return;
      }
      
      onSave({
        part: `${payload.categoryName} / ${payload.subcategoryName}`,
        quantity,
        note,
        reason,
        refId,
        date,
        addedBy,
      });

      // Clear the form fields after successful save
      setSelectedCategory("");
      setSelectedSubcategory("");
      setQuantity("");
      setNote("");
      setReason("");
      setRefId("");

    } catch (error) {
      console.error("Error in handleSave:", error.message);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const currentCategoryObj = categories.find((c) => c.name === selectedCategory);

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

        <input
          type="text"
          list="category-list"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          placeholder="Select or enter Category"
          disabled={loading}
          required
        />
        <datalist id="category-list">
          {categories.map((cat, idx) => (
            <option key={idx} value={cat.name} />
          ))}
        </datalist>

        {selectedCategory && (
          <>
            <input
              type="text"
              list="subcategory-list"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              placeholder="Select or enter Subcategory"
              disabled={loading}
              required
            />
            <datalist id="subcategory-list">
              {currentCategoryObj?.subcategories.map((sub, idx) => (
                <option key={idx} value={sub} />
              ))}
            </datalist>
          </>
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={loading}
          required
        />
        {/* ... (other form fields like note, reason, etc.) */}
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