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
    const projectID = getQueryParam('id');
    const response = await fetch('/ProjectById', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectID: projectID })
    });

    const project = await response.json();
    var estado = true;
    
    if (parseInt(project.Status) == 3 || parseInt(project.Status) == 2) {
        estado = false;
    }
    const userID = sessionStorage.getItem('userID');
    const IDProject = document.getElementById("project-id").value;
    const projectTitle = document.getElementById("project-title").value;
    const projectDescription = document.getElementById("project-description").value;
    const startDate = document.getElementById("start-date").value;
    const goal = document.getElementById("goal").value;
    const completionDate = document.getElementById("completion-date").value;
    const status = document.getElementById("status").value;
    const contact = document.getElementById("contact").value;
    const depositMethod = document.getElementById("deposit-method").value;
    const expirationDate = document.getElementById("expiration").value;
    const accountNumber = document.getElementById("account-number").value;
    const accountOwnership = await isOfUser(accountNumber, userID);
    intStatus = 0;
    if(status == "Active"){
        intStatus = 1;
    } else if(status == "Finished"){
        intStatus = 2;
    } else {
        intStatus = 3;
    }
    if (!goal || !contact || !accountNumber) {
        alert("Please fill in all the required fields before confirming.");
        return;
    }
    if(estado){
        if(accountOwnership){
            const confirmed = confirm(`
                Please verify the project details:
                - Project ID: ${IDProject}
                - Start Date: ${startDate}
                - Contribution Goal: ${goal}
                - Expected Completion: ${completionDate}
                - Status: ${status}
                - Project Contact: ${contact}
                - Deposit Method: ${depositMethod}
                - Expiration Date: ${expirationDate}
                - Account Number: ${accountNumber}
                Confirm changes?`);
            if (confirmed) {
                ActualizarInfo(projectTitle, projectDescription, goal, startDate, completionDate, contact, contact, depositMethod, accountNumber, intStatus); 
                const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
                const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
                const userID = sessionStorage.getItem('userID'); 
                createRegisterProject(projectID, 'Project by user '+userID.toString()+' has been edited', currentDateCR, currentTimeCR);
                sendConfirmation(userID);
                alert("Project updated!");
            }
        } else {
            alert("Account number does not exist or is not yours");
        }
        
    } else {
        alert("Your Project is Blocked Or Finished");
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

// Función para obtener el parámetro de consulta de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Actualizar la pantalla segun la informacion
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener el userID desde el sessionStorage
        const projectID = parseInt(getQueryParam('id'));

        // Enviar el userID en el cuerpo de la solicitud POST
        const response1 = await fetch('/ProjectById', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ projectID: projectID })
        });

        const project = await response1.json();

        const response2 = await fetch('/ExpirationDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({projectID: projectID})
        });

        const cuentaBancaria = await response2.json();

        // Seleccionar el contenedor donde se mostrarán los proyectos
        const projectsDisplay = document.querySelector('.container');
        projectsDisplay.innerHTML = ''; // Limpiar los paneles anteriores
        
        // Calcular el porcentaje de error
        const percentage = (project.Collected * 100) / project.ContributionGoal;

        // Convertir formato de tiempo de inicio
        const start = new Date(project.Start);
        const year1 = start.getFullYear();
        const month1 = String(start.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11, por eso sumamos 1
        const day1 = String(start.getDate()).padStart(2, '0'); // padStart para asegurar dos dígitos

        const end = new Date(project.End);
        const year2 = end.getFullYear();
        const month2 = String(end.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11, por eso sumamos 1
        const day2 = String(end.getDate()).padStart(2, '0'); // padStart para asegurar dos dígitos

        const expirationDate = new Date(cuentaBancaria.UserCardExpirationDate);
        const year3 = expirationDate.getFullYear();
        const month3 = String(expirationDate.getMonth() + 1).padStart(2, '0'); // getMonth() devuelve 0-11, por eso sumamos 1
        const day3 = String(expirationDate.getDate()).padStart(2, '0'); // padStart para asegurar dos dígitos
       
        // Construir la fecha en formato YYYY-MM-DD
        const formattedStart = `${year1}-${month1}-${day1}`;
        const formattedEnd = `${year2}-${month2}-${day2}`;
        const formattedExpiration = `${year3}-${month3}-${day3}`;
        
        
        // Obtener el valor del parámetro de consulta 'status'
        
        
        //Generar dinámicamente un panel para cada proyecto
        const projectPanel = `
            <section class="project-form">
            <div class="form-left">
                <h1>EDIT PROJECT</h1>
                <div class="form-row">
                    <label for="project-title">Project Title:</label>
                    <input type="text" id="project-title" value="${project.Title}">
                </div>
                <div class="form-row">
                    <label for="project-id">Project ID:</label>
                    <input type="text" id="project-id" value="${projectID}" readonly>
                </div>
                <div class="form-row">
                    <label for="start-date">Start:</label>
                    <input type="date" id="start-date" value="${formattedStart}">
                </div>
                <div class="form-row">
                    <label for="goal">Contribution Goal:</label>
                    <input type="text" id="goal" value="${project.ContributionGoal}">
                </div>
                <div class="form-row">
                    <label for="completion-date">Expected Completion:</label>
                    <input type="date" id="completion-date" value="${formattedEnd}">
                </div>
                <div class="form-row">
                    <label for="status">Status:</label>
                    <select id="status">
                        <option value="Blocked">Blocked</option>
                        <option value="Active">Active</option>
                        <option value="Finished">Finished</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="contact">Project Contact:</label>
                    <input type="text" id="contact" value="${project.PrimaryContact}">
                </div>
                <div class="form-row">
                    <label for="deposit-method">Deposit Method:</label>
                    <select id="deposit-method">
                        <option value="immediate">Immediate</option>
                        <option value="completion">Per completion</option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="expiration">Expiration date:</label>
                    <input type="date" id="expiration" value="${formattedExpiration}" disabled>
                </div>
                <div class="form-row">
                    <label for="account-number">Account Number:</label>
                    <input type="text" id="account-number" value="${project.AccountNumber}">
                </div>
                <div class="form-row">
                    <button class="create-button" onclick="showConfirmation()">Edit</button>
                </div>
            </div>
            <div class="form-right">
                <div class="image-upload">
                    <img id="uploaded-image" src="ProjectImage.jpg" alt="Upload Image">
                    <button class="edit-image" onclick="document.getElementById('file-input').click()">✎</button>
                    <input type="file" id="file-input" accept="image/*" onchange="updateImage(event)">
                </div>
                <div class="description-box">
                    <textarea id="project-description" placeholder="Description...">${project.Description}</textarea>
                </div>
            </div>
        </section>
        `
        projectsDisplay.innerHTML += projectPanel;
        const statusField = document.getElementById('status');
        const status = parseInt(project.Status);
        if (status == 1){
            statusField.value = 'Active';
        } else if (status == 2){
            statusField.value = 'Finished';
        } else { 
            statusField.value = 'Blocked';
        }
        const statusField2 = document.getElementById('deposit-method');
        const depositMethod = project.DepositMethod;
        if (depositMethod == 'immediate'){
            statusField2.value = 'immediate';
        }else{
            statusField2.value = 'completion';
        }
        
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
        console.error('Error al cargar los proyectos:', error);
    }
});

async function ActualizarInfo(title, Description, ContributionGoal, Start, End, PrimaryContact, PrimaryContact, DepositMethod, AccountNumber, Status) {
    const projectID = getQueryParam('id');

    const ProjectNewInfo = {
        projectID:projectID,
        Title:title,
        Description:Description,
        ContributionGoal:ContributionGoal,
        Start:Start,
        End:End,
        PrimaryContact:PrimaryContact,
        SecondaryContact:PrimaryContact,
        DepositMethod:DepositMethod,
        AccountNumber:AccountNumber,
        Status:Status
    };
    try {
        const response = await fetch('/EditProject', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify(ProjectNewInfo)  
        });

        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.error);
        }

        
        const result = await response.json();  
        console.log('Response from server:', result);
    } catch (err) {
        console.error('Error editing project:', err.message);  
    }
}

async function sendConfirmation(UserID) {
    if (!UserID) {
        console.error('Email not found.');
        alert('Email is missing.');
        return;
    }
    try {
        const response = await fetch('/sendEditingEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserID })  // Enviar el correo electrónico en el cuerpo de la solicitud
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

// const { projectID, Title, Description, ContributionGoal, Start, End, PrimaryContact, 
//     SecondaryContact, DepositMethod, AccountNumber, Status}