const express = require('express');
const fetch = require('node-fetch');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running on Vercel' });
});

app.get('/test', (req, res) => {
    res.json({ message: 'API is working correctly' });
});

app.post('/create-charge', async (req, res) => {
    const { token, amount, currency, email } = req.body;
    if (!token || !amount || !currency || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const tapResp = await fetch('https://api.tap.company/v2/charges', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.TAP_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                currency,
                source: { id: token },
                customer: { email },
                description: 'Payment from GHL funnel',
            }),
        });

        const data = await tapResp.json();
        res.status(tapResp.ok ? 200 : 400).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export as serverless function
module.exports = app;
module.exports.handler = serverless(app);
