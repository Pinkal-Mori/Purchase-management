import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Utility: Generate JWT token
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ✅ SIGNUP
// ...
router.post("/signup", async (req, res) => {
  try {
    const { name, contact, email, password } = req.body;

    if (!name || !email || !password || !contact) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    // અહીં સુધારો છે:
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.signup_method === 'google') {
        return res.status(400).json({
          message: "તમે Google વડે સાઇનઅપ કર્યું છે. કૃપા કરીને Google વડે લોગિન કરો."
        });
      }
      return res.status(400).json({ message: "આ ઇમેઇલ પહેલેથી જ રજીસ્ટર થયેલું છે." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      contact,
      email,
      password: hashed,
      signup_method: 'email', // અહીં નવું ફીલ્ડ ઉમેર્યું
      customWebsiteBuckets: [],
    });

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        profileImage: user.profileImage,
        customWebsiteBuckets: user.customWebsiteBuckets,
      },
    });
  } catch (e) {
    console.error("Signup Error:", e);
    res.status(500).json({ message: "Something went wrong during signup." });
  }
});

// ✅ LOGIN (with email or contact)
// ...
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email/contact and password are required." });
    }

    const user = await User.findOne({
      $or: [{ email }, { contact: email }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "You don't have an account. Please sign up." });
    }

    // અહીં સુધારો છે:
    if (user.signup_method === 'google') {
      return res.status(400).json({
        message: "તમે Google વડે સાઇનઅપ કર્યું છે. કૃપા કરીને Google વડે લોગિન કરો."
      });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        profileImage: user.profileImage,
        customWebsiteBuckets: user.customWebsiteBuckets,
      },
    });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({
      message: "Something went wrong during login.",
      detail: e.message
    });
  }
});
// ...
// POST /auth/google-login
// ...
router.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload; // 'sub' એ Google ID છે

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: null, // પાસવર્ડને null રાખો
        signup_method: 'google', // અહીં નવું ફીલ્ડ ઉમેર્યું
        googleId: sub, // Google ID સ્ટોર કરો
        profileImage: picture,
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (e) {
    console.error("Google login error:", e);
    res.status(500).json({ message: "Google login failed", detail: e.message });
  }
});



// ✅ GET /me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        profileImage: user.profileImage,
        customWebsiteBuckets: user.customWebsiteBuckets,
      },
    });
  } catch (e) {
    console.error("Get /me Error:", e);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
});

// ✅ UPDATE PASSWORD
router.post("/password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Incorrect old password" });

    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password too short" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully." });
  } catch (e) {
    console.error("Password Update Error:", e);
    res.status(500).json({ message: "Failed to update password." });
  }
});

// ✅ UPDATE PROFILE IMAGE
router.post("/profile-image", auth, async (req, res) => {
  try {
    const { image } = req.body; // base64
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: image },
      { new: true }
    );

    res.json({ profileImage: user.profileImage });
  } catch (e) {
    console.error("Profile Image Update Error:", e);
    res.status(500).json({ message: "Failed to update profile image." });
  }
});

// ✅ GET ALL USERS
router.get("/all-users", auth, async (req, res) => {
  try {
    const users = await User.find({}, "_id name email");
    res.json({ users });
  } catch (e) {
    console.error("Get All Users Error:", e);
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

export default router;
