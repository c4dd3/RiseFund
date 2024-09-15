async function SignUp() {
    const name = document.getElementById("SignUpName").value;
    const last_name = document.getElementById("SignUpLastName").value;
    const email = document.getElementById("SignUpEmail").value;
    const password = document.getElementById("SignUpPassword").value;
    const confirm_password = document.getElementById("SignUpConfirmPassword").value;
    const terms = document.getElementById("SignUpTerms").checked;
    if (!validateFields(name, last_name, email, password, confirm_password, terms)) {
        console.log("Validation Failed");
        return;
    }

        const emailUnavailable = await verifyEmail(email);
        if (emailUnavailable) {
            console.log("Email already in use or invalid.");
            return;
        }
    await createUser(name, last_name, email, password);
    const uniqueUserID =  await getUserID(email, password);
    sessionStorage.setItem('userID', uniqueUserID);
    const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
    const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
    await createRegisterUser(uniqueUserID, 'New User '+ uniqueUserID + ' Signed Up' , currentDateCR, currentTimeCR.toString());
    console.log("Sign Up Successful");
    await sendConfirmation(email);
    window.location.href = 'MainMenu.html';
}

async function sendConfirmation(email) {
    // Obtener el correo electrónico del sessionStorage o de otra fuente
    const Email = email;
    if (!Email) {
        console.error('Email not found.');
        alert('Email is missing.');
        return;
    }
    try {
        const response = await fetch('/sendConfirmation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Email })  // Enviar el correo electrónico en el cuerpo de la solicitud
        });

        if (response.ok) {
            alert('Confirmation email sent successfully!');
        } else {
            alert('Failed to send the confirmation email.');
        }
    } catch (error) {
        console.error('Error sending the confirmation email:', error);
        alert('An error occurred while sending the confirmation email.');
    }
}

// Verifica si hay simboloes especiales dado un string
function contieneSimbolosEspeciales(str) {
    const regex = /[^a-zA-Z0-9 ]/;  
    return regex.test(str);  
}

// Verifica si hay numeros en un string dado
function contieneNumero(str) {
    const regex = /\d/;  
    return regex.test(str);  
}

function validateFields(name, last_name, email, password, confirm_password, terms) {
    if (!name || !last_name || !email || !password || !confirm_password) {
        alert("All fields are required.");
        return false;
    }

    if (contieneSimbolosEspeciales(name) || contieneSimbolosEspeciales(last_name) || contieneNumero(name) || contieneNumero(last_name)) {
        alert("The name or last name are invalid");
        return false;
    }

    if (password !== confirm_password) {
        alert("Passwords do not match.");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return false;
    }

    if (!email.includes('@') || !email.includes('estudiantec.cr')) {
        alert("Invalid email address. Must be from estudiantec.cr.");
        return false;
    }

    if (!terms) {
        alert("You must accept the terms and conditions.");
        return false;
    }

    return true;
}

async function verifyEmail(email) {
    try {
        const response = await fetch('/confirmEmail');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const result = await response.json();
        const emailFound = result.some(element => element.Email === email);
        return emailFound;
    } catch (error) {
        console.error('Error verifying email:', error);
        return false;
    }
}

async function createUser(name, last_name, email, password) {
    const userData = {
        firstName: name,
        lastName: last_name,
        email: email,
        password: password, 
        status: 1
    };
    try {
        const response = await fetch('/AddUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(userData)  
        });
        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.error);
        }
        const result = await response.json();  
        console.log('Response from server:', result);
    } catch (err) {
        console.error('Error creating user:', err.message);  
    }
}

async function createRegisterUser(UserID, Detail, Date, Times) {
    const UserRegisterData = {
        UserID:UserID,
        Detail:Detail,
        Date:Date,
        Times:Times,
    };
    try {
        const response = await fetch('/AddRegisterUserActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(UserRegisterData)  
        });
        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.error);
        }
        const result = await response.json();  
        console.log('Response from server:', result);
    } catch (err) {
        console.error('Error creating user:', err.message);  
    }
}

async function getUserID(email, password) {
    try {
        const response = await fetch('/confirmEmail');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const result = await response.json();

        // Busca el usuario que coincida con el email y la contraseña
        const user = result.find(element => element.Email === email && element.UserPassword === password);

        if (user) {
            return user.ID;  // Devuelve el ID del usuario
        } else {
            return null;  // Si no se encuentra el usuario, devuelve null
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;  // Si hay un error, también devuelve null
    }
}