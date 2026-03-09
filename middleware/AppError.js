class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;

        // Capture stack trace for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;