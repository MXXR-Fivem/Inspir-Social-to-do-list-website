const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../../config/db");
const { createError } = require("../../helperError/createError");

router.post("/change-password", middleware, async(req, res) => {
    try {
        const {oldPassword, newPassword, confirmPassword} = req.body;

        if (!oldPassword|| !newPassword || !confirmPassword) {
            throw createError("All fields are required in case ur dumb", {statusCode: 400, code: "MISSING_FIELDS"});
        }

        if (newPassword !== confirmPassword) {
            throw createError("Password not match u cunt", {statusCode: 400, code: "PASSWORD_MISSMATCH"});
        }

        if (newPassword.length < 8) {
            throw createError("New password need at least 8 characters u dumbass ", {statusCode: 400, code: "PASSWORD_TOO_SHORT"});
        }

        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const userId = decoded.user_id || decoded.id;
        const [rowsUser] = await pool.execute("SELECT password FROM user WHERE id = ?", [userId]);

        if (rowsUser.length === 0) {
            throw createError("User not found", {statusCode: 404, code: "USER_NOT_FOUND"});
        }

        const currentHash = rowsUser[0].password;
        const isMatch = await bcrypt.compare(oldPassword, currentHash);

        if (!isMatch) {
            throw createError("Old password not correct! are u ", {statusCode: 404, code: "WRONG_OLD_PASSWORD"});
        }
 
        const isSame = await bcrypt.compare(newPassword, currentHash);
        if (isSame) {
            throw createError("New password must be different from the old one, are u retarded ?", {statusCode: 404, code: "PASSWORD_SAME_AS_OLD"});
        }

        const saltRounds = 10;
        const newHash = await bcrypt.hash(newPassword, saltRounds);
        await pool.execute("UPDATE user SET password = ? WHERE id = ?", [newHash, userId]);

        return res.status(200).json({
            success: true,
            message: "Success password updated",
            code: "PASSSWORD_SUCCESS_CHANGED",
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