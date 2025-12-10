const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const { updateTaskDb, getTodosTasksDb, createTasksDb } = require("./tasks.query");
const { getUserTasksById } = require("../todos/todos.query");
const { createError } = require("../../helperError/createError");

router.put("/", middleware, async(req, res) => {
    try {
        await Promise.all(req.body.updatedTasks.map(async (task) => {
            if (task.newTask) {
                await createTasksDb(task);
            } else {
                await updateTaskDb(task);
            }
        }));
    
        const updatedTasks = await getTodosTasksDb(req.body.todo_id);
        const tasksStatus = await getUserTasksById([req.body.todo_id]);
    
        let totalTasks = tasksStatus.length;
        let totalEndedTasks = 0;
    
        await tasksStatus.map((task) => {
            totalEndedTasks = (task.status == 1 ? (totalEndedTasks+1) : totalEndedTasks);
        });
    
        const tasksRate = Math.round(((totalEndedTasks/totalTasks)*100) || 0);
    
        return res.status(200).json({
            success: true,
            message: "Successfull updated task status",
            code: "SUCCESS_UPDATED_TASK",
            data: {tasksRate, updatedTasks},
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