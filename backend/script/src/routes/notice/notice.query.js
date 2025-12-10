const pool = require("../../config/db");

async function createNewNoticeDb(noticeData) {
    try {
        const [result] = await pool.execute("INSERT INTO notice (todo_id, user_id, value, description, created_at) VALUES (?, ?, ?, ?, ?)", [noticeData.todo_id, noticeData.user_id, noticeData.value, noticeData.description, noticeData.created_at]);
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    createNewNoticeDb,
}