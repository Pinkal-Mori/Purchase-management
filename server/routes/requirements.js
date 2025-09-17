import express from "express";
import { auth } from "../middleware/auth.js";
import { Requirement } from "../models/Requirement.js";

const router = express.Router();

// GET /api/requirements?user=&date=&status=&month=&year=
router.get("/", auth, async (req, res) => {
  const { user, date, status, month, year } = req.query;
  const filter = {};

  if (user) filter.addedBy = new RegExp(user, "i");
  if (date) filter.date = date;
  if (status === "pending") filter.$or = [{ orderId: { $exists: false } }, { orderId: "" }];
  if (status === "placed") filter.orderId = { $exists: true, $ne: "" };

  // 🆕 Month/Year filter logic
  if (month && year) {
    // date format: YYYY-MM-DD
    const regex = new RegExp(`^${year}-${month.padStart(2, "0")}`);
    filter.date = regex;
  } else if (year) {
    const regex = new RegExp(`^${year}`);
    filter.date = regex;
  } else if (month) {
    // If only month given → match any year with that month
    const regex = new RegExp(`^\\d{4}-${month.padStart(2, "0")}`);
    filter.date = regex;
  }

  try {
    const list = await Requirement.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("Error fetching requirements:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/requirements
router.post("/", auth, async (req, res) => {
  try {
    const data = req.body;

    // 🆕 Ensure amount always has value
    if (data.amount === undefined) {
      data.amount = 0;
    }

    const item = await Requirement.create(data);
    res.json(item);
  } catch (err) {
    console.error("Error creating requirement:", err);
    res.status(400).json({ error: "Invalid data", details: err.message });
  }
});

// PUT /api/requirements/:id
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Requirement.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Requirement not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating requirement:", err);
    res.status(400).json({ error: "Invalid update", details: err.message });
  }
});

// DELETE /api/requirements/:id
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Requirement.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Requirement not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting requirement:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Mark requirement as viewed
router.put("/:id/view", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const reqDoc = await Requirement.findById(id);
    if (!reqDoc) return res.status(404).json({ error: "Requirement not found" });

    const existing = reqDoc.views?.find(v => v.userId === userId);
    if (existing) {
      existing.viewed = true;
    } else {
      if (!reqDoc.views) reqDoc.views = [];
      reqDoc.views.push({ userId, viewed: true });
    }

    await reqDoc.save();
    res.json(reqDoc);
  } catch (err) {
    console.error("Error marking view:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
