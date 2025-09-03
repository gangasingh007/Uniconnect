import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createDocumentResource, createYtresource, deleteResource, getAllClassResources, getResources, summarizeDocumentGemini, updateResource } from "../controllers/resource.controller.js";

const router = express.Router();

router.get("/:classId/:subjectId",authMiddleware,getResources)
router.post("/:classId/:subjectId",authMiddleware,adminMiddleware,createYtresource)
router.delete("/:classId/:subjectId/:resourceId",authMiddleware,adminMiddleware,deleteResource);
router.put("/:subjectId/:classId/:resourceId",authMiddleware,adminMiddleware,updateResource)
router.get('/all', authMiddleware, getAllClassResources);
router.post('/:classId/:subjectId/document-link', authMiddleware,adminMiddleware, createDocumentResource);
router.get('/gemini-summarize/:classId/:subjectId/:resourceId', summarizeDocumentGemini);



export default router;