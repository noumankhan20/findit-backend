import express from "express"
import { createLostItem,getAllLostItems,getMyLostItems } from "../controllers/lostitem.controller.js"
import {protect} from "../middlewares/auth.middleware.js"
import {createUploader} from "../middlewares/multer.middleware.js";


const router = express.Router();
const uploadLost= createUploader("lost-items")
router.post("/create",protect,uploadLost.array("images",3),createLostItem)
router.get("/getall",getAllLostItems)
router.get("/get",protect,getMyLostItems)



const lostItemRoutes= router;
export default lostItemRoutes