const Budget = require('../models/budget.model');
const Transaction = require('../models/transaction.model');

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
    const { month, incomeGoal, expenseLimit, savingsTarget, categories } = req.body;

    try {
        const existing = await Budget.findOne({ user: req.user._id, month });
        if (existing) {
            return res.status(400).json({ message: `Budget for ${month} already exists` });
        }

        const budget = await Budget.create({
            user: req.user._id,
            month,
            incomeGoal,
            expenseLimit,
            savingsTarget,
            categories
        });

        res.status(201).json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all budgets for the logged-in user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user._id }).sort({ month: -1 });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single budget by ID
// @route   GET /api/budgets/:id
// @access  Private
const getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a budget
// @route   PATCH /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        const allowedFields = ['incomeGoal', 'expenseLimit', 'savingsTarget', 'categories'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                budget[field] = req.body[field];
            }
        });

        const updated = await budget.save();
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Compare budget targets vs actual transactions for a month
// @route   GET /api/budgets/:id/comparison
// @access  Private
const getBudgetComparison = async (req, res) => {
    try {
        const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        // Fetch all transactions for that month
        const start = new Date(`${budget.month}-01`);
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: start, $lt: end }
        });

        const actualIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const actualExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const actualSavings = actualIncome - actualExpenses;

        // Per-category actual spend
        const categoryActuals = {};
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                categoryActuals[t.category] = (categoryActuals[t.category] || 0) + t.amount;
            });

        res.json({
            month: budget.month,
            income: {
                goal: budget.incomeGoal,
                actual: actualIncome,
                variance: actualIncome - budget.incomeGoal
            },
            expenses: {
                limit: budget.expenseLimit,
                actual: actualExpenses,
                variance: budget.expenseLimit - actualExpenses
            },
            savings: {
                target: budget.savingsTarget,
                actual: actualSavings,
                variance: actualSavings - budget.savingsTarget
            },
            categoryBreakdown: categoryActuals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getBudgetComparison
};
