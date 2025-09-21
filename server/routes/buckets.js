import express from "express";
import { auth } from "../middleware/auth.js";
import { Website } from "../models/Website.js"; 

const router = express.Router();

// GET /api/buckets
// This route will fetch and display all websites for all users.
router.get("/", auth, async (req, res) => {
    try {
        const allWebsites = await Website.find();
        res.json(allWebsites);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/buckets
// This route will save a new website to the database, making it visible to everyone.
router.post("/", auth, async (req, res) => {
    const { title, link } = req.body;
    let { image } = req.body;

    try {
        // Automatically generate an image URL if one isn't provided.
        if (!image || !String(image).trim()) {
            const url = new URL(link);
            const host = url.hostname.replace(/^www\./, "");
            image = `https://logo.clearbit.com/${host}`;
        }

        // Create a new website instance.
        const newWebsite = new Website({
            title,
            link,
            image,
            createdBy: req.user.id // The ID of the user who created it.
        });

        // Save the new website to the centralized database.
        await newWebsite.save();
        res.status(201).json(newWebsite);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/buckets/:id
// This route will update an existing website.
router.put("/:id", auth, async (req, res) => {
    const { id } = req.params;
    const { title, link, image } = req.body;

    try {
        // Find and update the website by its ID from the Website model.
        const updatedWebsite = await Website.findByIdAndUpdate(
            id,
            { title, link, image },
            { new: true } // Returns the updated document.
        );

        if (!updatedWebsite) {
            return res.status(404).json({ message: "Website not found" });
        }

        res.json(updatedWebsite);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/buckets/:id
// This route will delete a website, so it is removed for all users.
router.delete("/:id", auth, async (req, res) => {
    const { id } = req.params;

    try {
        // Find and delete the website by its ID from the Website model.
        const deletedWebsite = await Website.findByIdAndDelete(id);

        if (!deletedWebsite) {
            return res.status(404).json({ message: "Website not found" });
        }

        res.json({ success: true, message: "Website deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;