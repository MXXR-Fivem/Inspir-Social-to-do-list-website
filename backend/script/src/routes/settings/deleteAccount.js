const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const { createError } = require("../../helperError/createError");


router.delete("/delete-account", middleware, async(req, res) => {
    try{
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const userId = decoded.user_id;

        const [rowsUser] = await pool.execute("SELECT id, email, name, firstname FROM user WHERE id = ?", [userId]);
        if (rowsUser.length === 0) {
            throw createError("User not found , maybe already delete or never existed", {statusCode: 404, code: "USER_NOT_FOUND"});
        }

        const [rowsTodos] = await pool.execute("SELECT id FROM todo WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM notice WHERE user_id = ?", [userId]);

        if (rowsTodos.length > 0) {
            const todoIds = rowsTodos.map((t) => t.id);
            const placeholders = todoIds.map(() => "?").join(",");

            await pool.execute(`DELETE FROM tasks WHERE todo_id IN (${placeholders})`, todoIds);
        }

        await pool.execute("DELETE FROM todo WHERE user_id = ?", [userId]);
        await pool.execute("DELETE FROM user WHERE id = ?", [userId]);
        
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });

        return res.status(200).json({
            success: true,
            message: "Account and data deleted with success",
            code:"ACCOUNT_DELETED",
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