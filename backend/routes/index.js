import express from "express";
import authrouter from "./auth.routes.js";
import classRouter from "./class.router.js"
import subjectRouter from "./subject.routes.js"
import resourceRouter from "./resource.routes.js"
import statsRouter from "./stats.routes.js" 

const router = express.Router();

router.use("/auth/student",authrouter);
router.use("/class",classRouter);
router.use("/subject",subjectRouter)
router.use("/resource",resourceRouter)
router.use("/stats",statsRouter)

export default router;