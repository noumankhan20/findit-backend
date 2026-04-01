import express from "express";
import {
  createFoundItem,
  getAllFoundItems,
  getMyFoundItems,
} from "../controllers/foundItem.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import {createUploader} from "../middlewares/multer.middleware.js";

const router = express.Router();
const uploadFound= createUploader("found-items")
router.post("/create", protect, uploadFound.array("images", 3), createFoundItem);
router.get("/getall", getAllFoundItems);
router.get("/get", protect, getMyFoundItems);

const foundRoutes = router;
export default foundRoutes;