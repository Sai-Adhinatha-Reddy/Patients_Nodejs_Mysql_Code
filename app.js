const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // You can change this password
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Create a table for patients if it doesn't exist
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    address TEXT,
    diagnosis TEXT
  );
`;

db.query(createTableQuery, (err, result) => {
  if (err) {
    console.error('Error creating table: ' + err.stack);
  } else {
    console.log('Table created or already exists.');
  }
});

// Endpoint to add a patient
app.post('/patients', (req, res) => {
  const { first_name, last_name, email, phone, address, diagnosis } = req.body;
  const query = 'INSERT INTO patients (first_name, last_name, email, phone, address, diagnosis) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [first_name, last_name, email, phone, address, diagnosis], (err, result) => {
    if (err) {
      return res.status(500).send('Error adding patient: ' + err.message);
    }
    res.status(201).send({ id: result.insertId, first_name, last_name, email, phone, address, diagnosis });
  });
});

// Endpoint to get all patients
app.get('/patients', (req, res) => {
  db.query('SELECT * FROM patients', (err, rows) => {
    if (err) {
      return res.status(500).send('Error retrieving patients: ' + err.message);
    }
    res.status(200).json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

