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

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bite Express Backend!' });
});

// --- API Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bite Express Backend!' });
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM restaurants ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// NEW: An endpoint to get the menu for a specific restaurant
app.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const { id } = req.params; // Get the restaurant ID from the URL
    const { rows } = await pool.query('SELECT * FROM menu_items WHERE restaurant_id = $1', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Menu not found for this restaurant.' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});