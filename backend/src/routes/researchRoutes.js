import express from "express";
import { handleResearch } from "../controllers/researchController.js";

const router = express.Router();

router.post("/research", handleResearch);

export default router;
