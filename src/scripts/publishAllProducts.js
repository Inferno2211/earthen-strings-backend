const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const connectDB = require('../db');
const Product = require('../models/Product');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
	try {
		await connectDB();
		const result = await Product.updateMany({}, { $set: { published: true } });
		console.log(`Published ${result.modifiedCount || 0} products.`);
		await mongoose.connection.close();
		process.exit(0);
	} catch (err) {
		console.error(err);
		await mongoose.connection.close();
		process.exit(1);
	}
}

run(); 