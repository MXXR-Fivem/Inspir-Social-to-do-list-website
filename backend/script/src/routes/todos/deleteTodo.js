const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const { deleteTodoById } = require("./todos.query");
const { createError } = require("../../helperError/createError");

router.delete("/:id", middleware, async(req, res) => {
    try {        
        if (!req.params["id"]) {
            throw createError("Id is required", {statusCode: 400, code: "MISSING_FIELDS"});
        }
        
        const data = await deleteTodoById(req.params["id"]);
    
        res.status(200).json({
            success: true,
            message: "Succes delete todo by id",
            code: "SUCCESS_DELETE_TODO_BY_ID",
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