// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// Test route to check if deployment is running
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'GHL Backend is running successfully',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test route for basic API functionality
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'API is working correctly',
    server: 'GHL Backend',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      test: 'GET /test',
      createCharge: 'POST /create-charge'
    }
  });
});

// Payment charge creation endpoint
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

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to GHL Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      test: 'GET /test',
      createCharge: 'POST /create-charge'
    },
    documentation: 'See README.md for API documentation'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
});
