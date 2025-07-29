# Earthen Strings API Documentation

A comprehensive guide to the Earthen Strings backend API endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required for these endpoints.

## Categories

### Create Category
- **Endpoint:** `POST /categories/create`
- **Description:** Create a new category
- **Body:**
```json
{
  "name": "String Art",
  "description": "Beautiful string art pieces",
  "image": "https://example.com/image.jpg"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "String Art",
    "description": "Beautiful string art pieces",
    "image": "https://example.com/image.jpg",
    "slug": "string-art",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Categories
- **Endpoint:** `GET /categories/getAll`
- **Description:** Retrieve all categories with optional sorting
- **Query Parameters:**
  - `sort`: Field to sort by (default: 'name')
  - `order`: 'asc' or 'desc' (default: 'asc')
- **Example:** `GET /categories/getAll?sort=name&order=desc`
- **Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "String Art",
      "description": "Beautiful string art pieces",
      "image": "https://example.com/image.jpg",
      "slug": "string-art",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Category by ID or Slug
- **Endpoint:** `GET /categories/getOne/:id`
- **Description:** Retrieve a single category by ID or slug
- **Example:** `GET /categories/getOne/string-art`
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "String Art",
    "description": "Beautiful string art pieces",
    "image": "https://example.com/image.jpg",
    "slug": "string-art",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Category
- **Endpoint:** `PUT /categories/update/:id`
- **Description:** Update an existing category
- **Body:** Same as create
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Updated String Art",
    "description": "Updated description",
    "image": "https://example.com/updated-image.jpg",
    "slug": "updated-string-art",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Category
- **Endpoint:** `DELETE /categories/delete/:id`
- **Description:** Delete a category by ID or slug
- **Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Products

### Create Product
- **Endpoint:** `POST /products/create`
- **Description:** Create a new product
- **Body:**
```json
{
  "name": "Ocean Wave String Art",
  "image": "https://example.com/product.jpg",
  "category": "64f1a2b3c4d5e6f7g8h9i0j1",
  "price": 150.00,
  "description": "Beautiful ocean wave string art",
  "isNew": true,
  "published": true,
  "artistPick": false,
  "details": {
    "length": 24,
    "width": 12,
    "height": 2,
    "material": "Wood",
    "color": "Blue and White"
  }
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Ocean Wave String Art",
    "image": "https://example.com/product.jpg",
    "category": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "String Art",
      "slug": "string-art"
    },
    "slug": "ocean-wave-string-art",
    "price": 150.00,
    "description": "Beautiful ocean wave string art",
    "isNew": true,
    "published": true,
    "artistPick": false,
    "details": {
      "length": 24,
      "width": 12,
      "height": 2,
      "material": "Wood",
      "color": "Blue and White"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Products
- **Endpoint:** `GET /products/getAll`
- **Description:** Retrieve all products with filtering, sorting, and pagination
- **Query Parameters:**
  - `sort`: Field to sort by (default: 'createdAt')
  - `order`: 'asc' or 'desc' (default: 'desc')
  - `isNew`: 'true' or 'false' (filter by new products)
  - `published`: 'true' or 'false' (filter by published status)
  - `artistPick`: 'true' or 'false' (filter by artist pick)
  - `category`: Category ID or slug (filter by category)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Examples:**
  - `GET /products/getAll?published=true&isNew=true`
  - `GET /products/getAll?category=string-art&sort=price&order=asc`
  - `GET /products/getAll?page=2&limit=5`
- **Response:**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "pages": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Ocean Wave String Art",
      "image": "https://example.com/product.jpg",
      "category": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "String Art",
        "slug": "string-art"
      },
      "slug": "ocean-wave-string-art",
      "price": 150.00,
      "description": "Beautiful ocean wave string art",
      "isNew": true,
      "published": true,
      "artistPick": false,
      "details": {
        "length": 24,
        "width": 12,
        "height": 2,
        "material": "Wood",
        "color": "Blue and White"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Product by ID or Slug
- **Endpoint:** `GET /products/getOne/:id`
- **Description:** Retrieve a single product by ID or slug
- **Example:** `GET /products/getOne/ocean-wave-string-art`
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Ocean Wave String Art",
    "image": "https://example.com/product.jpg",
    "category": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "String Art",
      "slug": "string-art"
    },
    "slug": "ocean-wave-string-art",
    "price": 150.00,
    "description": "Beautiful ocean wave string art",
    "isNew": true,
    "published": true,
    "artistPick": false,
    "details": {
      "length": 24,
      "width": 12,
      "height": 2,
      "material": "Wood",
      "color": "Blue and White"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Product
- **Endpoint:** `PUT /products/update/:id`
- **Description:** Update an existing product
- **Body:** Same as create
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Updated Ocean Wave String Art",
    "image": "https://example.com/updated-product.jpg",
    "category": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "String Art",
      "slug": "string-art"
    },
    "slug": "updated-ocean-wave-string-art",
    "price": 175.00,
    "description": "Updated description",
    "isNew": false,
    "published": true,
    "artistPick": true,
    "details": {
      "length": 24,
      "width": 12,
      "height": 2,
      "material": "Wood",
      "color": "Blue and White"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Toggle Product Fields
- **Endpoint:** `PATCH /products/toggle/:id`
- **Description:** Toggle boolean fields (isNew, published, artistPick)
- **Body:**
```json
{
  "field": "isNew"
}
```
- **Allowed fields:** "isNew", "published", "artistPick"
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Ocean Wave String Art",
    "image": "https://example.com/product.jpg",
    "category": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "String Art",
      "slug": "string-art"
    },
    "slug": "ocean-wave-string-art",
    "price": 150.00,
    "description": "Beautiful ocean wave string art",
    "isNew": false,
    "published": true,
    "artistPick": false,
    "details": {
      "length": 24,
      "width": 12,
      "height": 2,
      "material": "Wood",
      "color": "Blue and White"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Product
- **Endpoint:** `DELETE /products/delete/:id`
- **Description:** Delete a product by ID or slug
- **Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": "Category name is required"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": "Category not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Data Models

### Category Schema
- `name` (String, required, unique)
- `description` (String, required)
- `image` (String, required) - URL to image
- `slug` (String, unique, auto-generated from name)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

### Product Schema
- `name` (String, required)
- `image` (String, required) - URL to image
- `category` (ObjectId, ref: Category, required)
- `slug` (String, unique, auto-generated from name)
- `price` (Number, required, min: 0)
- `description` (String, required)
- `isNew` (Boolean, default: false)
- `published` (Boolean, default: false)
- `artistPick` (Boolean, default: false)
- `details` (Object):
  - `length` (Number, min: 0)
  - `width` (Number, min: 0)
  - `height` (Number, min: 0)
  - `material` (String)
  - `color` (String)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated) 