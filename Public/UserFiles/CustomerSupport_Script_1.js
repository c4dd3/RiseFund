function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

function toggleFAQ(button) {
    const answer = button.parentElement.nextElementSibling;
    const isAnswerVisible = answer.style.display === "block";
    
    if (isAnswerVisible) {
        answer.style.display = "none";
        button.innerText = "+";
    } else {
        answer.style.display = "block";
        button.innerText = "-";
    }
}


async function sendQuestion() {
    const name = document.getElementById('name').value.trim();
    const question = document.getElementById('inquiry').value.trim();
    const UserID = sessionStorage.getItem('userID');

    if (!name || !question) {
        alert('Please, fill in all the spaces');
        return;
    }

    try {
        const response = await fetch('/sendQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, question, UserID })
        });

        if (response.ok) {
            alert('Question sent successfully!');
        } else {
            alert('Failed to send the question.');
        }
    } catch (error) {
        console.error('Error sending the question:', error);
        alert('An error occurred while sending your question.');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const adminLink = document.getElementById('adminLink');
        adminLink.addEventListener('click', (event) => {
            verifyAdminUser();
        });
    } catch (error) {
        console.error('Error at loading element:', error);
    }
});


async function verifyAdminUser() {
    const UserID = sessionStorage.getItem('userID');
    const isUserAdmin = await checkIfUserIsAdmin(UserID);
    if(isUserAdmin){
        window.location.href = "../AdminFiles/AdministratorMenu.html";
    } else {
        alert('You do not have admin privileges');
    }
}

async function checkIfUserIsAdmin(userID) {
    try {
        const response = await fetch('/GetAdminList');
        
        if (!response.ok) {
            throw new Error('Error al obtener la lista de administradores');
        }

        const admins = await response.json();
        console.log(admins);
        const isAdmin = admins.some(admin => admin.UserID == userID);
        
        if (isAdmin) {
            console.log(`El usuario con ID ${userID} es administrador.`);
        } else {
            console.log(`El usuario con ID ${userID} no es administrador.`);
        }
        
        return isAdmin;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}