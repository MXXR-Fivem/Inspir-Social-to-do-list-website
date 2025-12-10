const pool = require("../../config/db");

async function checkEmailUsed(email) {
    try {
        const [result] = await pool.execute("SELECT COUNT(*) FROM user WHERE email = ?", [email]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function createUser(email, password, name, firstname, createdAt) {
    try {
        const [result] = await pool.execute("INSERT INTO user (email, password, name, firstname, created_At) VALUES (?, ?, ?, ?, ?)", [email, password, name, firstname, createdAt]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function getUserPassword(email) {
    try {
        const [result] = await pool.execute("SELECT password FROM user WHERE email = ?", [email]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function getUserId(email) {
    try {
        const [result] = await pool.execute("SELECT id FROM user WHERE email = ?", [email]);
        return result[0]["id"];
    } catch(error) {
        throw error;
    }
}

async function getUserEmail(id) {
    try {
        const [result] = await pool.execute("SELECT email FROM user WHERE id = ?", [id]);
        return result;
    } catch(error) {
        throw error;
    }
}

async function getUserInformations(user_id) {
    try {
        const [userInfos] = await pool.execute("SELECT * FROM user WHERE id = ?", [user_id]);
        return userInfos;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    checkEmailUsed,
    createUser,
    getUserPassword,
    getUserId,
    getUserEmail,
    getUserInformations
}