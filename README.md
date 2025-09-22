# ghl-backend

# GHL Backend

A Node.js backend server for processing payments through Tap payment gateway integration.

## Features

- Express.js server
- Tap payment gateway integration
- Payment charge creation endpoint
- JSON request/response handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will run on port 3000.

## API Endpoints

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
