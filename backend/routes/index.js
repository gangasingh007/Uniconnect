import express from "express";
import authrouter from "./auth.routes.js";

const router = express.Router();

router.use("/auth/student",authrouter);
router.use("/auth/cr",authrouter);

export default router;