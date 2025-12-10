const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { deleteTaskDb, updateUserStats } = require("./tasks.query");
const { getUserTasksById } = require("../todos/todos.query");
const { createError } = require("../../helperError/createError");

router.delete("/", middleware, async(req, res) => {
    try {     
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const user_id = decoded.user_id;
    
        await deleteTaskDb(req.body.task_id);
        await updateUserStats(user_id, "ended_tasks", "-1");
    
        const tasksStatus = await getUserTasksById([req.body.todo_id]);
    
        let totalTasks = tasksStatus.length;
        let totalEndedTasks = 0;
    
        await tasksStatus.map((task) => {
            totalEndedTasks = (task.status == 1 ? (totalEndedTasks+1) : totalEndedTasks);
        });
        const tasksRate = Math.round(((totalEndedTasks/totalTasks)*100) || 0);
    
        return res.status(200).json({
            success: true,
            message: "Successfull deleted task",
            code: "SUCCESS_DELETED_TASK",
            data: {tasksRate},
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