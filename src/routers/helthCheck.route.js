import { helthCheck } from "../controllers/helthCheck.controller.js";
import { Router } from "express";

const router = Router()

router.get('/',helthCheck);

export default router;