const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { getTodosTasksDb, getTodoDataDb, getTodoUserDataDb, getTodoNoticeDb } = require("./tasks.query");
const { getUserTasksById } = require("../todos/todos.query");
const { createError } = require("../../helperError/createError");

router.get("/:todo_id", middleware, async(req, res) => {
    try {
        if (!req.params["todo_id"]) {
            throw createError("todo_id is required", {statusCode: 400, code: "MISSING_FIELDS"});
        }

        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const taskData = await getTodosTasksDb(req.params["todo_id"]);

        const todoData = await getTodoDataDb(req.params["todo_id"]);
        const todoNotice = await getTodoNoticeDb(req.params["todo_id"]);
        const todo_ids = todoData.map((d) => d.id);
        const userData = await getTodoUserDataDb(todoData[0].user_id);
        const tasksStatus = await getUserTasksById(todo_ids);

        if ((todoData[0].private == 1 && Number(todoData[0].user_id) !== Number(decoded.user_id)) || (todoData[0].private == 0 && Number(todoData[0].user_id) !== Number(decoded.user_id) && (todoData[0].aut_emails && todoData[0].aut_emails.length >= 1 && !todoData[0].aut_emails.includes(decoded.email)))) {
            throw createError("Access denied, this todo is private and you are not allowed to visit it.", {statusCode: 401, code: "ACCESS_DENIED"});
        }

        await todoData.map(async(todo) => {
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
            message: "Succes get todo tasks by id",
            code: "SUCCESS_GET_TODO_BY_ID",
            data: {
                tasksData: taskData,
                todoData: todoData,
                ownTodo: (Number(todoData[0].user_id) === Number(decoded.user_id) || (todoData[0].aut_emails && todoData[0].aut_emails.length >= 1 && todoData[0].aut_emails.includes(decoded.email))),
                userData: userData,
                todoNotice: todoNotice,
                user_id: decoded.user_id,
            }
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