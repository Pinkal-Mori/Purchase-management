import { useEffect, useState } from "react";

export default function RequirementForm({
  open,
  onClose,
  initial,
  onSave,
  currentUser,
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [refId, setRefId] = useState("");
  const [date, setDate] = useState("");
  const [addedBy, setAddedBy] = useState("");
  const [loading, setLoading] = useState(false);

  // Default categories - kept as a constant
  // This array will be the base for all categories
  const defaultCategories = [
    {
      category: "Embedded Solutions",
      subcategories: [
        "Development",
        "Audio Speech",
        "Ethernet",
        "USB-RS232-Serial",
        "RS485",
        "Wireless Communication",
        "LoRa",
        "Barcode",
        "ESP32 Series",
        "ESP8266 Series",
        "Remote Control",
        "USB Host",
        "Displays",
        "Sensors",
      ],
    },
    {
      category: "Connectors",
      subcategories: [
        "JST XH 2.5mm",
        "JST PH 2.0mm",
        "JST 1.25mm",
        "FFC - FPC - 0.5mm",
        "FFC - FPC - 1mm",
        "Mini Fit",
        "Berg 2.5mm",
        "FRC IDC Flat Cable - Box Header",
        "Header Strips",
        "Screw Terminal Fixed",
        "Screw Terminal Pluggable",
        "Barrier Terminal Blocks",
        "USB",
        "JST VH 3.96mm",
        "CPU CH 3.96mm",
        "JST SM",
        "Signals",
        "Battery Holder",
        "Power DC",
        "Power AC",
        "IC Socket",
        "D-Type",
        "Memory Card",
        "SIM Card Holders",
        "Banana Terminals",
        "Round Shell",
        "Audio Stereo",
        "Video HDMI",
        "RF Antenna",
        "Ethernet",
        "Wire to Wire",
        "Wires",
        "Wire Crimp Terminals",
        "Ferrule (Bootlace)",
        "Quick Disconnect Terminal",
        "Waterproof Connectors",
        "SATA HDD SSD",
        "B2B Board to Board",
      ],
    },
    {
      category: "Switches",
      subcategories: [
        "6x6mm Size",
        "12x12mm Size",
        "4.5x4.5mm Size",
        "4x4mm Size",
        "3x6mm Size",
        "6.5x6.5 Size",
        "SMD Switches",
        "12x12x7.3mm Size",
        "6x6x7.3mm Size",
        "Silent Switches",
        "Switches with LEDs",
        "6x6x7.2mm LED",
        "7x7x7mm LED",
        "Key Switch 17x12.5mm",
        "Dome Switch",
        "Slide Switches",
        "DIP",
        "Membrane / Matrix",
        "Navigation",
        "Rocker",
        "Push ON/OFF",
        "Panel Mount",
        "Limit",
        "Toggle",
        "Key Switches",
        "Thumbwheel Switch",
        "Rotary Encoder",
        "Tact Key Switch",
      ],
    },
    {
      category: "Cap and Knobs",
      subcategories: [
        "SW 6x6 R6.2",
        "SW 6x6 R5.5",
        "SW 6x6 R8 H10",
        "SW 6x6 R8",
        "SW 6x6 R10",
        "SW 6x6 R7.5",
        "Silicone R5.5",
        "Silicone R6",
        "Silicone R6.1",
        "Silicone R6.4",
        "Silicone R8",
        "SW 12x12 R11.5",
        "SW 12x12x7.3 R8.9",
        "SW 12x12x7.3 S9.2",
        "SW 12x12x7.3 S10",
        "SW 12x12x7.3 S12",
        "SW 12x12x7.3 R11.5",
        "SW 6x6x7.3 R6.7",
        "SW 6x6x7.3 R8",
        "SW 6x6x7.3 R6",
        "SW 4.5x4.5 R6x7",
        "SW 4.5x4.5 R6x22",
        "Switch Cap 3x2 Head",
        "R13.6 Stem 3x2",
        "Switch Cap 3.3 Square Head",
        "SW LED 6x6x7.2 R10",
        "Knob for Slide Switch",
        "Knob",
        "Knob - Bakelite",
      ],
    },
    {
      category: "Passive Components",
      subcategories: [
        "Inductors",
        "Resistors SMD",
        "Capacitors - SMD - MLCC",
        "Capacitors - Through Hole - Electrolytic",
        "Capacitors - SMD - Electrolytic",
        "Variable Resistors",
        "Potentiometer",
        "Crystals",
        "Transformers",
        "Relays",
        "Battery",
        "MIC",
        "Buzzer",
        "Resistors Though Hole",
      ],
    },
    {
      category: "Active Components",
      subcategories: [
        "Microcontroller",
        "Megawin 8051",
        "USB",
        "Touch Sensing",
        "Audio",
        "Optocouplers",
        "Opamp",
        "Memory",
        "Power Regulator",
        "Various ICs",
        "Triac",
        "Mosfets",
        "Transistors",
        "Diodes & Rectifiers",
        "Zener Diodes",
      ],
    },
    {
      category: "Power Supply",
      subcategories: [
        "AC to DC SMPS",
        "DC-DC Step-Down Buck",
        "DC-DC Step-Up Boost",
        "DC-DC Step Up/Down Buck/Boost",
        "Battery Charger",
        "SSR",
        "DC-DC Isolation",
      ],
    },
    {
      category: "Optoelectronics",
      subcategories: [
        "Displays",
        "LED Indication",
        "LED Lighting",
        "Side SMD LED",
        "Panel Indicators",
      ],
    },
    {
      category: "Prototyping & Testing",
      subcategories: [
        "ZIF Sockets & Test Clips",
        "Adapter PCBs",
        "Test Probes",
        "Wire Test Hooks",
        "Jumper Wires",
        "3D Printing Filaments",
      ],
    },
    {
      category: "Circuit Protection",
      subcategories: ["Fuse", "TVS/ESD/Surge", "EMI", "MOV/ZOV", "NTC"],
    },
    {
      category: "Hardware",
      subcategories: [
        "PCB Standoff spacer",
        "PCB Spacer - Threaded",
        "PCB Spacer - Snap Fit",
        "Spacers - Hex - M3 Threads",
        "Spacers - Hex - No Threads",
        "Nuts and Bolts",
        "Screw Nut Plastic",
        "Cable Glands",
        "Heatsink",
        "Protective",
        "Enclosures",
        "Tools Equipment",
        "Heat Shrink Tubing",
        "Door Latch",
        "Drill Bits",
      ],
    },
    {
      category: "LED Accessories",
      subcategories: ["LED Spacer", "LED Holder", "LED Light Guide"],
    },
  ];

  const [allCategories, setAllCategories] = useState(defaultCategories);
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const dbService = {
    loadCategories: async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error loading categories:", error);
        return []; // Return an empty array on failure
      }
    },
    addCategory: async (categoryData) => {
      // ... (no changes needed here)
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add category");
        }
        const updatedList = await dbService.loadCategories();
        return { success: true, data: updatedList };
      } catch (error) {
        console.error("Error adding category:", error.message);
        return { success: false, message: error.message };
      }
    },
    updateCategory: async (categoryName, newSubcategory) => {
      // ... (no changes needed here)
      try {
        const response = await fetch(`/api/categories/${categoryName}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newSubcategory }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update category");
        }
        const updatedList = await dbService.loadCategories();
        return { success: true, data: updatedList };
      } catch (error) {
        console.error("Error updating category:", error.message);
        return { success: false, message: error.message };
      }
    },
  };

  // The main change is in this useEffect hook
  useEffect(() => {
    const loadCategories = async () => {
      if (open) {
        setLoading(true);
        try {
          const backendCategories = await dbService.loadCategories();
          
          // Merge the default categories with the categories from the backend.
          // This ensures that the default list is always present.
          const mergedCategories = [...defaultCategories];
          
          backendCategories.forEach(backendCat => {
            const existingCatIndex = mergedCategories.findIndex(
              (cat) => cat.category === backendCat.category
            );
            
            if (existingCatIndex !== -1) {
              // If the category exists, merge its subcategories
              const existingSubcategories = new Set(mergedCategories[existingCatIndex].subcategories);
              backendCat.subcategories.forEach(sub => existingSubcategories.add(sub));
              mergedCategories[existingCatIndex].subcategories = Array.from(existingSubcategories);
            } else {
              // If the category is new, add it to the list
              mergedCategories.push(backendCat);
            }
          });
          
          setAllCategories(mergedCategories);
        } catch (error) {
          console.error("Error loading categories:", error);
          // If the backend call fails, the state remains with the default categories, which is the desired behavior.
          setAllCategories(defaultCategories);
        } finally {
          setLoading(false);
        }
      }
    };

    loadCategories();
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
      setSelectedSubcategory("");
      setQuantity("");
      setNote("");
      setReason("");
      setRefId("");
    }
  }, [initial, open, currentUser]);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setShowCustomCategoryInput(true);
      setSelectedCategory("");
      setSelectedSubcategory("");
    } else {
      setShowCustomCategoryInput(false);
      setSelectedCategory(value);
      setSelectedSubcategory("");
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      let finalCategory = selectedCategory;
      let finalSubcategory = selectedSubcategory;

      if (showCustomCategoryInput && newCategory.trim()) {
        finalCategory = newCategory.trim();
        const categoryData = {
          category: finalCategory,
          subcategories: newSubcategory.trim() ? [newSubcategory.trim()] : [],
          createdBy: currentUser?.name || addedBy,
          createdAt: new Date().toISOString(),
        };

        const result = await dbService.addCategory(categoryData);

        if (result.success) {
          setAllCategories(result.data);
          if (newSubcategory.trim()) {
            finalSubcategory = newSubcategory.trim();
          }
        } else {
          alert(result.message || "Failed to add category");
          setLoading(false);
          return;
        }
      }

      if (finalCategory && newSubcategory.trim() && selectedSubcategory === "add_new") {
        const result = await dbService.updateCategory(
          finalCategory,
          newSubcategory.trim()
        );

        if (result.success) {
          setAllCategories(result.data);
          finalSubcategory = newSubcategory.trim();
        } else {
          alert(result.message || "Failed to add subcategory");
          setLoading(false);
          return;
        }
      }

      if (!finalCategory || !finalSubcategory) {
        alert("Please select or add category & subcategory");
        setLoading(false);
        return;
      }

      onSave({
        part: `${finalCategory} / ${finalSubcategory}`,
        quantity,
        note,
        reason,
        refId,
        date,
        addedBy,
      });

      setShowCustomCategoryInput(false);
      setNewCategory("");
      setNewSubcategory("");
      setSelectedCategory("");
      setSelectedSubcategory("");
      setQuantity("");
      setNote("");
      setReason("");
      setRefId("");
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const currentCategoryObj = allCategories.find(
    (c) => c.category === selectedCategory
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

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={loading}
        >
          <option value="" disabled>
            Select Category
          </option>
          {allCategories.map((cat, idx) => (
            <option key={idx} value={cat.category}>
              {cat.category}
            </option>
          ))}
          <option value="add_new">-- Add New Category --</option>
        </select>

        {showCustomCategoryInput && (
          <input
            type="text"
            placeholder="Enter New Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            disabled={loading}
            style={{ marginTop: "10px" }}
          />
        )}

        {(selectedCategory || showCustomCategoryInput) && (
          <select
            value={selectedSubcategory}
            onChange={(e) => {
              if (e.target.value === "add_new")
                setSelectedSubcategory("add_new");
              else setSelectedSubcategory(e.target.value);
            }}
            disabled={loading}
          >
            <option value="" disabled>
              Select Subcategory
            </option>
            {currentCategoryObj?.subcategories.map((sub, idx) => (
              <option key={idx} value={sub}>
                {sub}
              </option>
            ))}
            <option value="add_new">-- Add New Subcategory --</option>
          </select>
        )}

        {selectedSubcategory === "add_new" && (
          <input
            type="text"
            placeholder="Enter New Subcategory Name"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            disabled={loading}
            style={{ marginTop: "10px" }}
          />
        )}

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={loading}
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