const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkEmailUsed, createUser } = require("./auth.query");
const { createError } = require("../../helperError/createError");

const isStrongPassword =  (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const digits = password.match(/[0-9]/g) || [];
    const specials = password.match(/[^A-Za-z0-9]/g) || [];
    return(
        hasMinLength && hasUpperCase && digits.length >=2 && specials.length >= 1
    );
};

router.post("/", async(req, res) => {
    try {
        const {email, password, name, firstname} = req.body;
        if (!email || !password || !name || !firstname) {
            throw createError("Email, password, name & firstname are required", {statusCode: 401, code: "MISSING_FIELDS"});
        }

        if (!isStrongPassword(password)) {
            throw new Error(
                "Password must be at least 8 characters long, contain 1 uppercase letter, 2 digits and 1 special characters.",
                { statusCode: 400, code : "WEAK_PASSWORD"}
            );
        }

        const isUsedMail = await checkEmailUsed(email);
        if (isUsedMail[0]["COUNT(*)"] > 0) {
            throw createError("Email already registered", {statusCode: 401, code: "EMAIL_ALREADY_EXISTS"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const createdAt = `${year}-${month}-${day}`;

        const user = await createUser(email, passwordHashed, name, firstname, createdAt);
        const user_id = user.insertId;

        let data = {
            signInTime: Date.now(),
            email: email,
            user_id: user_id,
            name: name,
            firstname: firstname,
        }

        const token = await jwt.sign(data, process.env.SECRET, { expiresIn: "1h" });
        res.cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 60*60*1000 });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: { email: email, user_id: user_id },
            code: "REGISTRATION_SUCCESS",
        });
        
    } catch(error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
            code: error.code || "INTERNAL_ERROR"
        });
    }
})

module.exports = router;