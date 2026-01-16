const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
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

// Route to ADD new food (Used by Admin Panel)
app.post('/add-food', async (req, res) => {
    const { name, price, image } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO foods (name, price, image) VALUES ($1, $2, $3) RETURNING *',
            [name, price, image]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
    }
});

// --- THEME SCHEDULER SETUP ---

// Create Table Script (Auto-run)
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS theme_schedules (
        id SERIAL PRIMARY KEY,
        theme_name VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

pool.query(createTableQuery)
    .then(() => console.log("✅ Theme Schedules Table Ready"))
    .catch(err => console.error("❌ Table Error", err));

// 1. Schedule a Theme
app.post('/schedule-theme', async (req, res) => {
    const { themeName, startDate, endDate } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO theme_schedules (theme_name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *',
            [themeName, startDate, endDate]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
    }
});

// 2. Get Current Theme (Based on Date)
app.get('/current-theme', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT theme_name FROM theme_schedules WHERE CURRENT_DATE BETWEEN start_date AND end_date ORDER BY created_at DESC LIMIT 1"
        );

        if (result.rows.length > 0) {
            res.json({ theme: result.rows[0].theme_name });
        } else {
            res.json({ theme: 'Default' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database Error" });
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