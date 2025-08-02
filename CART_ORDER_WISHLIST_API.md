# Cart, Order & Wishlist API Documentation

## Overview

This document covers the Cart, Order, and Wishlist management endpoints that handle user shopping functionality.

## Cart Endpoints

### Get User's Cart
- **Endpoint:** `GET /api/cart`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get current user's cart with populated product details
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "_id": "item_id",
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "image": "image_url",
          "price": 99.99,
          "slug": "product-slug",
          "description": "Product description"
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "total": 199.98,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Add Item to Cart
- **Endpoint:** `POST /api/cart/add`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Add product to user's cart
- **Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "_id": "cart_id",
    "items": [...],
    "total": 199.98
  }
}
```

### Update Cart Item Quantity
- **Endpoint:** `PUT /api/cart/update/:productId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Update quantity of specific item in cart
- **Body:**
```json
{
  "quantity": 3
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Cart item updated successfully",
  "data": {
    "_id": "cart_id",
    "items": [...],
    "total": 299.97
  }
}
```

### Remove Item from Cart
- **Endpoint:** `DELETE /api/cart/remove/:productId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Remove specific product from cart
- **Response:**
```json
{
  "success": true,
  "message": "Item removed from cart successfully",
  "data": {
    "_id": "cart_id",
    "items": [...],
    "total": 99.99
  }
}
```

### Clear Cart
- **Endpoint:** `DELETE /api/cart/clear`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Remove all items from cart
- **Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": {
    "_id": "cart_id",
    "items": [],
    "total": 0
  }
}
```

### Get Cart Total
- **Endpoint:** `GET /api/cart/total`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get cart total and item count
- **Response:**
```json
{
  "success": true,
  "data": {
    "total": 199.98,
    "itemCount": 3,
    "items": 2
  }
}
```

## Order Endpoints

### Create Order from Cart
- **Endpoint:** `POST /api/orders/create`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Create order from current cart items
- **Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "notes": "Please deliver during business hours"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "order_id",
    "userId": "user_id",
    "items": [
      {
        "productId": "product_id",
        "name": "Product Name",
        "priceAtPurchase": 99.99,
        "quantity": 2
      }
    ],
    "status": "pending",
    "totalAmount": 199.98,
    "shippingAddress": {...},
    "billingAddress": {...},
    "paymentStatus": "pending",
    "paymentMethod": "credit_card",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get User's Orders
- **Endpoint:** `GET /api/orders/my-orders`
- **Headers:** `Authorization: Bearer <access_token>`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by order status
- **Response:**
```json
{
  "success": true,
  "data": {
    "docs": [
      {
        "_id": "order_id",
        "userId": "user_id",
        "items": [...],
        "status": "pending",
        "totalAmount": 199.98,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 1,
    "limit": 10,
    "page": 1,
    "totalPages": 1
  }
}
```

### Get Specific Order
- **Endpoint:** `GET /api/orders/:orderId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get detailed order information
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "order_id",
    "userId": "user_id",
    "items": [
      {
        "productId": {
          "_id": "product_id",
          "name": "Product Name",
          "image": "image_url",
          "slug": "product-slug",
          "description": "Product description"
        },
        "name": "Product Name",
        "priceAtPurchase": 99.99,
        "quantity": 2
      }
    ],
    "status": "pending",
    "totalAmount": 199.98,
    "shippingAddress": {...},
    "billingAddress": {...},
    "paymentStatus": "pending",
    "paymentMethod": "credit_card",
    "trackingNumber": null,
    "notes": "Please deliver during business hours",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Cancel Order
- **Endpoint:** `PUT /api/orders/:orderId/cancel`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Cancel a pending order
- **Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "order_id",
    "status": "cancelled",
    ...
  }
}
```

### Update Payment Status
- **Endpoint:** `PUT /api/orders/:orderId/payment`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Update order payment status
- **Body:**
```json
{
  "paymentStatus": "paid"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Payment status updated successfully",
  "data": {
    "_id": "order_id",
    "paymentStatus": "paid",
    ...
  }
}
```

