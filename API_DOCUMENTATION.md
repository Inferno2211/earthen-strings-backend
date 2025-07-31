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
- **Description:** Delete a category by ID or slug (also deletes associated image from Cloudinary)
- **Response:**
```json
{
  "success": true,
  "message": "Category and associated image deleted successfully"
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
- **Description:** Delete a product by ID or slug (also deletes associated image from Cloudinary)
- **Response:**
```json
{
  "success": true,
  "message": "Product and associated image deleted successfully"
}
```

## Banners

### Create Banner
- **Endpoint:** `POST /banners/create`
- **Description:** Create a new banner
- **Body:**
```json
{
  "name": "Summer Sale Banner",
  "image": "https://example.com/banner.jpg",
  "product": "64f1a2b3c4d5e6f7g8h9i0j2",
  "active": true
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Summer Sale Banner",
    "image": "https://example.com/banner.jpg",
    "product": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Ocean Wave String Art",
      "slug": "ocean-wave-string-art",
      "image": "https://example.com/product.jpg"
    },
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Banners
- **Endpoint:** `GET /banners/getAll`
- **Description:** Retrieve all banners with optional filtering and sorting
- **Query Parameters:**
  - `active`: 'true' or 'false' (filter by active status)
  - `sort`: Field to sort by (default: 'createdAt')
  - `order`: 'asc' or 'desc' (default: 'desc')
- **Examples:**
  - `GET /banners/getAll?active=true`
  - `GET /banners/getAll?sort=name&order=asc`
- **Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "name": "Summer Sale Banner",
      "image": "https://example.com/banner.jpg",
      "product": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "name": "Ocean Wave String Art",
        "slug": "ocean-wave-string-art",
        "image": "https://example.com/product.jpg"
      },
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Banner by ID
- **Endpoint:** `GET /banners/getOne/:id`
- **Description:** Retrieve a single banner by ID
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Summer Sale Banner",
    "image": "https://example.com/banner.jpg",
    "product": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Ocean Wave String Art",
      "slug": "ocean-wave-string-art",
      "image": "https://example.com/product.jpg"
    },
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Banner
- **Endpoint:** `PUT /banners/update/:id`
- **Description:** Update an existing banner
- **Body:** Same as create
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Updated Summer Sale Banner",
    "image": "https://example.com/updated-banner.jpg",
    "product": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Ocean Wave String Art",
      "slug": "ocean-wave-string-art",
      "image": "https://example.com/product.jpg"
    },
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Toggle Banner Active Status
- **Endpoint:** `PATCH /banners/toggle/:id`
- **Description:** Toggle banner active status
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
    "name": "Summer Sale Banner",
    "image": "https://example.com/banner.jpg",
    "product": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "name": "Ocean Wave String Art",
      "slug": "ocean-wave-string-art",
      "image": "https://example.com/product.jpg"
    },
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Banner
- **Endpoint:** `DELETE /banners/delete/:id`
- **Description:** Delete a banner by ID (also deletes associated image from Cloudinary)
- **Response:**
```json
{
  "success": true,
  "message": "Banner and associated image deleted successfully"
}
```

## Instagram Posts

### Create Instagram Post
- **Endpoint:** `POST /instagram-posts/create`
- **Description:** Create a new Instagram post
- **Body:**
```json
{
  "postName": "New String Art Creation",
  "image": "https://example.com/instagram-post.jpg",
  "postUrl": "https://instagram.com/p/ABC123",
  "active": true
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "postName": "New String Art Creation",
    "image": "https://example.com/instagram-post.jpg",
    "postUrl": "https://instagram.com/p/ABC123",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Instagram Posts
- **Endpoint:** `GET /instagram-posts/getAll`
- **Description:** Retrieve all Instagram posts with optional filtering and sorting
- **Query Parameters:**
  - `active`: 'true' or 'false' (filter by active status)
  - `sort`: Field to sort by (default: 'createdAt')
  - `order`: 'asc' or 'desc' (default: 'desc')
- **Examples:**
  - `GET /instagram-posts/getAll?active=true`
  - `GET /instagram-posts/getAll?sort=postName&order=asc`
- **Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "postName": "New String Art Creation",
      "image": "https://example.com/instagram-post.jpg",
      "postUrl": "https://instagram.com/p/ABC123",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Instagram Post by ID
- **Endpoint:** `GET /instagram-posts/getOne/:id`
- **Description:** Retrieve a single Instagram post by ID
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "postName": "New String Art Creation",
    "image": "https://example.com/instagram-post.jpg",
    "postUrl": "https://instagram.com/p/ABC123",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Update Instagram Post
- **Endpoint:** `PUT /instagram-posts/update/:id`
- **Description:** Update an existing Instagram post
- **Body:** Same as create
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "postName": "Updated String Art Creation",
    "image": "https://example.com/updated-instagram-post.jpg",
    "postUrl": "https://instagram.com/p/XYZ789",
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Toggle Instagram Post Active Status
- **Endpoint:** `PATCH /instagram-posts/toggle/:id`
- **Description:** Toggle Instagram post active status
- **Response:**
```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "postName": "New String Art Creation",
    "image": "https://example.com/instagram-post.jpg",
    "postUrl": "https://instagram.com/p/ABC123",
    "active": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Instagram Post
