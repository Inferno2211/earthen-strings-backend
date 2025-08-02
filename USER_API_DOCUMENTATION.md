# User Module API Documentation

## Overview

The User Module provides complete authentication and user management functionality including:
- User registration and login with JWT tokens
- Email verification system
- Password reset functionality
- Address management
- Role-based access control (User/Admin)
- Profile management

## Authentication Endpoints

### Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user account
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "emailVerified": false
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Login User
- **Endpoint:** `POST /api/auth/login`
- **Description:** Login with email and password
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "emailVerified": true,
      "cart": "cart_id"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### Logout User
- **Endpoint:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Logout user and invalidate refresh token
- **Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Refresh Token
- **Endpoint:** `POST /api/auth/refresh`
- **Description:** Get new access token using refresh token
- **Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
    }
  }
}
```

### Verify Email
- **Endpoint:** `GET /api/auth/verify-email?token=<verification_token>`
- **Description:** Verify email address using token from email
- **Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Resend Verification Email
- **Endpoint:** `POST /api/auth/resend-verification`
- **Description:** Resend email verification link
- **Body:**
```json
{
  "email": "user@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Verification email sent successfully"
}
```

### Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Description:** Send password reset email
- **Body:**
```json
{
  "email": "user@example.com"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset link has been sent"
}
```

### Reset Password
- **Endpoint:** `POST /api/auth/reset-password`
- **Description:** Reset password using token from email
- **Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Change Password
- **Endpoint:** `PUT /api/auth/change-password`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Change password for authenticated user
- **Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get current user profile
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "user",
    "emailVerified": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "addresses": [],
    "wishlist": [],
    "cart": {
      "_id": "cart_id",
      "items": [],
      "total": 0
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Profile
- **Endpoint:** `PUT /api/auth/profile`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Update user profile information
- **Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "user",
    "emailVerified": true
  }
}
```

## Address Management Endpoints

### Get User Addresses
- **Endpoint:** `GET /api/users/addresses`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get all addresses for current user
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "address_id",
      "type": "shipping",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA",
      "isDefault": true
    }
  ]
}
```

### Add Address
- **Endpoint:** `POST /api/users/addresses`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Add new address for current user
- **Body:**
```json
{
  "type": "shipping",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": true
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": [
    {
      "_id": "address_id",
      "type": "shipping",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA",
      "isDefault": true
    }
  ]
}
```

### Update Address
- **Endpoint:** `PUT /api/users/addresses/:addressId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Update existing address
- **Body:**
```json
{
  "street": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90210",
  "country": "USA",
  "isDefault": false
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": [
    {
      "_id": "address_id",
      "type": "shipping",
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90210",
      "country": "USA",
      "isDefault": false
    }
  ]
}
```

### Delete Address
- **Endpoint:** `DELETE /api/users/addresses/:addressId`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Delete address by ID
- **Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": []
}
```

### Get Default Address
- **Endpoint:** `GET /api/users/addresses/default/:type`
- **Headers:** `Authorization: Bearer <access_token>`
- **Description:** Get default address by type (shipping/billing)
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "address_id",
    "type": "shipping",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA",
    "isDefault": true
  }
}
```

## Admin Endpoints

### Get All Users (Admin Only)
- **Endpoint:** `GET /api/users/admin/users`
- **Headers:** `Authorization: Bearer <admin_access_token>`
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
  - `search` (optional): Search by name or email
  - `role` (optional): Filter by role (user/admin)
  - `emailVerified` (optional): Filter by email verification status
- **Response:**
```json
{
  "success": true,
  "data": {
    "docs": [
      {
        "_id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "user",
        "emailVerified": true,
        "lastLogin": "2024-01-01T00:00:00.000Z",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "totalDocs": 1,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Get User by ID (Admin Only)
- **Endpoint:** `GET /api/users/admin/users/:userId`
- **Headers:** `Authorization: Bearer <admin_access_token>`
- **Description:** Get detailed user information including cart and wishlist
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "user",
    "emailVerified": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "addresses": [],
    "wishlist": [],
    "cart": {
      "_id": "cart_id",
      "items": [],
      "total": 0
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update User by ID (Admin Only)
- **Endpoint:** `PUT /api/users/admin/users/:userId`
- **Headers:** `Authorization: Bearer <admin_access_token>`
- **Description:** Update user information (admin only)
- **Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1987654321",
  "role": "admin",
  "emailVerified": true
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "user_id",
    "email": "user@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1987654321",
    "role": "admin",
    "emailVerified": true
  }
}
```

### Delete User by ID (Admin Only)
- **Endpoint:** `DELETE /api/users/admin/users/:userId`
- **Headers:** `Authorization: Bearer <admin_access_token>`
- **Description:** Delete user account (admin only)
- **Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Data Models

### User Schema
```javascript
{
  email: String (required, unique, lowercase),
  password: String (required, min 6 chars, hashed),
  firstName: String (required),
  lastName: String (required),
  phone: String (optional),
  role: String (enum: ['user', 'admin'], default: 'user'),
  lastLogin: Date,
  emailVerified: Boolean (default: false),
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  refreshToken: String,
  addresses: [AddressSchema],
  wishlist: [ObjectId (ref: 'Product')],
  cart: ObjectId (ref: 'Cart'),
  timestamps: true
}
```

### Address Schema
```javascript
{
  type: String (enum: ['shipping', 'billing'], required),
  street: String (required),
  city: String (required),
  state: String (required),
  postalCode: String (required),
  country: String (required),
  isDefault: Boolean (default: false)
}
```

## Authentication Flow

1. **Registration:**
   - User registers with email/password
   - Verification email sent automatically
   - JWT tokens generated for immediate login

2. **Email Verification:**
   - User clicks link in email
   - Email marked as verified
   - Welcome email sent

3. **Login:**
   - User provides email/password
   - Password verified with bcrypt
   - JWT tokens generated
   - Last login updated

4. **Token Management:**
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Refresh endpoint for new tokens

5. **Password Reset:**
   - User requests reset via email
   - Reset token generated and emailed
   - User clicks link and sets new password

## Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Tokens:** Access and refresh token system
- **Email Verification:** Required for full access
- **Role-based Access:** User and admin roles
- **Token Expiration:** Configurable expiry times
- **Input Validation:** Comprehensive validation
- **Rate Limiting:** Protection against abuse

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