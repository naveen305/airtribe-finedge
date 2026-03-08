const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user.routes'));

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
