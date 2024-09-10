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
//get User Registers
app.get('/getUserRegisters', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('select TOP 20  * FROM [REGISTER_USER] ORDER BY 1 desc');
        res.json(result.recordset);  // Send data as JSON
    } catch (err) {
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});
//get Project Registers
app.get('/getProjectRegisters', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('select TOP 20  * FROM [REGISTER_PROJECT] ORDER BY 1 desc');
        res.json(result.recordset);  // Send data as JSON
    } catch (err) {
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});
//get Donation Registers
app.get('/getDonationRegisters', async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query('select TOP 20  * FROM [REGISTER_Donation] ORDER BY 1 desc');
        res.json(result.recordset);  // Send data as JSON
    } catch (err) {
        res.status(500).send('Error retrieving users: ' + err.message);
    }
});
//GetLastProjectID
app.get('/GetLastProjectID', async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query('SELECT MAX(ID) AS LastProjectID FROM PROJECT');
        
        if (result.recordset.length > 0) {
            // Envía el ID más grande de vuelta al cliente
            res.json({ LastProjectID: result.recordset[0].LastProjectID });
        } else {
            res.json({ LastProjectID: null });  // Si no hay proyectos, devolver null
        }
    } catch (err) {
        res.status(500).send('Error retrieving the last project ID: ' + err.message);
    }
});




// Endpoint para obtener los proyectos
app.get('/ProjectsInfo', async (req, res) => {

    try{
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM [PROJECT]');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving projects list: ' + err.message)
    }
    
});
//
app.post('/ProjectsCreatorInfo', async (req, res) => {
    const userID = req.body.userID;  // Obtener el userID desde el cuerpo de la solicitud

    try {
        await sql.connect(config);
        const query = 'SELECT * FROM [PROJECT] WHERE UserID = @UserID';
        
        const request = new sql.Request();
        request.input('UserID', sql.Int, userID);  // Inyectar el userID de manera segura

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving projects list: ' + err.message);
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
    console.log(req.body);
    const { UserID, Title, Description, ContributionGoal, Start, End, PrimaryContact, 
        SecondaryContact, DepositMethod, AccountNumber, Status, Collected} = req.body;
    try {
        await sql.connect(config);
        const query = `
            INSERT INTO [PROJECT] (UserID, Title, [Description], ContributionGoal, [Start], [End], PrimaryContact, 
            SecondaryContact, DepositMethod, AccountNumber, [Status], Collected)
            VALUES (@UserID, @Title, @Description, @ContributionGoal, @Start, @End, @PrimaryContact, 
        @SecondaryContact, @DepositMethod, @AccountNumber, @Status, @Collected)
        `;
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
        request.input('Collected', sql.Decimal, Collected);
        await request.query(query);
        res.json({ message: 'Project created successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});
// Add Donation / Crear Donation
app.post('/AddDonation', async (req, res) => {
    console.log(req.body);
    const { UserID, ProjectID, Ammount, Comment, Status, Date, Time} = req.body;
    try {
        await sql.connect(config);
        const query = `
            INSERT INTO [DONATION] (UserID, ProjectID, Ammount, Comment, [Status], Date, [Time])
            VALUES (@UserID, @ProjectID, @Ammount, @Comment, @Status, @Date, @Time)
        `;
        const request = new sql.Request();
        request.input('UserID', sql.Int, parseInt(UserID, 10));
        request.input('ProjectID', sql.Int, parseInt(ProjectID, 10));
        request.input('Ammount', sql.Decimal, Ammount);
        request.input('Comment', sql.NVarChar, Comment);
        request.input('Status', sql.Int, parseInt(Status,10));
        request.input('Date', sql.Date, Date);
        request.input('Time', sql.NVarChar, Time);
        await request.query(query);
        res.json({ message: 'Donatation created successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});

//Register User Activity
app.post('/AddRegisterUserActivity', async (req, res) => {
    console.log(req.body);
    const { UserID, Detail, Date, Times } = req.body;
    try {
        await sql.connect(config);
        const query = `
            INSERT INTO [REGISTER_USER] (UserID, Detail, Date, [Time])
            VALUES (@UserID, @Detail, @Date, @Times)
        `;
        const request = new sql.Request();
        request.input('UserID', sql.Int, parseInt(UserID, 10));
        request.input('Detail', sql.NVarChar, Detail);
        request.input('Date', sql.Date, Date);
        request.input('Times', sql.NVarChar, Times);
        await request.query(query);
        res.json({ message: 'Registered user activity successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});
//Register Project Activity
app.post('/AddRegisterProjectActivity', async (req, res) => {
    console.log(req.body);
    const { ProjectID, Detail, Date, Times } = req.body;
    
    try {
        await sql.connect(config);
        const query = `
            INSERT INTO [REGISTER_PROJECT] (ProjectID, Detail, Date, [Time])
            VALUES (@ProjectID, @Detail, @Date, @Times)
        `;
        const request = new sql.Request();
        request.input('ProjectID', sql.Int, parseInt(ProjectID, 10));
        request.input('Detail', sql.NVarChar, Detail);
        request.input('Date', sql.Date, Date);
        request.input('Times', sql.NVarChar, Times);
        await request.query(query);
        res.json({ message: 'Registered user activity successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

