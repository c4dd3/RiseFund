const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000; // or any port you prefer

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like HTML, CSS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


app.post('/signup', (req, res) => {
    const { name, last_name, email, password, confirm_password, terms } = req.body;

    if (!name || !last_name || !email || !password || !confirm_password) {
        return res.status(400).send('All fields are required.');
    }

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match.');
    }

    if (!terms) {
        return res.status(400).send('You must accept the terms and conditions.');
    }

    // Normally, you would save the data to a database here





    res.redirect('/MainMenu.html'); 
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
