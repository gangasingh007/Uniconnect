import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createYtresource } from "../controllers/resource.controller.js";



const router = express.Router();


router.post("/:classId/:subjectId",authMiddleware,adminMiddleware,createYtresource)

export default router;