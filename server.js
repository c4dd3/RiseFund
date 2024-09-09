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

// Middleware para procesar cuerpos de solicitudes JSON
app.use(express.json());

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

//AddUser
app.post('/AddUser', async (req, res) => {
    console.log(req.body);
    const { firstName, lastName, email, password, status } = req.body;  // Desestructuración de los datos recibidos
    
    try {
        await sql.connect(config);

        // Consulta SQL para insertar el nuevo usuario
        const query = `
            INSERT INTO [USER] (FirstName, LastName, Email, UserPassword, Status)
            VALUES (@FirstName, @LastName, @Email, @UserPassword, @Status)
        `;

        // Prepara e inyecta los valores de manera segura
        const request = new sql.Request();
        request.input('FirstName', sql.NVarChar, firstName);
        request.input('LastName', sql.NVarChar, lastName);
        request.input('Email', sql.NVarChar, email);
        request.input('UserPassword', sql.NVarChar, password);
        request.input('Status', sql.Bit, parseInt(status, 10));  // Convierte el status a entero y luego a bit
        
        await request.query(query);

        res.json({ message: 'User created successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//AddProject
app.post('/AddProject', async (req, res) => {
    console.log(req.body);  // Muestra el cuerpo de la solicitud en la consola para verificar el contenido
    
    const { UserID, Title, Description, ContributionGoal, Start, End, PrimaryContact, 
        SecondaryContact, DepositMethod, AccountNumber, Status} = req.body;  // Desestructuración de los datos recibidos
    
    try {
        await sql.connect(config);


        const query = `
            INSERT INTO [PROJECT] (UserID, Title, [Description], ContributionGoal, [Start], [End], PrimaryContact, 
            SecondaryContact, DepositMethod, AccountNumber, [Status])
            VALUES (@UserID, @Title, @Description, @ContributionGoal, @Start, @End, @PrimaryContact, 
        @SecondaryContact, @DepositMethod, @AccountNumber, @Status)
        `;

        // Prepara e inyecta los valores de manera segura
        const request = new sql.Request();
        request.input('UserID', sql.Int, parseInt(UserID, 10));
        request.input('Title', sql.NVarChar, Title);
        request.input('Description', sql.NVarChar, Description);
        request.input('ContributionGoal', sql.Decimal, ContributionGoal);
        request.input('Start', sql.Date, Start);
        request.input('End', sql.Date, End);
        request.input('PrimaryContact', sql.NVarChar, PrimaryContact);
        request.input('SecondaryContact', sql.NVarChar, SecondaryContact);
        request.input('DepositMethod', sql.NVarChar, DepositMethod);
        request.input('AccountNumber', sql.NVarChar, AccountNumber);
        request.input('Status', sql.Int, parseInt(Status,10));
        
        await request.query(query);

        res.json({ message: 'Project created successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});