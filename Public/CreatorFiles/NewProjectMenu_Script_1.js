function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

async function isOfUser(accountNumber, UserID) {
    try {
        const response = await fetch('/GetBankAccountList', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const accounts = await response.json();
        const account = accounts.find(account => account.AccountNumer === accountNumber && account.UserID === parseInt(UserID));
        return account !== undefined;
    } catch (error) {
        console.error('Error fetching account list:', error);
        return false;
    }
}

async function showConfirmation() {
    const projectTitle = document.getElementById("project-title").value;
    const projectID = document.getElementById("project-id").value;
    const startDate = document.getElementById("start-date").value;
    const goal = document.getElementById("goal").value;
    const completionDate = document.getElementById("completion-date").value;
    const status = document.getElementById("status").value;
    const contact = document.getElementById("contact").value;
    const depositMethod = document.getElementById("deposit-method").value;
    const accountNumber = document.getElementById("account-number").value;
    const description = document.getElementById("description").value;
    const userID = sessionStorage.getItem('userID');
    const accountOwnership = await isOfUser(accountNumber, userID);

    if (!goal || !contact || !accountNumber) {
        alert("Please fill in all the required fields before confirming.");
        return;
    }

    const confirmed = confirm(`
    Please verify the project details:
    - Project Title ${projectTitle}
    - Project ID: ${projectID}
    - Start Date: ${startDate}
    - Contribution Goal: ${goal}
    - Expected Completion: ${completionDate}
    - Status: ${status}
    - Project Contact: ${contact}
    - Deposit Method: ${depositMethod}
    - Account Number: ${accountNumber}

    Confirm project creation?`);

    if (confirmed) {
        if (accountOwnership){
            createProject(projectTitle, description, goal, startDate, completionDate, 
                contact, depositMethod, accountNumber);
            const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
            const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
            const userID = sessionStorage.getItem('userID'); 
            createRegisterProject(projectID, 'New Project by user '+userID.toString()+' has been created', currentDateCR, currentTimeCR);
            alert("Project Created!");
        } else {
            alert("Account number does not exist or is not yours");
        }
        
    }
}

async function createRegisterProject(ProjectID, Detail, Date, Times) {
    const ProjectRegisterData = {
        ProjectID:ProjectID,
        Detail:Detail,
        Date:Date,
        Times:Times,
    };
    try {
        const response = await fetch('/AddRegisterProjectActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(ProjectRegisterData)  
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

async function createProject(projectTitle, description, goal, startDate, completionDate, contact, depositMethod, accountNumber) {
    const userID = sessionStorage.getItem('userID'); 
    const projectData = {
        UserID: userID,
        Title: projectTitle,
        Description: description,
        ContributionGoal: goal,
        Start: startDate,
        End: completionDate,
        PrimaryContact: contact,
        SecondaryContact: contact,
        DepositMethod: depositMethod,
        AccountNumber: accountNumber,
        Status: 1,
        Collected: 0.0,
    };

    try {
        const response = await fetch('/AddProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(projectData)  
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.error);
        }

        const result = await response.json();  
        console.log('Response from server:', result);
    } catch (err) {
        console.error('Error creating project:', err.message);  
    }
}

function updateImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('uploaded-image').src = e.target.result;
    }
    if (file) {

        reader.readAsDataURL(file);
    }
}

async function setLastProjectID() {
    try {
        const response = await fetch('/GetLastProjectID');  // Petición para obtener el último ID de proyecto
        const data = await response.json();  // Recibe la respuesta como JSON

        if (data.LastProjectID !== null) {
            const nextProjectID = data.LastProjectID + 1;  // Incrementa el último ID
            document.getElementById('project-id').value = nextProjectID;  // Establece el valor en el input
        } else {
            console.log("No projects found.");
            document.getElementById('project-id').value = 1;  // Si no hay proyectos, empieza desde 1
        }
    } catch (error) {
        console.error("Error fetching the last project ID:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const adminLink = document.getElementById('adminLink');
        adminLink.addEventListener('click', (event) => {
            verifyAdminUser();
        });
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
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
        // Hacer la solicitud para obtener la lista de administradores
        const response = await fetch('/GetAdminList');
        
        if (!response.ok) {
            throw new Error('Error al obtener la lista de administradores');
        }
        
        // Convertir la respuesta en un array de administradores
        const admins = await response.json();
        console.log(admins);
        // Verificar si algún administrador tiene el mismo ID que el userID
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

window.onload = setLastProjectID;