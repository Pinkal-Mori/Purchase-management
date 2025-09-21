import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { OAuth2Client } from "google-auth-library";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

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

// Email transporter (supports real SMTP or Ethereal fallback for dev/testing)
let cachedTransporterPromise;
function getTransporter() {
  if (!cachedTransporterPromise) {
    const hasSmtp = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
    if (hasSmtp) {
      const port = Number(process.env.SMTP_PORT) || 587;
      const secureFlag = String(process.env.SMTP_SECURE || "").toLowerCase();
      const secure = secureFlag === "true" || port === 465;
      console.log("[mail] Using real SMTP:", {
        host: process.env.SMTP_HOST,
        port,
        secure,
        user: process.env.SMTP_USER,
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
      });
      cachedTransporterPromise = Promise.resolve(
        nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port,
          secure,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        })
      );
    } else {
      cachedTransporterPromise = nodemailer.createTestAccount().then((testAccount) => {
        const transport = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.log("[mail] Using Ethereal test SMTP. Preview links will be logged.");
        return transport;
      });
    }
  }
  return cachedTransporterPromise;
}

async function sendPasswordResetOTP(toEmail, otp) {
  const transporter = await getTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || "no-reply@example.com";
  const appName = process.env.APP_NAME || "Purchase Management";
  const info = await transporter.sendMail({
    from: `${appName} <${from}>`,
    to: toEmail,
    subject: `${appName} - Password Reset OTP`,
    html: `
      <p>We received a request to reset your password.</p>
      <p>Your OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
  // Log preview URL for Ethereal
  const preview = nodemailer.getTestMessageUrl?.(info);
  if (preview) {
    console.log("[mail] Preview URL:", preview);
  }
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
        signup_method: user.signup_method,
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
        signup_method: user.signup_method,
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
        signup_method: user.signup_method,
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
        signup_method: user.signup_method,
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

    if (user.signup_method === 'google') {
      return res.status(400).json({ message: "Password is managed by Google account." });
    }

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

// ✅ DELETE PROFILE IMAGE
router.delete("/profile-image", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Handle Google accounts that have a profile picture from Google
    if (user.signup_method === 'google') {
      // If you want to remove Google image, set profileImage to null
      user.profileImage = null;
      await user.save();
      return res.status(200).json({ message: "Google profile picture removed." });
    }

    if (!user.profileImage) {
      return res.status(200).json({ message: "No profile image to delete." });
    }
    const imagePath = path.join(__dirname, '..', user.profileImage);

    // Check if the file exists before trying to delete it
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log(`Successfully deleted file: ${imagePath}`);
    } else {
      console.warn(`File not found, but updating database: ${imagePath}`);
    }

    // Update the database to remove the profile image path
    user.profileImage = null;
    await user.save();

    res.status(200).json({ message: "Profile picture deleted successfully." });

  } catch (e) {
    console.error("Delete Profile Image Error:", e);
    res.status(500).json({ message: "Failed to delete profile picture." });
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

// ✅ REQUEST PASSWORD RESET (email users only) - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    // Always return success to avoid user enumeration
    if (!user) return res.json({ message: "If that account exists, an OTP has been sent." });

    if (user.signup_method === 'google') {
      return res.json({ message: "This email uses Google sign-in. Use Google to login." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    await sendPasswordResetOTP(email, otp);

    res.json({ message: "If that account exists, an OTP has been sent to your email." });
  } catch (e) {
    console.error("Forgot Password Error:", e && (e.stack || e.message || e));
    res.status(500).json({ message: "Failed to send OTP." });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or OTP." });
    if (user.signup_method === 'google') return res.status(400).json({ message: "Google account cannot reset password here." });

    const isValid = user.resetPasswordOTP && user.resetPasswordOTP === otp;
    const notExpired = user.resetPasswordOTPExpiresAt && user.resetPasswordOTPExpiresAt > new Date();
    
    if (!isValid || !notExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    res.json({ message: "OTP verified successfully. You can now reset your password." });
  } catch (e) {
    console.error("Verify OTP Error:", e && (e.stack || e.message || e));
    res.status(500).json({ message: "Failed to verify OTP." });
  }
});

// ✅ RESET PASSWORD WITH OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or OTP." });
    if (user.signup_method === 'google') return res.status(400).json({ message: "Google account password cannot be reset here." });

    const isValid = user.resetPasswordOTP && user.resetPasswordOTP === otp;
    const notExpired = user.resetPasswordOTPExpiresAt && user.resetPasswordOTPExpiresAt > new Date();
    
    if (!isValid || !notExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiresAt = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (e) {
    console.error("Reset Password Error:", e && (e.stack || e.message || e));
    res.status(500).json({ message: "Failed to reset password." });
  }
});

export default router;
