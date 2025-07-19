import express from "express";
import { createSubject } from "../controllers/subject.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/create-subject/:id",authMiddleware,adminMiddleware,createSubject)


export default router