import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMe, login, register, updateUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.put("/update",updateUser);
router.get("/me",authMiddleware,getMe);

export default router;