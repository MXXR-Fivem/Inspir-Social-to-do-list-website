const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const { createTasksDb } = require("./tasks.query");
const { getUserTasksById } = require("../todos/todos.query");
const { createError } = require("../../helperError/createError");

router.post("/", middleware, async(req, res) => {
    const tasks = req.body.tasks || [];
    try {
        const createdTasks = await Promise.all(tasks.map(async (task) => {
            const result = await createTasksDb(task);
            return { ...task, id: result.insertId };
        }));

        const tasksStatus = await getUserTasksById([req.body.todo_id]);

        let totalTasks = tasksStatus.length;
        let totalEndedTasks = 0;

        await tasksStatus.map((task) => {
            totalEndedTasks = (task.status == 1 ? (totalEndedTasks+1) : totalEndedTasks);
        });
        const tasksRate = Math.round(((totalEndedTasks/totalTasks)*100) || 0);

        return res.status(200).json({
            success: true,
            message: "Successfull created tasks",
            code: "SUCCESS_CREATE_TASKS",
            data: {createdTasks, tasksRate},
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