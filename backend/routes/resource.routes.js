import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { getResources } from "../controllers/resource.controller.js";


const router = express.Router();


router.post("/:id",authMiddleware,adminMiddleware)
router.get("/:id",getResources)

export default router;