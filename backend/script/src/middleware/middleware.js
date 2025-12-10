const jwt = require("jsonwebtoken");

async function middleware(req, res, next) {
    const token = req.cookies.accessToken;
    const jwtSecretKey = process.env.SECRET;
    try {
        await jwt.verify(token, jwtSecretKey);
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Access denied, invalid or expired token",
            code: "INVALID_TOKEN",
        });
    }
}

module.exports = {
    middleware,
}