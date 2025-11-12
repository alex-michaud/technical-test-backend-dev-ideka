# Telecom Cart Experience API

Technical test for a position as senior backend developer - A thin Experience API that powers a telecom cart on top of a non-persistent Salesforce cart context.

## Project Structure

```
├── src/
│   ├── models/         # Data models and interfaces
│   ├── services/       # Business logic layer
│   ├── routes/         # API route handlers
│   ├── middleware/     # Express middleware
│   ├── app.ts         # Express app configuration
│   └── server.ts      # Server entry point
├── tests/             # Unit tests using Chai
└── dist/              # Compiled JavaScript (generated)
```

## Features

- ✅ Express.js backend with TypeScript
- ✅ Non-persistent in-memory cart management
- ✅ RESTful API design
- ✅ Unit tests with Mocha and Chai
- ✅ Telecom-specific cart operations (plans, data allowances)

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn

## Installation

```bash
npm install
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot-reload using nodemon.

### Build
```bash
npm run build
```
Compiles TypeScript to JavaScript in the `dist/` folder.

### Start Production
```bash
npm start
```
Runs the compiled JavaScript from the `dist/` folder.

### Test
```bash
npm test
```
Runs all unit tests using Mocha and Chai.

### Test Watch Mode
```bash
npm run test:watch
```
Runs tests in watch mode for development.

## API Endpoints

Base URL: `http://localhost:3000`

### Get API Info
```
GET /
```
Returns API information and available endpoints.

### Get Cart
```
GET /api/cart/:userId
```
Retrieves the cart for a specific user. Creates a new empty cart if one doesn't exist.

**Example:**
```bash
curl http://localhost:3000/api/cart/user123
```

### Add Item to Cart
```
POST /api/cart/:userId/items
```
Adds a new item to the user's cart.

**Request Body:**
```json
{
  "productId": "plan-premium-001",
  "productName": "Premium 5G Plan",
  "quantity": 1,
  "price": 59.99,
  "planType": "postpaid",
  "dataAllowance": "100GB"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/cart/user123/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "plan-premium-001",
    "productName": "Premium 5G Plan",
    "quantity": 1,
    "price": 59.99,
    "planType": "postpaid",
    "dataAllowance": "100GB"
  }'
```

### Update Cart Item
```
PUT /api/cart/:userId/items/:itemId
```
Updates an existing item in the cart.

**Request Body:**
```json
{
  "quantity": 2,
  "price": 54.99
}
```

### Remove Item from Cart
```
DELETE /api/cart/:userId/items/:itemId
```
Removes a specific item from the cart.

### Clear Cart
```
DELETE /api/cart/:userId
```
Removes all items from the user's cart.

### Get Cart Total
```
GET /api/cart/:userId/total
```
Calculates and returns the total price of all items in the cart.

**Example:**
```bash
curl http://localhost:3000/api/cart/user123/total
```

## Data Models

### CartItem
```typescript
interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  planType?: 'prepaid' | 'postpaid';
  dataAllowance?: string;
}
```

### Cart
```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Testing

The project includes comprehensive unit tests for the CartService covering:
- Cart creation and retrieval
- Adding items to cart
- Updating cart items
- Removing items from cart
- Clearing the cart
- Calculating cart totals

Run tests with:
```bash
npm test
```

## Technical Details

- **TypeScript**: Strongly typed codebase for better maintainability
- **Express.js**: Fast, unopinionated web framework
- **Non-persistent Storage**: In-memory cart management (no database required)
- **Mocha + Chai**: Robust testing framework and assertion library
- **Hot Reload**: Development server with automatic restarts on file changes

## Notes

This is a non-persistent implementation suitable for demonstration and development purposes. In a production environment, you would want to:
- Add database persistence (e.g., MongoDB, PostgreSQL)
- Implement proper authentication and authorization
- Add request validation middleware
- Implement proper error handling and logging
- Add API rate limiting
- Set up CORS properly
- Add API documentation (Swagger/OpenAPI)
- Implement cart expiration/cleanup mechanisms
