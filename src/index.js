require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

// Import routes
const indexRoutes = require("./routes/index");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
    res.send("Earthen Strings API is live!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});