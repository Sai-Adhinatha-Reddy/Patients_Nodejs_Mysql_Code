const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

let db;
let isFirstAttempt = true;

function connectDB() {
  db = mysql.createConnection(dbConfig);

  // 👇 Attach the error handler IMMEDIATELY
  db.on('error', (err) => {
    console.error('MySQL connection error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
      console.log('Reconnecting to MySQL...');
      connectDB(); // Reconnect
    } else {
      throw err; // Crash only if unexpected
    }
  });

  const tryConnect = () => {
    db.connect(err => {
      if (err) {
        console.error('Database connection failed:', err.stack);
        console.log('Retrying connection immediately...');
        connectDB(); // Retry immediately
        return;
      }

      console.log('Connected to MySQL.');
      createTable(db);
    });
  };

  if (isFirstAttempt) {
    console.log('Waiting 15 seconds before first database connection...');
    isFirstAttempt = false;
    setTimeout(tryConnect, 15000);
  } else {
    tryConnect();
  }
}

function createTable(connection) {
  connection.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      address TEXT,
      diagnosis TEXT
    )
  `);
}

connectDB();

app.post('/patients', (req, res) => {
  const { first_name, last_name, email, phone, address, diagnosis } = req.body;
  const sql = 'INSERT INTO patients (first_name, last_name, email, phone, address, diagnosis) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [first_name, last_name, email, phone, address, diagnosis], (err, results) => {
    if (err) {
      console.error('Error saving patient data:', err);
      return res.status(500).send(err);
    }
    res.status(201).send({ message: 'Patient data saved', id: results.insertId });
  });
});

app.get('/patients', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

