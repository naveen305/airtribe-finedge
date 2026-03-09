// Wrapper to handle async errors in controllers
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = {
    asyncHandler,
    errorHandler
};