// In-memory store for request counts
const requestStore = {};

// Configuration
const WINDOW_TIME = 60 * 1000; // 1 minute
const MAX_REQUESTS = 20;

const rateLimiter = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();

    // Initialize record if it doesn't exist
    if (!requestStore[ip]) {
        requestStore[ip] = {
            count: 1,
            startTime: currentTime
        };
        return next();
    }

    const timeElapsed = currentTime - requestStore[ip].startTime;

    // Reset window if time exceeded
    if (timeElapsed > WINDOW_TIME) {
        requestStore[ip] = {
            count: 1,
            startTime: currentTime
        };
        return next();
    }

    // Increment request count
    requestStore[ip].count++;

    if (requestStore[ip].count > MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later."
        });
    }

    next();
};

module.exports = rateLimiter;