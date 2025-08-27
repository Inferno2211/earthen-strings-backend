const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('../db');
const Product = require('../models/Product');
const Category = require('../models/Category');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Price mapping by category name
const PRICE_MAPPING = {
    // "All Products": 200,
    "Calendars": 450,
    "Coasters": 600,
    "Magnets": 150,
    "Notebooks": 180,
    "Tealights": 750,
    "Tissue Boxes": 1000,
    "Trays": 1600,
    "Trinket Boxes": 1200,
    "Wallplates": 1500
};

async function updatePricesByCategory() {
    try {
        await connectDB();
        console.log('Connected to database');

        // Get all categories
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories`);

        let totalUpdated = 0;
        let categoryStats = {};

        // Process each category
        for (const category of categories) {
            const categoryName = category.name;
            const price = PRICE_MAPPING[categoryName];

            if (!price) {
                console.log(`No price mapping found for category: ${categoryName}`);
                continue;
            }

            // Find products in this category with null or 0 prices
            const productsToUpdate = await Product.find({
                category: category._id,
                $or: [
                    { price: { $exists: false } },
                    { price: null },
                    { price: 0 }
                ]
            });

            if (productsToUpdate.length === 0) {
                console.log(`No products with null/0 prices found in category: ${categoryName}`);
                continue;
            }

            // Update prices for products in this category
            const result = await Product.updateMany(
                {
                    category: category._id,
                    $or: [
                        { price: { $exists: false } },
                        { price: null },
                        { price: 0 }
                    ]
                },
                { $set: { price: price } }
            );

            const updatedCount = result.modifiedCount || 0;
            totalUpdated += updatedCount;
            categoryStats[categoryName] = updatedCount;

            console.log(`Updated ${updatedCount} products in category "${categoryName}" with price ${price}`);
        }

        // Print summary
        console.log('\n=== SUMMARY ===');
        console.log(`Total products updated: ${totalUpdated}`);
        console.log('\nUpdates by category:');
        Object.entries(categoryStats).forEach(([category, count]) => {
            if (count > 0) {
                console.log(`  ${category}: ${count} products (price: ${PRICE_MAPPING[category]})`);
            }
        });

        // List categories that exist but weren't updated
        const categoriesWithNoUpdates = categories
            .map(cat => cat.name)
            .filter(name => !categoryStats[name] && PRICE_MAPPING[name]);
        
        if (categoriesWithNoUpdates.length > 0) {
            console.log('\nCategories with no products to update:');
            categoriesWithNoUpdates.forEach(name => {
                console.log(`  ${name}: No products with null/0 prices found`);
            });
        }

        // List categories that don't exist in the database
        const missingCategories = Object.keys(PRICE_MAPPING).filter(
            name => !categories.find(cat => cat.name === name)
        );

        if (missingCategories.length > 0) {
            console.log('\nCategories not found in database:');
            missingCategories.forEach(name => {
                console.log(`  ${name}: Category does not exist`);
            });
        }

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
        process.exit(0);

    } catch (err) {
        console.error('Error updating prices:', err);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run the script
updatePricesByCategory(); 