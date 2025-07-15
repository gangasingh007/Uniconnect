import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminLogin, adminRegister, getMe, login, register, updateUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login",login);
router.put("/update",authMiddleware,updateUser);
router.get("/me",authMiddleware,getMe);
router.post("/adminlogin",adminLogin);
router.post("/adminregister",adminRegister);

export default router;