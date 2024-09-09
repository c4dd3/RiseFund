async function Login(){
    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;
    const emailFound = await confirmEmail(email);
    const correctPassword = await confirmPassword(email, password);
    if(emailFound && correctPassword ){
        console.log("Granted");
        window.location.href = 'MainMenu.html';
    } else {
        console.log("Denied");
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

