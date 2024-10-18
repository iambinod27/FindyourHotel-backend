const express = require("express");
const app = express();
const port = 4000;

app.listen(port, () => {
    console.log(`server up and running at ${port}`);
});

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth/auth");

dotenv.config();

// DATABASE CONNECTION
try {
    mongoose.connect(process.env.DB_CONNECT);
    console.log("DB connected successfully");
} catch (error) {
    console.log("error:", error);
}

// MIDDLEWARE -> DISABLING CORS AND USED FOR JSON OUTPUT
app.use(express.json(), cors());

// ROUTE MIDDLEWARE
app.use("/api/users", authRoutes);