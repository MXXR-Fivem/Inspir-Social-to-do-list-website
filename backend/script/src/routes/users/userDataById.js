const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const jwt = require("jsonwebtoken");
const { getUserInformations } = require("./users.query");
const { getUserTodosDb } = require("../todos/todos.query");
const { createError } = require("../../helperError/createError");

router.get("/:id", middleware, async(req, res) => {
    try {
        if (!req.params["id"]) {
            throw createError("Id is required", {statusCode: 400, code: "MISSING_FIELDS"});
        }

        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const user_id = decoded.user_id;

        let data = await getUserInformations(req.params["id"]);
        data[0].userTodos = await getUserTodosDb(req.params["id"]);

        if (user_id != data.id) {
            data[0].userTodos = data[0].userTodos.filter((todo) => (todo.private == 1 && user_id == todo.user_id) || todo.private == 0);
        }

        res.status(200).json({
            success: true,
            message: "Succes get user data",
            code: "SUCCESS_GET_USER_DATA",
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