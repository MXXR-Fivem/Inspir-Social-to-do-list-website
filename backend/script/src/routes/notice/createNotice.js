const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { createNewNoticeDb } = require("./notice.query");
const { getUserInformations } = require("../auth/auth.query.js");
const { createError } = require("../../helperError/createError");

router.post("/", middleware, async(req, res) => {
    try {
        const {todo_id, description, value} = req.body;
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const user_id = decoded.user_id;
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const createdAt = `${year}-${month}-${day}`;
        const newNotice = await createNewNoticeDb({todo_id, description, value, user_id, created_at: createdAt});
        const userData = (await getUserInformations(user_id))[0];

        res.status(200).json({
            success: true,
            message: "Succes create notice",
            code: "SUCCESS_CREATE_NOTICE",
            data: {newNotice: {photo: userData.photo, firstname: userData.firstname, name: userData.name, email: userData.email, todo_id: todo_id, description: description, value: value, user_id: user_id, created_at: createdAt, id: newNotice.insertId}},
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