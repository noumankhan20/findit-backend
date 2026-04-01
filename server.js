import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from 'path';
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.config.js";
import userRoutes from "./routes/user.routes.js";
import lostItemRoutes from "./routes/lostItem.routes.js";
import foundRoutes from "./routes/foundItem.routes.js";
import claimRoutes from "./routes/claim.routes.js";
dotenv.config();

const app = express();

// ✅ Middlewares
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(path.join(process.cwd(),"uploads")))
// ✅ DB Connection
await connectDB();


// Routes configuration
app.use("/api/user",userRoutes)
app.use("/api/lost",lostItemRoutes)
app.use("/api/found",foundRoutes)
app.use("/api/claim",claimRoutes)
// ✅ Test Route
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

// ✅ Start Server
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});