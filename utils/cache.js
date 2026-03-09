// In-memory cache object
const cacheStore = {};

// Set value with TTL
function setCache(key, value, ttl = 60) {
    const expiryTime = Date.now() + ttl * 1000;

    cacheStore[key] = {
        value: value,
        expiry: expiryTime
    };
}

// Get cached value
function getCache(key) {
    const cached = cacheStore[key];

    if (!cached) {
        return null;
    }

    // Check if expired
    if (Date.now() > cached.expiry) {
        delete cacheStore[key];
        return null;
    }

    return cached.value;
}

// Clear cache manually (optional)
function clearCache(key) {
    delete cacheStore[key];
}

module.exports = {
    setCache,
    getCache,
    clearCache
};