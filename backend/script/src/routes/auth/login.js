const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkEmailUsed, getUserPassword, getUserId } = require("./auth.query");
const { createError } = require("../../helperError/createError");

router.post('/', async(req, res) => {
    try {
        const {email, password} = req.body;
        
        if (!email || !password) {
            throw createError("Email and password are required", {statusCode: 400, code: "MISSING_FIELDS"});
        }

        const isUsedMail = await checkEmailUsed(email);
        if (isUsedMail[0]["COUNT(*)"] == 0) {
            throw createError("Invalid email or password", {statusCode: 401, code: "INVALID_CREDENTIALS"});
        }
        
        const userPassword = await getUserPassword(email);
        const user_id = await getUserId(email);
        if (await bcrypt.compare(password, userPassword[0]["password"]) === false) {
            throw createError("Invalid email or password", {statusCode: 401, code: "INVALID_CREDENTIALS"});
        }

        let data = {
            signInTime: Date.now(),
            email: email,
            user_id: user_id
        };

        const isHttps = process.env.FRONTEND_URL?.startsWith('https://');

        const token = await jwt.sign(data, process.env.SECRET, { expiresIn: "1h" });
        res.cookie('accessToken', token, { httpOnly: true, secure: isHttps, sameSite: isHttps ? "none" : "lax", maxAge: 60*60*1000 });

        return res.status(200).json({
            success: true,
            message: "Login successful",    
            data: { email: email, user_id: user_id },
            code: "LOGIN_SUCCESS",
        });
    } catch(error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
            code: error.code || "INTERNAL_ERROR"
        });
    }
});

module.exports = router;