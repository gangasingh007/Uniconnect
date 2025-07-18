import express from "express";
import authrouter from "./auth.routes.js";
import classRouter from "./class.router.js"

const router = express.Router();

router.use("/auth/student",authrouter);
router.use("/class",classRouter);


export default router;