const express = require("express");
const router = express.Router();
const { middleware } = require("../../middleware/middleware");
const { createError } = require("../../helperError/createError");

router.post("/get-disconnected", middleware, async(req, res) => {
    try{
        res.clearCookie("accessToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });
        
        return res.status(200).json({
            succes: true,
            message: "User success disconnected",
            code: "USER_DISCONNECTED"    
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