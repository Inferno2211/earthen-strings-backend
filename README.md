# Earthen Strings Backend API

A RESTful API for managing categories and products for the Earthen Strings e-commerce platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/earthen-strings
NODE_ENV=development
```

3. Start the server:
```bash
npm start
```

## Documentation

- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation
- **Postman Collection**: Import [Earthen_Strings_API.postman_collection.json](./Earthen_Strings_API.postman_collection.json) into Postman for testing

## Features

- **Auto-generated slugs** from names for SEO-friendly URLs
- **Flexible filtering** by boolean fields and categories
- **Pagination** for product listings
- **Sorting** by any field in ascending or descending order
- **Toggle functionality** for boolean fields (isNew, published, artistPick)
- **Category population** in product responses
- **Error handling** with descriptive messages
- **CORS enabled** for frontend integration

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── categoryController.js
│   │   └── productController.js
│   ├── models/
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── categoryRoutes.js
│   │   └── productRoutes.js
│   ├── db.js
│   └── index.js
├── API_DOCUMENTATION.md
├── Earthen_Strings_API.postman_collection.json
├── env.example
├── package.json
└── README.md
``` 