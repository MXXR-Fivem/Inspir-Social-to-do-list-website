const pool = require("../../config/db");

async function getTodosTasksDb(todo_id) {
    try {
        const [result] = await pool.execute("SELECT * FROM tasks WHERE todo_id = ?", [todo_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function getTodoDataDb(todo_id) {
    try {
        const [result] = await pool.execute("SELECT * FROM todo WHERE id = ?", [todo_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function getTodoUserDataDb(user_id) {
    try {
        const [result] = await pool.execute("SELECT email, id, firstname, name, photo FROM user WHERE id = ?", [user_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function createTasksDb(taskData) {
    try {
        const [result] = await pool.execute("INSERT INTO tasks (todo_id, description, category, status) VALUES (?, ?, ?, ?)", [taskData.todo_id, taskData.description, taskData.category, taskData.status]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function deleteTaskDb(task_id) {
    try {
        const [result] = await pool.execute("DELETE FROM tasks WHERE id = ?", [task_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function updateUserStats(user_id, type, updateValue) {
    try {
        const [result] = await pool.execute(`UPDATE user SET ${type} = ${type} ${updateValue} WHERE id = ? ` + (updateValue[0] == "-" ? `AND ${type} > 0` : ``), [user_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function updateStatusTaskDb(task_id) {
    try {
        const [result] = await pool.execute("UPDATE tasks SET status = !status WHERE id = ?", [task_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function updateTaskDb(task) {
    try {
        const [result] = await pool.execute("UPDATE tasks SET description = ?, category = ?, status = ? WHERE id = ?", [task.description, task.category, task.status, task.id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function updateTodoStatus(todo_id, status) {
    try {
        const [result] = await pool.execute("UPDATE todo SET status = ? WHERE id = ?", [status, todo_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function getTodoNoticeDb(todo_id) {
    try {
        const [result] = await pool.execute("SELECT notice.*, user.photo, user.firstname, user.name, user.email FROM notice JOIN user ON notice.user_id = user.id WHERE todo_id = ?", [todo_id]);
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getTodosTasksDb,
    getTodoDataDb,
    getTodoUserDataDb,
    createTasksDb,
    deleteTaskDb,
    updateUserStats,
    updateStatusTaskDb,
    updateTaskDb,
    updateTodoStatus,
    getTodoNoticeDb
}