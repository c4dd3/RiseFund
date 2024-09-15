async function Login(){
    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;
    const emailFound = await confirmEmail(email);
    const correctPassword = await confirmPassword(email, password);

    if (email.value == '' || password == ''){
        alert("Please fill in all the information");
        return;
    }

    if(emailFound && correctPassword ){
        console.log("Granted");
        const uniqueUserID =  await getUserID(email, password);
        sessionStorage.setItem('userID', uniqueUserID);
        const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
        const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
        createRegisterUser(uniqueUserID, 'User '+ uniqueUserID + ' Logged In' , currentDateCR, currentTimeCR.toString());
        window.location.href = 'MainMenu.html'; 
    } else {
        alert("Incorrect password or email, please try again")
        return;
    }
}

async function confirmEmail(email) {
    try {
        const response = await fetch('/confirmEmail');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const result = await response.json();
        const emailFound = result.some(element => element.Email === email);
        return emailFound;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function confirmPassword(email, password) {
    try {
        const response = await fetch('/confirmEmail');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const result = await response.json();
        const correctPassword = result.some(element => element.Email === email && element.UserPassword === password);
        return correctPassword;
    } catch (error) {
        console.error('Error fetching passwords:', error);
    }
}

async function confirmStatus(email, password) {
    try {
        const response = 

    }
}

async function guardarUsuario() {
    const email = 'usuario@example.com';  // Email del usuario
    const password = 'password123';       // Contraseña del usuario

    const userID = await getUserID(email, password);  // Obtenemos el ID del usuario

    if (userID) {
        // Guardar el ID en Session Storage
        sessionStorage.setItem('userID', userID);
        alert("Usuario guardado: " + userID);
        // Redirigir a la Página 2
        window.location.href = 'pagina2.html';
    } else {
        alert('Credenciales incorrectas o usuario no encontrado.');
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

