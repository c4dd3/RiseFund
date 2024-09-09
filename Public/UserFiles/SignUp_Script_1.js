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
    createUser(name, last_name, email, password)
    console.log("Sign Up Successful");
    window.location.href = 'MainMenu.html';
}

function validateFields(name, last_name, email, password, confirm_password, terms) {
    if (!name || !last_name || !email || !password || !confirm_password) {
        alert("All fields are required.");
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