function createError(message, obj) {
    const err = new Error(message);
    err.statusCode = obj.statusCode || null;
    err.code = obj.code || null;
    return err;
}

module.exports = {createError};