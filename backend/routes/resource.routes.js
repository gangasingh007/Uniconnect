import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createYtresource, deleteResource, getResources, updateResource, uploadResourceDocument } from "../controllers/resource.controller.js";
import multerUpload from "../middlewares/multer.js";



const router = express.Router();

router.get("/:classId/:subjectId",authMiddleware,getResources)
router.post("/:classId/:subjectId",authMiddleware,adminMiddleware,createYtresource)
router.delete("/:classId/:subjectId/:resourceId",authMiddleware,adminMiddleware,deleteResource);
router.put("/:subjectId/:classId/:resourceId",authMiddleware,adminMiddleware,updateResource)
router.post("/upload/:classId/:subjectId",authMiddleware,adminMiddleware,multerUpload.single("file"),uploadResourceDocument)

export default router;