const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { createTodoDb, createTaskDb } = require("./todos.query");
const { createError } = require("../../helperError/createError");

router.post("/", middleware, async(req, res) => {
    try {
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const user_id = decoded.user_id;
        const {todoData, categories, tags, taskList, private, emails} = req.body;
    
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const createdAt = `${year}-${month}-${day}`;
        const dueTime = todoData.due_time ? (todoData.due_time.replace('T', ' ') + ':00').slice(0, 19) : null;
        const emailList = emails.map(e => e.email);
        const categoryList = categories.map(c => c.name);
        const tagList = tags.map(t => t.name);
        
        const id = await createTodoDb(user_id, private, emailList, todoData.title, todoData.description, categoryList, tagList, createdAt, dueTime, todoData.status);
        await taskList.map((task, index) => {
            createTaskDb(task, id);
        })

        res.status(200).json({
            success: true,
            message: "Succes create todo",
            code: "SUCCESS_CREATE_TODO",
            data: {todoId: id, user_id},
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