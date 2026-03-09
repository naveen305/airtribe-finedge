const validateTransaction = (req, res, next) => {
    const { type, amount, category } = req.body;

    if (!type || !amount || !category) {
        return res.status(400).json({
            success: false,
            message: "type, amount and category are required"
        });
    }

    if (type !== "income" && type !== "expense") {
        return res.status(400).json({
            success: false,
            message: "type must be income or expense"
        });
    }

    next();
};

module.exports = {
    validateTransaction
};