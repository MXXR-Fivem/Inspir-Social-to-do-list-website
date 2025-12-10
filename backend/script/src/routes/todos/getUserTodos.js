const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { getUserTodosDb, getUserTasksById } = require("./todos.query");
const { createError } = require("../../helperError/createError");

router.get("/", middleware, async(req, res) => {
    try {
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const data = await getUserTodosDb(decoded.user_id);
        const todo_ids = data.map((d) => d.id);
        const tasksStatus = await getUserTasksById(todo_ids);
        
        await data.map(async(todo) => {
            let totalTasks = tasksStatus.filter((t) => t.todo_id === todo.id).length;
            let totalEndedTasks = 0;
    
            await tasksStatus.map((task) => {
                if (task.todo_id === todo.id) {
                    totalEndedTasks = (task.status == 1 ? (totalEndedTasks+1) : totalEndedTasks);
                }
            });
            todo.tasksRate = Math.round(((totalEndedTasks/totalTasks)*100) || 0);
    
            if (todo.due_time !== null) {
                const now = new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" });
                const parisTime = new Date(now).getTime();
                const dueTime = new Date(todo.due_time).getTime();
                const timeDifference = dueTime - parisTime;
    
                todo.overTime = (timeDifference < 0);
            }
        });
    
        res.status(200).json({
            success: true,
            message: "Succes get user todos",
            code: "SUCCESS_GET_USER_TODOS",
            data: data
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