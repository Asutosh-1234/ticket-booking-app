import ApiError from "../utils/Api.Error.js";
import ApiResponse from "../utils/Api.Responce.js"
import { pool } from "../../index.mjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

async function hashPassword(pass) {
    return bcrypt.hash(pass, 10);
}

function generateAccessToken(user) {
    return jwt.sign(
        {
            _id: user.id,
            email: user.email,
            name: user.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { _id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

const cookieOptions = {
    httpOnly: true,
    secure: true
}

/* 
@params {name, email, password}
@description User Registration
@route POST /api/v1/register
@access public
@returns {user, accessToken, refreshToken}
@success 201
@error 400, 409, 500
*/
const registration = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw ApiError.badRequestError();
    }

    const conn = await pool.connect();

    // fix: check by email only, not email+name
    const sql = 'SELECT * FROM users WHERE email = $1';
    const data = await conn.query(sql, [email]);

    if (data.rows.length > 0) {
        conn.release();
        throw ApiError.conflictError("User Already Exists");
    }

    const hashedPassword = await hashPassword(password);

    const insert_user = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const newUser = await conn.query(insert_user, [name, email, hashedPassword]);

    const user = newUser.rows[0];

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await conn.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, user.id]
    );

    conn.release();

    // fix: send both tokens as cookies
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // fix: delete sensitive fields before sending
    delete user.password;
    delete user.refresh_token;

    // fix: send `user` not `newUser.rows[0]`
    return ApiResponse.created(res, "User Registration Completed", user);
});

/* 
@params {email, password}
@description User Login
@route POST /api/v1/login
@access public
@returns {user, accessToken, refreshToken}
@success 200
@error 400, 404, 500
*/
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw ApiError.badRequestError();
    }

    const conn = await pool.connect();

    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await conn.query(sql, [email]);

    if (result.rows.length === 0) {
        conn.release();
        throw ApiError.notFoundError("User not found");
    }

    const user = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        conn.release();
        throw ApiError.badRequestError("Password is incorrect");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await conn.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, user.id]
    );

    conn.release();

    // fix: consistent cookie name + send refreshToken too
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);

    return ApiResponse.ok(res, "Login Successful", {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken
    });
});

/* 
@params {}
@description User Logout
@route POST /api/v1/logout
@access private
@returns {}
@success 200
@error 400, 404, 500
*/
const logout = asyncHandler(async (req, res) => {
    const conn = await pool.connect();

    await conn.query(
        "UPDATE users SET refresh_token = NULL WHERE id = $1",
        [req.user.id]
    );

    conn.release();

    // fix: consistent cookie names, both cleared
    res
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions);

    return ApiResponse.ok(res, "User logged Out", {});
});

export {
    registration,
    login,
    logout
}