import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
// import path from "path";
// import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";


// Routes
import authRoutes from "./routes/auth.js";
import requirementRoutes from "./routes/requirements.js";
import bucketRoutes from "./routes/buckets.js";
import userRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

// Base test route
app.get("/", (req, res) => res.send("FT MERN API running"));

// APIs
app.use("/api/auth", authRoutes);
app.use("/api/requirements", requirementRoutes);
app.use("/api/buckets", bucketRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(async () => {
  // await seedCategories();
  app.listen(PORT, () => console.log("✅ Server on port", PORT));

})
  .catch(err => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });