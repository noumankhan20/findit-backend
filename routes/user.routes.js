import express from "express"
import { signup,login,logout,getMe,getMyItems,updateProfile,forgotPassword,resetPassword } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout)
router.get("/getme",protect,getMe)
router.get("/my-items", protect, getMyItems);
router.put("/update-profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", resetPassword);
const userRoutes= router;
export default userRoutes;