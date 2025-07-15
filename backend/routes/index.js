import express from "express";
import authrouter from "./auth.routes.js";

const router = express.Router();

router.use("/auth/user",authrouter);
router.use("/auth/admin",authrouter);

export default router;