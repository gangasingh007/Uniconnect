import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createYtresource, getResources, uploadResource } from "../controllers/resource.controller.js";
import { upload } from "../middlewares/upload.js";



const router = express.Router();


router.post("/:classId/:subjectId",authMiddleware,adminMiddleware,createYtresource)
router.get("/:classId/:subjectId",getResources)
router.post("/upload/:classId/:subjectId",authMiddleware,adminMiddleware,upload.single("file"),uploadResource)

export default router;