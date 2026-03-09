const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Transaction type is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Index for fast user-based and date-based queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
