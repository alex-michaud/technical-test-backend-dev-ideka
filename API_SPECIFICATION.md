# API Specification: Telecom Cart Experience API

## Overview

This document outlines the design of a thin Experience API that powers a telecom cart on top of a non-persistent Salesforce cart context. The API provides cart management capabilities specifically tailored for telecom products such as mobile plans, data packages, and related services.

## Part A: API Design Specification

### Architecture

The Experience API follows a layered architecture:

1. **Routes Layer**: Express.js routes handling HTTP requests
2. **Service Layer**: Business logic for cart operations
3. **Model Layer**: TypeScript interfaces defining data structures
4. **Storage Layer**: In-memory non-persistent storage (simulating Salesforce cart context)

### Core Entities

#### Cart
Represents a user's shopping cart containing telecom products.

**Properties:**
- `id`: Unique cart identifier
- `userId`: User identifier
- `items`: Array of CartItem objects
- `createdAt`: Timestamp of cart creation
- `updatedAt`: Timestamp of last cart update

#### CartItem
Represents a telecom product in the cart.

**Properties:**
- `id`: Unique item identifier
- `productId`: Product SKU/identifier
- `productName`: Human-readable product name
- `quantity`: Number of items
- `price`: Unit price of the product
- `planType`: Type of plan (prepaid/postpaid) - optional
- `dataAllowance`: Data allowance (e.g., "50GB") - optional

### API Endpoints

#### 1. Retrieve Cart
- **Method**: GET
- **Path**: `/api/cart/:userId`
- **Description**: Gets or creates a cart for a specific user
- **Response**: Cart object with all items

#### 2. Add Item to Cart
- **Method**: POST
- **Path**: `/api/cart/:userId/items`
- **Description**: Adds a new telecom product to the cart
- **Request Body**: AddCartItemRequest
- **Response**: Updated Cart object

#### 3. Update Cart Item
- **Method**: PUT
- **Path**: `/api/cart/:userId/items/:itemId`
- **Description**: Updates quantity or price of an existing cart item
- **Request Body**: UpdateCartItemRequest
- **Response**: Updated Cart object

#### 4. Remove Cart Item
- **Method**: DELETE
- **Path**: `/api/cart/:userId/items/:itemId`
- **Description**: Removes a specific item from the cart
- **Response**: Updated Cart object

#### 5. Clear Cart
- **Method**: DELETE
- **Path**: `/api/cart/:userId`
- **Description**: Removes all items from the cart
- **Response**: Empty Cart object

#### 6. Get Cart Total
- **Method**: GET
- **Path**: `/api/cart/:userId/total`
- **Description**: Calculates the total price of all items in the cart
- **Response**: Object with userId and total amount

### Design Decisions

1. **RESTful Design**: Standard REST conventions for predictable API behavior
2. **Non-Persistent Storage**: In-memory storage for fast prototyping and testing
3. **User-Centric**: All operations are scoped to a specific userId
4. **Telecom-Specific Fields**: planType and dataAllowance fields support telecom use cases
5. **Automatic Cart Creation**: Carts are automatically created on first access
6. **Atomic Operations**: Each API call performs a complete operation

## Part B: Implementation Specification

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Mocha + Chai
- **Development**: ts-node, nodemon

### Project Structure

```
src/
├── models/CartItem.ts        # Data models and TypeScript interfaces
├── services/CartService.ts   # Business logic for cart operations
├── routes/cartRoutes.ts      # Express route handlers
├── middleware/errorHandler.ts # Error handling middleware
├── app.ts                    # Express application setup
└── server.ts                 # Server entry point

tests/
└── CartService.test.ts       # Unit tests for cart service
```

### Implementation Details

#### CartService
The core service class managing cart operations:

**Methods:**
- `getCart(userId)`: Retrieve or create a cart
- `addItem(userId, itemRequest)`: Add an item to the cart
- `updateItem(userId, itemId, updates)`: Update an existing item
- `removeItem(userId, itemId)`: Remove an item
- `clearCart(userId)`: Remove all items
- `getCartTotal(userId)`: Calculate total price

**Storage:**
- Uses a Map data structure for O(1) cart lookups
- Each cart is stored with userId as the key
- No database persistence (as per requirements)

#### Routes Implementation
Express.js routes with proper:
- HTTP method mapping
- URL parameter extraction
- Request body validation
- Error handling
- JSON responses

#### Testing Strategy

Comprehensive unit tests covering:
1. Cart creation and retrieval
2. Adding single and multiple items
3. Updating item properties
4. Removing specific items
5. Clearing entire cart
6. Total calculation accuracy
7. Error cases (item not found, etc.)

### API Usage Examples

#### Example 1: Create Cart and Add Premium Plan
```bash
# Add a premium postpaid plan
curl -X POST http://localhost:3000/api/cart/user123/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "premium-5g-plan",
    "productName": "Premium 5G Unlimited",
    "quantity": 1,
    "price": 79.99,
    "planType": "postpaid",
    "dataAllowance": "unlimited"
  }'
```

#### Example 2: Add Multiple Prepaid Plans
```bash
# Add prepaid data package
curl -X POST http://localhost:3000/api/cart/user456/items \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prepaid-50gb",
    "productName": "50GB Prepaid Data",
    "quantity": 2,
    "price": 29.99,
    "planType": "prepaid",
    "dataAllowance": "50GB"
  }'
```

#### Example 3: Update Quantity
```bash
# Update item quantity
curl -X PUT http://localhost:3000/api/cart/user123/items/{itemId} \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

#### Example 4: Get Cart Total
```bash
# Calculate total
curl http://localhost:3000/api/cart/user123/total
```

### Non-Functional Requirements

1. **Performance**: In-memory operations provide sub-millisecond response times
2. **Scalability**: Designed to be stateless, can scale horizontally with shared storage
3. **Maintainability**: TypeScript ensures type safety and better IDE support
4. **Testability**: Service layer separated from routes for easy unit testing
5. **Extensibility**: Interface-based design allows easy feature additions

### Future Enhancements

To evolve this into a production-ready system:

1. **Persistence Layer**: Integrate with actual Salesforce or database
2. **Authentication**: Add JWT or OAuth2 authentication
3. **Validation**: Use libraries like Joi or class-validator
4. **Caching**: Add Redis for distributed cart storage
5. **Events**: Emit cart events for analytics and integrations
6. **API Versioning**: Support multiple API versions
7. **Rate Limiting**: Protect against abuse
8. **Monitoring**: Add logging, metrics, and tracing
9. **Documentation**: Generate OpenAPI/Swagger specs
10. **Cart Expiration**: Implement automatic cart cleanup

## Part C: Implementation Complete

The implementation is complete and includes:

✅ Full Express.js TypeScript application
✅ Non-persistent cart service with all operations
✅ RESTful API endpoints
✅ Comprehensive unit tests with Chai
✅ Development and production build scripts
✅ API documentation and examples
✅ Clean folder structure (src/ and tests/)
✅ Type-safe models and interfaces

The application is ready to run and can be started with:
```bash
npm install
npm run dev  # for development
npm test     # to run tests
```
