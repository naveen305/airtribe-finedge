const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    month: {
        type: String,
        required: [true, 'Month is required'],
        match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format']
    },
    incomeGoal: {
        type: Number,
        default: 0,
        min: [0, 'Income goal cannot be negative']
    },
    expenseLimit: {
        type: Number,
        default: 0,
        min: [0, 'Expense limit cannot be negative']
    },
    savingsTarget: {
        type: Number,
        default: 0,
        min: [0, 'Savings target cannot be negative']
    },
    categories: {
        type: Map,
        of: Number,
        default: {}
    }
}, {
    timestamps: true
});

// One budget per user per month
budgetSchema.index({ user: 1, month: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;
