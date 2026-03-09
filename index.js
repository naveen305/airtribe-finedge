const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const logger = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
// const { validateTransaction } = require("../middleware/validator");



// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FineEdge API',
            version: '1.0.0',
            description: 'API documentation for the FineEdge project',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        token: { type: 'string' },
                    },
                },
                Transaction: {
                    type: 'object',
                    required: ['type', 'category', 'amount'],
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        type: { type: 'string', enum: ['income', 'expense'] },
                        category: { type: 'string' },
                        amount: { type: 'number' },
                        description: { type: 'string' },
                        date: { type: 'string', format: 'date-time' },
                        tags: { type: 'array', items: { type: 'string' } },
                    },
                },
                Budget: {
                    type: 'object',
                    required: ['month'],
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        month: { type: 'string', example: '2026-03' },
                        incomeGoal: { type: 'number' },
                        expenseLimit: { type: 'number' },
                        savingsTarget: { type: 'number' },
                        categories: { type: 'object' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());
app.use(logger);
app.use(errorHandler);

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/transactions', require('./routes/transaction.routes'));
app.use('/api/budgets', require('./routes/budget.routes'));
app.use('/api/summary', require('./routes/summary.routes'));


// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Root Endpoint
app.get('/', (req, res) => {
    res.send('FineEdge API is running');
});

// Connect to MongoDB and Start Server
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/finedge';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

startServer();
