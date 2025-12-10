const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const { middleware } = require("../../middleware/middleware");
const { createError } = require("../../helperError/createError");

router.get("/export", middleware, async(req, res) => {
    try{
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const userId = decoded.user_id|| decoded.id;

        const [rowsUser] = await pool.execute("SELECT * FROM user WHERE id = ?", [userId]);
        const [rowsTodos] = await pool.execute("SELECT * FROM todo WHERE user_id = ?", [userId]);
        const [rowsTasks] = await pool.execute(`SELECT tasks.* FROM tasks JOIN todo ON tasks.todo_id = todo.id WHERE todo.user_id = ?`, [userId]);
        const [rowsNotices] = await pool.execute("SELECT * FROM notice WHERE user_id = ?", [userId]);

        const data = {
            user:rowsUser,
            todos:rowsTodos,
            tasks:rowsTasks,
            notice:rowsNotices,
        };

        return res.status(200).json({
            success: true,
            message: "Success export user data",
            code: "SUCCESS_EXPORT_DATA",
            data: data,
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
