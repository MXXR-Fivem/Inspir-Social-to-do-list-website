const pool = require("../../config/db");

async function getUserInformations(user_id, email) {
    try {
        if (user_id) {
            const [userInfos] = await pool.execute("SELECT * FROM user WHERE id = ?", [user_id]);
            return userInfos;
        } else {
            const [userInfos] = await pool.execute("SELECT * FROM user WHERE email = ?", [email]);
            return userInfos;
        }
    } catch(error) {
        throw error;
    }
}

async function updateUserInformations(id, email, name, firstname, description, contactLink, photo) {
    try {
        const [result] = await pool.execute("UPDATE user SET email = ?, name = ?, firstname = ?, description = ?, contactLink = ?, photo = ? WHERE id = ?", [email, name, firstname, description || "", contactLink, photo, id]);
        return result;
    } catch(error) {
        throw error;
    }
}

module.exports = {
    getUserInformations,
    updateUserInformations,
}