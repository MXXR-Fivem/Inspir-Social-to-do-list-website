const pool = require("../../config/db");

async function getAllTodosDb(all, user_id) {
    try {
        const [sharedTodosResult] = !all
            ? await pool.execute(`
                SELECT 
                    todo.id, 
                    todo.user_id, 
                    todo.private,
                    todo.aut_emails,
                    todo.title, 
                    todo.description, 
                    todo.categories,
                    todo.tags,
                    todo.created_at, 
                    todo.due_time, 
                    todo.status, 
                    user.name, 
                    user.firstname,
                    user.photo,
                    user.created_at AS user_created_at,
                    COALESCE(ROUND(AVG(notice.value), 1), 0) AS average_rating,
                    COUNT(notice.id) AS rating_count
                FROM todo 
                JOIN user ON todo.user_id = user.id 
                LEFT JOIN notice ON todo.id = notice.todo_id
                WHERE todo.private = ? AND todo.user_id != ?
                GROUP BY todo.id, todo.user_id, todo.private, todo.title, todo.description, 
                        todo.categories, todo.created_at, todo.due_time, todo.status, 
                        user.name, user.firstname, user.created_at
            `, [false, user_id]) 
            : await pool.execute(`
                SELECT 
                    todo.*,
                    COALESCE(ROUND(AVG(notice.value), 1), 0) AS average_rating,
                    COUNT(notice.id) AS rating_count
                FROM todo 
                LEFT JOIN notice ON todo.id = notice.todo_id
                GROUP BY todo.id
            `);
        return sharedTodosResult;
    } catch(error) {
        throw error;
    }
}

async function getTodoNotice(todoId) {
    try {
        const [noticeResult] = await pool.execute("SELECT value, COUNT(*) AS total FROM notice WHERE id = ?", [todoId]);
        console.log(noticeResult);
    } catch(error) {
        throw error;
    }
}

async function getUserTodosDb(user_id) {
    try {
        const [userTodosResult] = await pool.execute(`
            SELECT 
                todo.*, 
                COALESCE(ROUND(AVG(notice.value), 1), 0) AS average_rating,
                COUNT(notice.id) AS rating_count
            FROM todo
            LEFT JOIN notice ON notice.todo_id = todo.id
            WHERE todo.user_id = ?
            GROUP BY
                todo.id, 
                todo.user_id, 
                todo.private, 
                todo.title, 
                todo.description, 
                todo.categories, 
                todo.created_at, 
                todo.due_time, 
                todo.status
        `, [user_id]);
        return userTodosResult;
    } catch(error) {
        throw error;
    }
}

async function getUserTasksById(todo_ids) {
    try {
        if (!todo_ids || todo_ids.length === 0) {
            return [];
        }
        const placeholders = todo_ids.map(() => '?').join(',');
        const [result] = await pool.execute(`SELECT status, todo_id FROM tasks WHERE todo_id IN (${placeholders})`, todo_ids);
        return result;
    } catch(error) {
        throw error;
    }
}

async function createTodoDb(user_id, private, emails, title, description, categories, tags, created_at, due_time, status) {
    try {
        const [result] = await pool.execute("INSERT INTO todo (user_id, private, aut_emails, title, description, categories, tags, created_at, due_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [user_id, private, emails, title, description, categories, tags, created_at, due_time, status]);
        return result.insertId;
    } catch(error) {
        throw error;
    }
}

async function createTaskDb(taskData, todoId) {
    try {
        const [result] = await pool.execute("INSERT INTO tasks (todo_id, description, category, status) VALUES (?, ?, ?, ?)", [todoId, taskData.description, taskData.category, taskData.done]);
        return result.insertId;
    } catch(error) {
        throw error;
    }
}

async function updateTodoDb(todoId, private, title, description, categories, created_at, due_time, status) {
    try {
        const [result] = await pool.execute("UPDATE todo SET private = ?, title = ?, description = ?, categories = ?, created_at = ?, due_time = ?, status = ? WHERE id = ?", [private, title, description, categories, created_at, due_time, status, todoId]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function deleteTodoById(todoId) {
    try {
        const [result] = await pool.execute("DELETE FROM todo WHERE id = ?", [todoId]);
        const [result2] = await pool.execute("DELETE FROM tasks WHERE todo_id = ?", [todoId]);
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getAllTodosDb,
    getTodoNotice,
    getUserTodosDb,
    createTodoDb,
    deleteTodoById,
    updateTodoDb,
    createTaskDb,
    getUserTasksById
}