// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const { Pool } = require('pg'); // Import the PostgreSQL client

// --- Database Connection ---
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Successfully connected to the database.');
  }
});


// --- Server Setup ---
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes ---

// Basic root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bite Express Backend!' });
});

// An endpoint to get all restaurants with data formatted for the frontend
app.get('/api/restaurants', async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        name, 
        cuisine, 
        image_url AS image, 
        rating, 
        delivery_time AS "deliveryTime"
      FROM restaurants 
      ORDER BY id
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    // UPDATED: More detailed error logging
    console.error('Error executing query for /api/restaurants:', err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// An endpoint to get the menu for a specific restaurant
app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        id, 
        restaurant_id, 
        name, 
        description, 
        price, 
        image_url AS image 
      FROM menu_items 
      WHERE restaurant_id = $1
    `;
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Menu not found for this restaurant.' });
    }

    res.json(rows);
  } catch (err) {
    // UPDATED: More detailed error logging
    console.error(`Error executing query for /api/restaurants/${req.params.id}/menu:`, err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
