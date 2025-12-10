const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { updateStatusTaskDb, updateUserStats, updateTodoStatus} = require("./tasks.query");
const { getUserTasksById } = require("../todos/todos.query");
const { createError } = require("../../helperError/createError");

router.put("/", middleware, async(req, res) => {
    try {
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const user_id = decoded.user_id;
    
        await updateStatusTaskDb(req.body.task_id);
        await updateUserStats(user_id, "ended_tasks", req.body.newStatus == 1 ? "-1" : "+1");
    
        const tasksStatus = await getUserTasksById([req.body.todo_id]);
        const totalTasks = tasksStatus.length;
        let totalEndedTasks = 0;
    
        await tasksStatus.map((task) => {
            totalEndedTasks = (task.status == 1 ? (totalEndedTasks+1) : totalEndedTasks);
        });
        const tasksRate = Math.round(((totalEndedTasks/totalTasks)*100) || 0);
    
        let todo_status = req.body.todo_status;
        if (tasksRate == 100 && totalTasks > 0) {
            if (req.body.todo_status != "done") {
                await updateUserStats(user_id, "ended_todos", "+1");
            }
            todo_status = "done";
            await updateTodoStatus(req.body.todo_id, "done");
        } else {
            if (req.body.todo_status == "done") {
                await updateUserStats(user_id, "ended_todos", "-1");
            }
            todo_status = "in progress";
            await updateTodoStatus(req.body.todo_id, "in progress");
        }
    
        return res.status(200).json({
            success: true,
            message: "Successfull updated task status",
            code: "SUCCESS_UPDATED_TASK",
            data: {tasksRate, todo_status},
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