- **Endpoint:** `DELETE /instagram-posts/delete/:id`
- **Description:** Delete an Instagram post by ID (also deletes associated image from Cloudinary)
- **Response:**
```json
{
  "success": true,
  "message": "Instagram post and associated image deleted successfully"
}
```

## File Uploads

### Upload Image
- **Endpoint:** `POST /upload/image`
- **Description:** Upload an image to Cloudinary
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: Image file (jpg, jpeg, png, gif, webp)
  - `folder`: (optional) Custom folder name
- **Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "earthen-strings/images/abc123",
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/earthen-strings/images/abc123.jpg",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "size": 245760
  }
}
```

### Upload Video
- **Endpoint:** `POST /upload/video`
- **Description:** Upload a video to Cloudinary
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: Video file (mp4, avi, mov, wmv, flv, webm)
  - `folder`: (optional) Custom folder name
- **Response:**
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "public_id": "earthen-strings/videos/abc123",
    "url": "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/earthen-strings/videos/abc123.mp4",
    "width": 1920,
    "height": 1080,
    "format": "mp4",
    "size": 5242880,
    "duration": 30.5
  }
}
```

### Upload Document
- **Endpoint:** `POST /upload/document`
- **Description:** Upload a document to Cloudinary
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: Document file (pdf, doc, docx, txt, rtf)
  - `folder`: (optional) Custom folder name
- **Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "public_id": "earthen-strings/documents/abc123",
    "url": "https://res.cloudinary.com/your-cloud/raw/upload/v1234567890/earthen-strings/documents/abc123.pdf",
    "format": "pdf",
    "size": 1024000
  }
}
```

### Upload Any File
- **Endpoint:** `POST /upload/file`
- **Description:** Upload any file type to Cloudinary (auto-detect)
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file`: Any file type
  - `folder`: (optional) Custom folder name
- **Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "public_id": "earthen-strings/files/abc123",
    "url": "https://res.cloudinary.com/your-cloud/auto/upload/v1234567890/earthen-strings/files/abc123.zip",
    "width": null,
    "height": null,
    "format": "zip",
    "size": 2048000,
    "resource_type": "raw"
  }
}
```

### Delete Uploaded File
- **Endpoint:** `DELETE /upload/delete`
- **Description:** Delete a file from Cloudinary
- **Body:**
```json
{
  "publicId": "earthen-strings/images/abc123",
  "resourceType": "image"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "File deleted successfully",
  "data": {
    "result": "ok"
  }
}
```

### Get File Info
- **Endpoint:** `GET /upload/info`
- **Description:** Get information about an uploaded file
- **Query Parameters:**
  - `publicId`: Cloudinary public ID
  - `resourceType`: Resource type (image, video, raw)
- **Example:** `GET /upload/info?publicId=earthen-strings/images/abc123&resourceType=image`
- **Response:**
```json
{
  "success": true,
  "data": {
    "public_id": "earthen-strings/images/abc123",
    "format": "jpg",
    "version": 1234567890,
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/earthen-strings/images/abc123.jpg",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/earthen-strings/images/abc123.jpg",
    "width": 1920,
    "height": 1080,
    "bytes": 245760,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
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

### Banner Schema
- `name` (String, required)
- `image` (String, required) - URL to image
- `product` (ObjectId, ref: Product, required)
- `active` (Boolean, default: false)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated)

### Instagram Post Schema
- `postName` (String, required)
- `image` (String, required) - URL to image
- `postUrl` (String, required) - URL to Instagram post
- `active` (Boolean, default: false)
- `createdAt` (Date, auto-generated)
- `updatedAt` (Date, auto-generated) 