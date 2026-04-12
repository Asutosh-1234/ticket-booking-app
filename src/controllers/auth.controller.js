import ApiError from "../utils/Api.Error.js";
import ApiResponse from "../utils/Api.Responce.js"
import { pool } from "../../index.mjs";
import pg from "pg";
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


const registration = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw ApiError.badRequestError(res);
    }

    const conn = await pool.connect();

    const sql = 'SELECT * FROM users WHERE email = $1 AND name = $2';
    const data = await conn.query(sql, [email, name]);

    if (data.rows.length > 0) {
        conn.release();
        throw ApiError.conflictError(res, "User Already Exists");
    }

    const hashedPassword = await hashPassword(password);

    const insert_user = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const newUser = await conn.query(insert_user, [name, email, hashedPassword]);

    const user = newUser.rows[0];

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const set_refreshToken = 'UPDATE users SET refresh_token = $1 WHERE id = $2';
    await conn.query(set_refreshToken, [refreshToken, user.id]);

    conn.release();

    res.cookie('AccessToken', accessToken, { httpOnly: true });

    return ApiResponse.created(res, "User Registration Completed", newUser.rows[0]);
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw ApiError.badRequestError(res);
    }

    const conn = await pool.connect();

    const sql = 'SELECT * FROM users WHERE email = $1';
    const result = await conn.query(sql, [email]);

    if (result.rows.length === 0) {
        conn.release();
        throw ApiError.notFoundError(res);
    }

    const user = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        conn.release();
        throw ApiError.badRequestError(res, "Password is Not correct");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await conn.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [refreshToken, user.id]
    );

    conn.release();

    res.cookie('AccessToken', accessToken, { httpOnly: true });

    return ApiResponse.ok(res, "Login Successful", {
        user: { id: user.id, name: user.name, email: user.email },
        accessToken
    });
});

const logout = asyncHandler(async (req, res) => {
    const conn = await pool.connect();

    await conn.query(
        "UPDATE users SET refresh_token = NULL WHERE id = $1",
        [req.user.id]
    );

    const options = {
        httpOnly: true,
        secure: true
    }
    res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
    conn.release();
    return ApiResponse.ok(res, "User logged Out", {})
})

export {
    registration,
    login,
    logout
}