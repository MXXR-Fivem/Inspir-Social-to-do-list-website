const pool = require("../config/db");

async function getNotEndedTodo() {
    try {
        const [result, fields] = await pool.execute("SELECT todo.*, user.id AS user_id, user.email, user.name, user.firstname FROM todo JOIN user ON todo.user_id = user.id WHERE status != ? AND NOT cron_passed", ["done"]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function setCronPassed(todo_id) {
    try {
        const [result, fields] = await pool.execute("UPDATE todo SET cron_passed = 1 WHERE id = ?", [todo_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getNotEndedTodo,
    setCronPassed,
}