const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { getAllTodosDb } = require("./todos.query");
const { createError } = require("../../helperError/createError");

router.get("/", middleware, async(req, res) => {
    try {
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        let data = await getAllTodosDb(false, decoded.user_id);

        data = await data.filter((todo) => (todo.aut_emails && todo.aut_emails.length >= 1 && todo.aut_emails.includes(decoded.email)) || (!todo.aut_emails || todo.aut_emails.length < 1));

        res.status(200).json({
            success: true,
            message: "Succes get shared todos",
            code: "SUCCESS_GET_SHARED_TODOS",
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