const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
// ⚠️ IMPORTANT: Replace [YOUR-PASSWORD] with your real password!
// Note: I removed '?sslmode=require' from the string to let the config object handle it.
const connectionString = "postgresql://postgres.jdghhicyhoqdiqsuqyfn:Zikr%4023408786@aws-1-ap-south-1.pooler.supabase.com:6543/postgres";

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false // <--- THIS FIXES THE CERTIFICATE ERROR
    }
});

// 2. API ROUTES

// Test Route
app.get('/', (req, res) => {
    res.send("✅ Backend is working!");
});

// Get all food items
app.get('/foods', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM foods');
        res.json(result.rows);
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Place an order
app.post('/order', async (req, res) => {
    const { foodId } = req.body;
    console.log(`Order received for Food ID: ${foodId}`);
    res.json({ message: "Order Success" });
});

// 3. START SERVER
app.listen(3000, '0.0.0.0', () => {
    console.log("✅ Postgres Backend running on Port 3000");
});