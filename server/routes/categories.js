import express from "express";

const router = express.Router();

// In-memory data store. For a real app, you would fetch and save this data to a database.
const categoriesData = [
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

// GET endpoint to load all categories
router.get("/", (req, res) => {
    console.log('GET /api/categories called');
    res.status(200).json(categoriesData);
});

// POST endpoint to add a new category
router.post("/", (req, res) => {
    const newCategory = req.body;
    console.log('POST /api/categories called with data:', newCategory);

    if (!newCategory || !newCategory.category) {
        return res.status(400).json({ message: "Category name is required." });
    }

    const categoryExists = categoriesData.some(cat => 
        cat.category.toLowerCase() === newCategory.category.toLowerCase()
    );

    if (categoryExists) {
        return res.status(409).json({ message: "Category already exists." });
    }

    const categoryToAdd = {
        category: newCategory.category,
        subcategories: Array.isArray(newCategory.subcategories) ? newCategory.subcategories : [],
    };
    categoriesData.push(categoryToAdd);
    
    res.status(201).json(categoriesData);
});

// PUT endpoint to update an existing category by adding a subcategory
router.put("/:categoryName", (req, res) => {
    const categoryName = req.params.categoryName;
    const { newSubcategory } = req.body;
    console.log(`PUT /api/categories/${categoryName} called with new subcategory: ${newSubcategory}`);

    const categoryObj = categoriesData.find(cat => cat.category === categoryName);

    if (!categoryObj) {
        return res.status(404).json({ message: "Category not found." });
    }

    if (!newSubcategory) {
        return res.status(400).json({ message: "New subcategory is required." });
    }

    const subcategoryExists = categoryObj.subcategories.some(sub => 
        sub.toLowerCase() === newSubcategory.toLowerCase()
    );

    if (subcategoryExists) {
        return res.status(200).json(categoriesData);
    }
    
    categoryObj.subcategories.push(newSubcategory);

    res.status(200).json(categoriesData);
});

export default router;