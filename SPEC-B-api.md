# API Specification: Telecom Cart API

## Overview

This document outlines the design of an API that powers a telecom cart.
It should follow strict RESTful principles and be implemented using TypeScript and Express.js.

## Part A: API Design Specification

### Architecture

The Experience API follows a layered architecture:

1. **Routes Layer**: Express.js routes handling HTTP requests
2. **Service Layer**: Business logic for cart operations
3. **Model Layer**: TypeScript interfaces defining data structures

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
