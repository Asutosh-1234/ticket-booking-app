import { Router } from "express";
import { registration, login, logout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register', registration)
router.post('/login', login)
router.post('/logout', verifyJWT, logout)

export default router;