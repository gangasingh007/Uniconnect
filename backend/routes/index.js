import express from "express";
import authrouter from "./auth.routes.js";
import classRouter from "./class.router.js"
import subjectRouter from "./subject.routes.js"

const router = express.Router();

router.use("/auth/student",authrouter);
router.use("/class",classRouter);
router.use("/subject",subjectRouter)


export default router;