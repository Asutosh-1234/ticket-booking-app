import { Router } from "express";
import { registration, login, logout } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

/* 

@params {name, email, password}
@description User Registration
@route POST /api/v1/register
@access public
@returns {user, accessToken, refreshToken}
    user: {id, name, email}
    accessToken: string
    refreshToken: string
@success 201
@error 400, 409, 500

*/

router.post('/register', registration)

/* 

@params {email, password}
@description User Login
@route POST /api/v1/login
@access public
@returns {user, accessToken, refreshToken}
    user: {id, name, email}
    accessToken: string
    refreshToken: string
@success 200
@error 400, 404, 500

*/

router.post('/login', login)

/* 

@params {}
@description User Logout
@route POST /api/v1/logout
@access private
@returns {}
@success 200
@error 400, 404, 500

*/

router.post('/logout', verifyJWT, logout)

export default router;