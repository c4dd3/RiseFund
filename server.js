const express = require('express');
const sql = require('mssql');
const path = require('path');
const app = express();
const port = 3000;
const nodemailer = require('nodemailer');
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
//GetDonationID
app.post('/GetDonationID', async (req, res) => {
    const { UserID, ProjectID, Date, Time } = req.body; // Obtenemos los parámetros de la solicitud

    try {
        // Conexión a la base de datos
        await sql.connect(config);

        // Preparar y ejecutar la consulta
        const request = new sql.Request();
        request.input('UserID', sql.Int, UserID);
        request.input('ProjectID', sql.Int, ProjectID);
        request.input('Date', sql.Date, Date);
        request.input('Time', sql.NVarChar, Time);

        const result = await request.query(`
            SELECT ID FROM DONATION
            WHERE 
            UserID = @UserID
            AND ProjectID = @ProjectID
            AND Date = @Date
            AND Time = @Time;
        `);

        // Si se encuentra una donación, devolver la ID
        if (result.recordset.length > 0) {
            res.json({ DonationID: result.recordset[0].ID });
        } else {
            res.status(404).json({ message: 'Donation not found' });
        }

    } catch (err) {
        res.status(500).send('Error retrieving donation ID: ' + err.message);
    }
});
//GetUserByID
app.post('/GetUserByID', async (req, res) => {
    const { UserID } = req.body;  // Obtenemos el ID del usuario desde los parámetros de consulta
    try {
        // Conexión a la base de datos
        await sql.connect(config);
        console.log(UserID);
        // Preparar la consulta SELECT
        const request = new sql.Request();
        const query = `
            SELECT * FROM [USER] WHERE ID = @ID;
        `;
        request.input('ID', sql.Int, UserID);
        const result = await request.query(query);
        console.log(result);
        // Si se encuentra un usuario, devolver los datos
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).send('Error retrieving user: ' + err.message);
    }
});
//GetUserList
app.get('/GetUserList', async (req, res) => {
    try {
        await sql.connect(config);
        const query = `
            SELECT [ID], [FirstName], [LastName], [Email], 
            CASE [Status] WHEN 1 THEN 'Active' ELSE 'Blocked' END AS [STATUS] FROM [USER]
        `;
        const result = await sql.query(query);
        console.log(result);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving user list: ' + err.message);
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
    const { UserID, Title, Description, ContributionGoal, Start, End, PrimaryContact, 
        SecondaryContact, DepositMethod, AccountNumber, Status, Collected} = req.body;
    try {
        await sql.connect(config);
        const query = `
            INSERT INTO [PROJECT] (UserID, Title, [Description], ContributionGoal, [Start], [End], PrimaryContact, 
            SecondaryContact, DepositMethod, AccountNumber, [Status], Collected)
            VALUES (@UserID, @Title, @Description, @ContributionGoal, @Start, @End, @PrimaryContact, 
        @SecondaryContact, @DepositMethod, @AccountNumber, @Status, 0)
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
//EditProject
app.post('/EditProject', async (req, res) => {
    const { projectID, Title, Description, ContributionGoal, Start, End, PrimaryContact, 
        SecondaryContact, DepositMethod, AccountNumber, Status} = req.body;
    try {
        await sql.connect(config);
        const query = `
            UPDATE [PROJECT] SET 
                Title = @Title, 
                [Description] = @Description, 
                ContributionGoal = @ContributionGoal, 
                [Start] = @Start, 
                [End] = @End, 
                PrimaryContact=@PrimaryContact, 
                SecondaryContact=@SecondaryContact, 
                DepositMethod=@DepositMethod, 
                AccountNumber=@AccountNumber, 
                [Status]=@Status
            WHERE [PROJECT].ID = @projectID 
        `;
        const request = new sql.Request();
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
        request.input('projectID', sql.Int, parseInt(projectID, 10));
        await request.query(query);
        res.json({ message: 'Project Edited successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'risefund1@gmail.com',
        pass: 'fmhs exmd eqyn twfp' 
    }
});

// Add Donation / Crear Donation
app.post('/AddDonation', async (req, res) => {
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

        const queryEmail = `
            SELECT Email FROM [USER] WHERE ID = @UserID
        `;
        const emailRequest = new sql.Request();
        emailRequest.input('UserID', sql.Int, parseInt(UserID, 10));

        const result = await emailRequest.query(queryEmail);
        const userEmail = result.recordset[0].Email;  
        if (!result.recordset.length) {
            return res.status(404).send('Usuario no encontrado');
        }
        const mailOptions = {
            from: 'risefund1@gmail.com',   
            to: userEmail,                 
            subject: 'Confirmación de donación',  
            text: `Gracias por tu donación de $${Ammount} al proyecto ${ProjectID}. Tu comentario fue: "${Comment}".`  // Cuerpo del correo
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send('Error al enviar el correo: ' + error.toString());
            }
            console.log('Correo enviado: ' + info.response);
            res.json({ message: 'Donación creada y correo enviado exitosamente!' });
        });
        
    } catch (err) {
        console.error('Error al crear la donación:', err);
        res.status(500).json({ message: 'Error creating donation', error: err.message });
    }
});

//Register User Activity
app.post('/AddRegisterUserActivity', async (req, res) => {
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
        res.json({ message: 'Registered User activity successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});
//Register Project Activity
app.post('/AddRegisterProjectActivity', async (req, res) => {
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
        res.json({ message: 'Registered Project activity successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});
//Register Donation Activity
app.post('/AddRegisterDonationActivity', async (req, res) => {
    const { DonationID, Detail, Date, Times } = req.body;
    
    try {
        await sql.connect(config);
        const query = `
            INSERT INTO [REGISTER_DONATION] (DonationID, Detail, Date, [Time])
            VALUES (@DonationID, @Detail, @Date, @Times)
        `;
        const request = new sql.Request();
        request.input('DonationID', sql.Int, parseInt(DonationID, 10));
        request.input('Detail', sql.NVarChar, Detail);
        request.input('Date', sql.Date, Date);
        request.input('Times', sql.NVarChar, Times);
        await request.query(query);
        res.json({ message: 'Registered Donation activity successfully!' });
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Search of Project by ID
app.post('/ProjectById', async (req, res) => {
    const projectID = req.body.projectID;  

    try {
        await sql.connect(config);
        const query = 'SELECT * FROM [PROJECT] INNER JOIN [USER] ON [PROJECT].UserID = [USER].ID WHERE [PROJECT].ID = @ProjectID';
        
        const request = new sql.Request();
        request.input('ProjectID', sql.Int, projectID);
        const result = await request.query(query);

        
        if (result.recordset.length === 0) {
            return res.status(404).send('Project not found');
        }

        
        res.json(result.recordset[0]);
    } catch (err) {
        
        res.status(500).send('Error getting project: ' + err.message);
    }
});

// Searches for the People of the project
app.post('/SearchDonatedPeople', async(req, res) => {
    const projectID = req.body.projectID;

    try{
        await sql.connect(config);
        const query = `SELECT PROJECT.ID, ISNULL(COUNT([DONATION].ProjectID), 0) DONANTES FROM [PROJECT] LEFT JOIN [DONATION] ON [PROJECT].ID = [DONATION].ProjectID 
        WHERE [PROJECT].ID = @ProjectID
        Group By [PROJECT].ID;`
        
        const request = new sql.Request();
        request.input('ProjectID', sql.Int, projectID);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('Author not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send('Error when searching for project author:')
    }
});

//Search bank account
app.post('/ExpirationDate', async(req, res) => {
    const projectID = req.body.projectID;
    try{
        await sql.connect(config);
        const query = `SELECT * FROM [PROJECT] INNER JOIN [USER] ON [PROJECT].UserID = [USER].ID
        LEFT JOIN [BANK_ACCOUNT] ON [BANK_ACCOUNT].UserID = [USER].ID WHERE [PROJECT].ID = @ProjectID`
        
        const request = new sql.Request();
        request.input('ProjectID', sql.Int, projectID);
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).send('Author not found');
        }

        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send('Error when searching for project author:')
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


//GetProjectByID
app.post('/GetProjectByID', async (req, res) => {
    const { projectID } = req.body; 
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT [P].[ID], [P].[UserID], [P].[Description], 
            ISNULL(([P].[Collected] / NULLIF([P].[ContributionGoal], 0)) * 100, 0) AS [Progress], 
            [P].[Collected], ISNULL(COUNT(DISTINCT [D].[ID]), 0) AS [Contributors], [P].Status
            FROM [PROJECT] [P]
            LEFT JOIN [DONATION] [D] ON [P].[ID] = [D].[ProjectID]
            WHERE [P].[ID] = @ID
            GROUP BY [P].[ID], [P].[UserID], [P].[Description], [P].[Collected], [P].[ContributionGoal], [P].[Status]

        `;
        request.input('ID', sql.Int, projectID);
        const result = await request.query(query);
        if (result.recordset.length > 0) {
            res.json({ success: true, project: result.recordset[0] });
        } else {
            res.json({ success: false, message: 'Project not found. Please try another project ID.' });
        }
    } catch (err) {
        console.error('Error retrieving project:', err.message);
        res.json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
    }
});
        

//GetProjectList
app.get('/GetProjectList', async (req, res) => {
    try {
        await sql.connect(config);
        const query = `
            SELECT [P].[ID], [P].[UserID], [P].[Description], 
            ISNULL(([P].[Collected] / NULLIF([P].[ContributionGoal], 0)) * 100, 0) AS [Progress], 
            [P].[Collected], ISNULL(COUNT(DISTINCT [D].[ID]), 0) AS [Contributors],
            CASE 
                WHEN [P].[Status] = 1 THEN 'Active' 
                WHEN [P].[Status] = 2 THEN 'Finished'
                WHEN [P].[Status] = 3 THEN 'Blocked' END AS [STATUS] 
            FROM [PROJECT] [P] 
            LEFT JOIN [DONATION] [D] ON [P].[ID] = [D].[ProjectID]
            GROUP BY [P].[ID], [P].[UserID], [P].[Description], [P].[Collected], [P].[ContributionGoal], [P].[Status]
        `;
        const result = await sql.query(query);
        //console.log(result);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving uproject list: ' + err.message);
    }
});

//UpdateProjectStatus
app.post('/UpdateProjectStatus', async (req, res) => {
    const { projectID, status} = req.body;
    try {
        await sql.connect(config);
        const query = `
            UPDATE [PROJECT] SET 
                [Status]=@Status
            WHERE [PROJECT].ID = @projectID 
        `;
        const request = new sql.Request();
        request.input('Status', sql.Int, parseInt(status,10));
        request.input('projectID', sql.Int, parseInt(projectID, 10));
        const result = await request.query(query);
        if (result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'Project Edited successfully!' });
        } else {
            res.json({ success: false, message: 'Project not found' });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

//UpdateUserStatus

app.post('/UpdateUserStatus', async (req, res) => {
    const { UserID, Status} = req.body;
    try {
        await sql.connect(config);
        const query = `
            UPDATE [USER] SET 
                [Status]=@Status
            WHERE [USER].ID = @UserID 
        `;
        const request = new sql.Request();
        request.input('Status', sql.Bit, parseInt(Status,10));
        request.input('UserID', sql.Int, parseInt(UserID, 10));
        const result = await request.query(query);
        if (result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'User Edited successfully!' });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});


//GetDonationList
app.get('/GetDonationList', async (req, res) => {
    try {
        await sql.connect(config);
        const query = `
            SELECT [D].[ID], [D].[Date], [D].[ProjectID], [D].[Ammount], [D].[UserID]
            FROM [DONATION] [D]
        `;
        const result = await sql.query(query);
        const formattedResult = result.recordset.map(donation => {
            return {
                ...donation,
                Date: new Date(donation.Date).toISOString().split('T')[0] // Formateo de la fecha
            };
        });

        res.json(formattedResult);
    } catch (err) {
        res.status(500).send('Error retrieving donation list: ' + err.message);
    }
});

//Confirm bank account number is users
app.get('/GetBankAccountList', async (req, res) => {
    try {
        await sql.connect(config);
        const query = `
            SELECT * FROM [BANK_ACCOUNT] 
        `;
        const result = await sql.query(query);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error retrieving accounts list: ' + err.message);
    }
});

//GetDonationByID
app.post('/GetDonationByID', async (req, res) => {
    const { donationID } = req.body; 
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT [D].[ID], [D].[Ammount], [D].[UserID], [D].[ProjectID], [D].[Comment] , [D].[STATUS]
            FROM [DONATION] [D] 
            WHERE ID = @ID
        `;
        request.input('ID', sql.Int, donationID);
        const result = await request.query(query);
        if (result.recordset.length > 0) {
            res.json({ success: true, donation: result.recordset[0] });
        } else {
            res.json({ success: false, message: 'Donation not found. Please try another donation ID.' });
        }
    } catch (err) {
        console.error('Error retrieving donation:', err.message);
        res.json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
    }
});

// Obtener la cantidad de Projects
app.post('/GetTotalProjects', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT COUNT(*) AS totalProjects FROM [PROJECT]            
        `;
        const result = await request.query(query);
        res.json({ totalProjects: result.recordset[0].totalProjects }); // Corregido el nombre
    } catch (err) {
        console.error('Error at retrieving project stats', err.message);
        res.status(500).send('Error retrieving project stats');
    }
});

// Obtener la cantidad de Users
app.post('/GetTotalUsers', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT COUNT(*) AS totalUsers FROM [USER]         
        `;
        const result = await request.query(query);
        res.json({ totalUsers: result.recordset[0].totalUsers }); // Corregido el nombre
    } catch (err) {
        console.error('Error at retrieving users stats', err.message);
        res.status(500).send('Error retrieving users stats');
    }
});

// Obtener la cantidad de dinero donado
app.post('/GetTotalRaised', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT ISNULL(SUM(Ammount),0) AS sumaTotal FROM [DONATION] WHERE [DONATION].Status = 1      
        `;
        const result = await request.query(query);
        res.json({ sumaTotal: result.recordset[0].sumaTotal }); // Corregido el nombre
    } catch (err) {
        console.error('Error at retrieving donation stats', err.message);
        res.status(500).send('Error retrieving donation stats');
    }
});

