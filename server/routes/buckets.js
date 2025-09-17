import express from "express";
import { auth } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

// GET /api/buckets
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.customWebsiteBuckets || []);
});

// POST /api/buckets
router.post("/", auth, async (req, res) => {
  const { title, link } = req.body;
  let { image } = req.body;
  const user = await User.findById(req.user.id);

  if (!image || !String(image).trim()) {
    const url = new URL(link);
    const host = url.hostname.replace(/^www\./, "");
    image = `https://logo.clearbit.com/${host}`;
  }

  const item = { id: Date.now().toString(), title, link, image };
  user.customWebsiteBuckets = user.customWebsiteBuckets || [];
  user.customWebsiteBuckets.push(item);
  await user.save();
  res.json(item);
});

// PUT /api/buckets/:id
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { title, link } = req.body;
  let { image } = req.body;
  const user = await User.findById(req.user.id);
  const idx = user.customWebsiteBuckets.findIndex(b => b.id == id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  if (!image || !String(image).trim()) {
    try {
      const url = new URL(link);
      const host = url.hostname.replace(/^www\./, "");
      image = `https://logo.clearbit.com/${host}`;
    } catch (e) {
      image = user.customWebsiteBuckets[idx]?.image || '';
    }
  }

  user.customWebsiteBuckets[idx] = { id, title, link, image };
  await user.save();
  res.json(user.customWebsiteBuckets[idx]);
});

// DELETE /api/buckets/:id
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  user.customWebsiteBuckets = user.customWebsiteBuckets.filter(b => b.id != id);
  await user.save();
  res.json({ success: true });
});

export default router;
