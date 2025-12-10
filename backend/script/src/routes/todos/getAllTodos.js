const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const { getAllTodosDb } = require("./todos.query");
const { createError } = require("../../helperError/createError");

router.get("/", middleware, async(req, res) => {
    try {
        const data = await getAllTodosDb(true, null);
    
        res.status(200).json({
            success: true,
            message: "Succes get all todos",
            code: "SUCCESS_GET_ALL_TODOS",
            data: data,
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