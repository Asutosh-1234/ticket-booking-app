import ApiError from "../utils/Api.Error.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { pool } from "../../index.mjs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/* 
This is a middleware to verify Access Token

@params {req, res, next}
@description Verify JWT
@access private
@returns {req.user}
@success 200
@error return login.html

*/


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.sendFile(path.join(__dirname, "../../login.html"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const conn = await pool.connect();
        const result = await conn.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [decodedToken._id]
        );
        conn.release();

        const user = result.rows[0];

        if (!user) {
            return res.sendFile(path.join(__dirname, "../../login.html"));
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});