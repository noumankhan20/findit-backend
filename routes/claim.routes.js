import express from "express";
import {
  createClaim,
  getMyClaims,
  approveClaim,
  rejectClaim,
  getClaimsMadeByMe,
} from "../controllers/claim.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createClaim);
router.get("/my-claims", protect, getMyClaims);
router.put("/:id/approve", protect, approveClaim);  
router.put("/:id/reject", protect, rejectClaim);
router.get("/claimed",protect,getClaimsMadeByMe)
const claimRoutes= router;
export default claimRoutes;