//Change Donation Status
app.post('/ChangeDonationStatus', async (req, res) => {
    const {DonationID, Status} = req.body;
    try {
        await sql.connect(config);
        const query = `
            UPDATE [DONATION] SET 
                [Status]=@Status
            WHERE [DONATION].ID = @DonationID 
        `;
        const request = new sql.Request();
        request.input('Status', sql.Bit, parseInt(Status,10));
        request.input('DonationID', sql.Int, parseInt(DonationID, 10));
        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'Donation Status Edited successfully!' });
        } else {
            res.json({ success: false, message: 'Donation not found' });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});



//Delete Donation
app.post('/DeleteDonation', async (req, res) => {
    const { DonationID} = req.body;
    try {
        await sql.connect(config);
        const query = `
            DELETE FROM [DONATION] 
            WHERE [DONATION].ID = @DonationID 
        `;
        const request = new sql.Request();
        request.input('DonationID', sql.Int, parseInt(DonationID, 10));
        const result = await request.query(query);

        if (result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'Donation Deleted successfully!' });
        } else {
            res.json({ success: false, message: 'Donation not found' });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});


//UpdateProjectCollected
app.post('/UpdateProjectCollected', async (req, res) => {
    const { ProjectID, Collected} = req.body;
    try {
        await sql.connect(config);
        const query = `
            UPDATE [PROJECT] SET 
                [Collected]=@Collected
            WHERE [PROJECT].ID = @projectID 
        `;
        const request = new sql.Request();
        request.input('Collected', sql.Int, parseInt(Collected,10));
        request.input('projectID', sql.Int, parseInt(ProjectID, 10));
        const result = await request.query(query);
        if (result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'Project Edited successfully!' });
        } else {
            res.json({ success: false, message: 'Project not found' });
        }
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
});

// Obtiene la info de la donacion por ID
app.post('/GetDonationDataByID', async (req, res) => {
    const { donationID } = req.body; 
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT [D].Ammount AS DonationAmount, [D].ProjectID AS ProjectID, [P].Collected AS ProjectCollected
            FROM [DONATION] [D]
            INNER JOIN [PROJECT] [P] ON [D].ProjectID = [P].ID
            WHERE [D].ID = @ID
        `;
        request.input('ID', sql.Int, parseInt(donationID));
        const result = await request.query(query);
        if (result.recordset.length > 0) {
            res.json({ success: true, donation: result.recordset[0] });
        } else {
            res.json({ success: false, message: 'Donation not found. Please try another donation ID.' });
        }
    } catch (err) {
        console.error('Error retrieving donation:', err.message);
        res.json({ success: false, message: 'Donation error.' });
    }
});

