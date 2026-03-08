const Transaction = require('../models/transaction.model');

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
    const { type, category, amount, description, date, tags } = req.body;

    try {
        const transaction = await Transaction.create({
            user: req.user._id,
            type,
            category,
            amount,
            description,
            date,
            tags
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all transactions for the logged-in user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    try {
        const filter = { user: req.user._id };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const total = await Transaction.countDocuments(filter);
        const transactions = await Transaction.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit));

        res.json({
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const allowedFields = ['type', 'category', 'amount', 'description', 'date', 'tags'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                transaction[field] = req.body[field];
            }
        });

        const updated = await transaction.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get spending summary (totals by type + category breakdown)
// @route   GET /api/transactions/summary
// @access  Private
const getTransactionSummary = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const match = { user: req.user._id };
        if (startDate || endDate) {
            match.date = {};
            if (startDate) match.date.$gte = new Date(startDate);
            if (endDate) match.date.$lte = new Date(endDate);
        }

        const summary = await Transaction.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { type: '$type', category: '$category' },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.type': 1, total: -1 } }
        ]);

        // Roll up totals
        const totals = { income: 0, expense: 0 };
        summary.forEach(({ _id, total }) => {
            if (_id.type === 'income') totals.income += total;
            if (_id.type === 'expense') totals.expense += total;
        });
        totals.net = totals.income - totals.expense;

        res.json({ totals, breakdown: summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary
};
