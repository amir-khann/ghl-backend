const express = require('express');
const fetch = require('node-fetch');
const serverless = require('serverless-http');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// CORS configuration
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GHL Backend API',
            version: '1.0.0',
            description: 'Backend server for GHL payment processing with Tap integration',
        },
        servers: [
            {
                url: 'https://your-project.vercel.app',
                description: 'Vercel production server',
            },
        ],
    },
    apis: ['./api/server.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the server is running and get server status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: GHL Backend is running successfully on Vercel
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: production
 *                 platform:
 *                   type: string
 *                   example: Vercel Serverless
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'GHL Backend is running successfully on Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        platform: 'Vercel Serverless'
    });
});

/**
 * @swagger
 * /test:
 *   get:
 *     summary: API functionality test
 *     description: Test endpoint to verify API is working correctly
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: API is working correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is working correctly
 *                 server:
 *                   type: string
 *                   example: GHL Backend
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 platform:
 *                   type: string
 *                   example: Vercel Serverless
 *                 endpoints:
 *                   type: object
 */
app.get('/test', (req, res) => {
    res.status(200).json({
        message: 'API is working correctly',
        server: 'GHL Backend',
        version: '1.0.0',
        platform: 'Vercel Serverless',
        endpoints: {
            health: 'GET /health',
            test: 'GET /test',
            createCharge: 'POST /create-charge',
            swagger: 'GET /api-docs'
        }
    });
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: API root endpoint
 *     description: Welcome message and API information
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to GHL Backend API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 platform:
 *                   type: string
 *                   example: Vercel Serverless
 *                 endpoints:
 *                   type: object
 *                 documentation:
 *                   type: string
 *                   example: See /api-docs for Swagger documentation
 */
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to GHL Backend API',
        version: '1.0.0',
        platform: 'Vercel Serverless',
        endpoints: {
            health: 'GET /health',
            test: 'GET /test',
            createCharge: 'POST /create-charge',
            swagger: 'GET /api-docs'
        },
        documentation: 'See /api-docs for Swagger documentation'
    });
});

/**
 * @swagger
 * /create-charge:
 *   post:
 *     summary: Create payment charge
 *     description: Creates a payment charge through Tap payment gateway
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - amount
 *               - currency
 *               - email
 *             properties:
 *               token:
 *                 type: string
 *                 description: Card token from Tap SDK
 *                 example: "tok_1234567890"
 *               amount:
 *                 type: number
 *                 description: Payment amount
 *                 example: 100
 *               currency:
 *                 type: string
 *                 description: Currency code
 *                 example: "KWD"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer email address
 *                 example: "customer@example.com"
 *     responses:
 *       200:
 *         description: Payment charge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "chg_1234567890"
 *                 status:
 *                   type: string
 *                   example: "CAPTURED"
 *                 amount:
 *                   type: number
 *                   example: 100
 *                 currency:
 *                   type: string
 *                   example: "KWD"
 *       400:
 *         description: Bad request - missing required fields or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *                 required:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["token", "amount", "currency", "email"]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "TAP_API_KEY environment variable is not configured"
 */
app.post('/create-charge', async (req, res) => {
    const { token, amount, currency, email } = req.body;

    // Validate required fields
    if (!token || !amount || !currency || !email) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['token', 'amount', 'currency', 'email']
        });
    }

    // Check if API key is configured
    if (!process.env.TAP_API_KEY) {
        return res.status(500).json({
            error: 'TAP_API_KEY environment variable is not configured'
        });
    }

    try {
        const body = {
            amount,
            currency,
            source: { id: token }, // token from Card SDK
            description: 'Payment from GHL funnel',
            customer: { email }
        };

        const tapResp = await fetch('https://api.tap.company/v2/charges', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.TAP_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await tapResp.json();
        res.status(tapResp.ok ? 200 : 400).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export as serverless function for Vercel
module.exports = app;
module.exports.handler = serverless(app);
