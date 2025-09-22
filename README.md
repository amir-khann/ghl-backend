# ghl-backend

# GHL Backend

A Node.js backend server for processing payments through Tap payment gateway integration.

## Features

- Express.js server
- Tap payment gateway integration
- Payment charge creation endpoint
- JSON request/response handling

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
export TAP_API_KEY=your_tap_api_key_here
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will run on port 3000.

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add `TAP_API_KEY` environment variable

4. Your API will be available at:
   - `https://your-project.vercel.app/health`
   - `https://your-project.vercel.app/test`
   - `https://your-project.vercel.app/create-charge`

## API Endpoints

### GET /

Root endpoint that provides API information and available endpoints.

**Response:**
```json
{
  "message": "Welcome to GHL Backend API",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "test": "GET /test",
    "createCharge": "POST /create-charge"
  }
}
```

### GET /health

Health check endpoint to verify if the deployment is running.

**Response:**
```json
{
  "status": "OK",
  "message": "GHL Backend is running successfully on Vercel",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "platform": "Vercel Serverless"
}
```

### GET /test

Test endpoint to verify API functionality.

**Response:**
```json
{
  "message": "API is working correctly",
  "server": "GHL Backend",
  "version": "1.0.0",
  "endpoints": {
    "health": "GET /health",
    "test": "GET /test",
    "createCharge": "POST /create-charge"
  }
}
```

### POST /create-charge

Creates a payment charge through Tap payment gateway.

**Request Body:**
```json
{
  "token": "card_token_from_sdk",
  "amount": 100,
  "currency": "KWD",
  "email": "customer@example.com"
}
```

**Response:**
- Success: Returns Tap API response with charge details
- Error: Returns error message with appropriate HTTP status

## Environment

- Node.js
- Express.js
- Tap Payment Gateway API
- Test API Key: `[YOUR_TAP_API_KEY]`

## Security Note

⚠️ The current implementation uses a test API key. For production, move the API key to environment variables and use your live secret key.
