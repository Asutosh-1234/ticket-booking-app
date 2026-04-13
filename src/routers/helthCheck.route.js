import { helthCheck } from "../controllers/helthCheck.controller.js";
import { Router } from "express";

const router = Router()

/* 

@params {}
@description Health Check
@route GET /api/healthCheck
@access public
@returns {}
@success 200

*/

router.get('/',helthCheck);

export default router;