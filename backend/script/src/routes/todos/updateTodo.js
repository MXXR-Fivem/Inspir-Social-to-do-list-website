const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const { updateTodoDb } = require("./todos.query");
const { createError } = require("../../helperError/createError");

router.post("/", middleware, async(req, res) => {
    try {
        if (!req.params["id"]) {
            throw createError("Id is required", {statusCode: 400, code: "MISSING_FIELDS"});
        }
    
        const {user_id, private, title, description, categories, created_at, due_time, status} = req.body;
    
        if (!user_id || !private || !title || !description || !categories || !created_at || !due_time || !status) {
            throw createError("All fields are required", {statusCode: 400, code: "MISSING_FIELDS"});
        }
    
        await updateTodoDb(req.params["id"], user_id, private, title, description, categories, created_at, due_time, status);
    
        res.status(200).json({
            success: true,
            message: "Succes update todo",
            code: "SUCCESS_UPDATE_TODO",
            data: {id: req.params["id"], user_id, private, title, description, categories, created_at, due_time, status},
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