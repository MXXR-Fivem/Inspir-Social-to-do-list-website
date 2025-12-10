const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { startCron } = require("./cron/cron");

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// gestion des routes
app.use("/register", require("./routes/auth/register")); // POST envoyer les data du register
app.use("/login", require("./routes/auth/login")); // POST demander un login
app.use("/user", require("./routes/auth/user")); // GET si on est identifié + les datas du user
app.use("/user/todos", require("./routes/todos/getUserTodos")); // GET les todos du user
app.use("/users", require("./routes/users/userDataById")); // GET les data du user par id
app.use("/users", require("./routes/users/updateUserDataById")); // PUT update user data
app.use("/todos", require("./routes/todos/getAllTodos")); // GET view all the todos
app.use("/todos", require("./routes/todos/getTodoById")); // GET get todo by id
app.use("/todos", require("./routes/todos/createTodo")); // POST create a todo
app.use("/deleteTodo", require("./routes/todos/deleteTodo")); // DELETE todo by id
app.use("/todos", require("./routes/todos/updateTodo")); // PUT update a todo
app.use("/todos", require("./routes/todos/deleteTodo")); // DELETE a todo
app.use("/sharedTodos", require("./routes/todos/sharedTodos")); // GET les todos en publiques
app.use("/tasks", require("./routes/tasks/getTasks")); // GET les tasks d'une todo
app.use("/createTasks", require("./routes/tasks/createTasks")); // POST créer des tasks
app.use("/deleteTask", require("./routes/tasks/deleteTask.js")); // DELETE supprimer une task
app.use("/updateTaskStatus", require("./routes/tasks/updateTaskStatus")); // PUT changer le status de la task
app.use("/updateTasks", require("./routes/tasks/updateTasks")); // PUT update les tasks
app.use("/notice", require("./routes/notice/createNotice")); // POST creer un avis 
app.use("/settings", require("./routes/settings/changePassword")); // POST change password
app.use("/settings", require("./routes/settings/deleteAccount")); // POST delete user account
app.use("/settings", require("./routes/settings/exportedData")); // GET user data
app.use("/settings", require("./routes/settings/getDisconnected")); // POST disconnect

app.listen(process.env.EXPRESS_PORT, "0.0.0.0", function(){
    console.log(`Listening on port ${process.env.EXPRESS_PORT}`);
    startCron();
});

module.exports = app;