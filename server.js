/*
app.get('/function name', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM [TABLE]');
        res.json(result.recordset);  // Send data as JSON
    } catch (err) {
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});

*/


const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
const port = 3000;

// Database configuration
const config = {
    user: 'sa',
    password: '12344',
    server: 'DESKTOP-NMGCV0N\\SQLExpress',
    database: 'RiseFund', 
    options: {
        encrypt: true, 
        trustServerCertificate: true  
    }
};

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to test database connection
app.get('/test-connection', async (req, res) => {
    try {
        await sql.connect(config);
        res.send('Database connection successful!');
    } catch (err) {
        res.status(500).send('Database connection failed: ' + err.message);
    }
});

// Route to get list of users
app.get('/users', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM [USER]');
        res.json(result.recordset);  // Send data as JSON
    } catch (err) {
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});

//ConfirmExistingEmail
app.get('/confirmEmail', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM [USER]');
        res.json(result.recordset);  // Send data as JSON
    } catch (err) {
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});