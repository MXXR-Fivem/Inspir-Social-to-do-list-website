const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { middleware } = require("../../middleware/middleware");
const { getUserInformations } = require("./auth.query");
const { createError } = require("../../helperError/createError");

router.get("/", middleware, async(req, res) => {
    try {
        const decoded = await jwt.verify(req.cookies.accessToken, process.env.SECRET);
        const data = await getUserInformations(decoded.user_id);
    
        res.status(200).json({
            success: true,
            message: "Succes get user data",
            code: "SUCCESS_GET_USER_DATA",
            data: data[0],
        })
    } catch(error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
            code: error.code || "INTERNAL_ERROR"
        });
    }
});

module.exports = router;