### Get All Orders (Admin Only)
- **Endpoint:** `GET /api/orders/admin/all`
- **Headers:** `Authorization: Bearer <admin_access_token>`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `status` (optional): Filter by order status
  - `userId` (optional): Filter by user ID
- **Response:**
```json
{
  "success": true,
  "data": {
    "docs": [
      {
        "_id": "order_id",
        "userId": {
          "_id": "user_id",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "items": [...],
        "status": "pending",
        "totalAmount": 199.98,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 1,
    "limit": 10,
    "page": 1,
    "totalPages": 1
  }
}
```

### Update Order Status (Admin Only)
- **Endpoint:** `PUT /api/orders/admin/:orderId/status`
- **Headers:** `Authorization: Bearer <admin_access_token>`
- **Description:** Update order status and tracking number
- **Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "_id": "order_id",
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    ...
  }
}
```

## Wishlist Endpoints

### Get User's Wishlist
- **Endpoint:** `GET /api/wishlist`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get user's wishlist with product details
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "image": "image_url",
      "price": 99.99,
      "slug": "product-slug",
      "description": "Product description",
      "category": {
        "_id": "category_id",
        "name": "Category Name"
      }
    }
  ]
}
```

### Add Product to Wishlist
- **Endpoint:** `POST /api/wishlist/add`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Add product to user's wishlist
- **Body:**
```json
{
  "productId": "product_id"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist successfully",
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "image": "image_url",
      "price": 99.99,
      "slug": "product-slug",
      "description": "Product description",
      "category": {...}
    }
  ]
}
```

### Remove Product from Wishlist
- **Endpoint:** `DELETE /api/wishlist/remove/:productId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Remove product from user's wishlist
- **Response:**
```json
{
  "success": true,
  "message": "Product removed from wishlist successfully",
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      ...
    }
  ]
}
```

### Clear Wishlist
- **Endpoint:** `DELETE /api/wishlist/clear`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Remove all products from wishlist
- **Response:**
```json
{
  "success": true,
  "message": "Wishlist cleared successfully",
  "data": []
}
```

### Check if Product is in Wishlist
- **Endpoint:** `GET /api/wishlist/check/:productId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Check if specific product is in user's wishlist
- **Response:**
```json
{
  "success": true,
  "data": {
    "isInWishlist": true,
    "productId": "product_id"
  }
}
```

### Get Wishlist Count
- **Endpoint:** `GET /api/wishlist/count`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get number of items in wishlist
- **Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

## Data Models

### Cart Schema
```javascript
{
  user: ObjectId (ref: 'User', required, unique),
  items: [{
    product: ObjectId (ref: 'Product', required),
    quantity: Number (required, min: 1),
    price: Number (required, min: 0)
  }],
  total: Number (default: 0),
  timestamps: true
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: 'User', required),
  items: [{
    productId: ObjectId (ref: 'Product', required),
    name: String (required),
    priceAtPurchase: Number (required, min: 0),
    quantity: Number (required, min: 1)
  }],
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  totalAmount: Number (required, min: 0),
  shippingAddress: {
    street: String (required),
    city: String (required),
    state: String (required),
    postalCode: String (required),
    country: String (required)
  },
  billingAddress: {
    street: String (required),
    city: String (required),
    state: String (required),
    postalCode: String (required),
    country: String (required)
  },
  paymentStatus: String (enum: ['pending', 'paid', 'failed', 'refunded']),
  paymentMethod: String,
  trackingNumber: String,
  notes: String,
  timestamps: true
}
```

## Order Status Flow

1. **pending** - Order created, waiting for payment
2. **processing** - Payment received, preparing for shipment
3. **shipped** - Order shipped with tracking number
4. **delivered** - Order successfully delivered
5. **cancelled** - Order cancelled (only pending orders can be cancelled)

## Payment Status Flow

1. **pending** - Payment not yet processed
2. **paid** - Payment successfully completed
3. **failed** - Payment failed
4. **refunded** - Payment refunded

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error 