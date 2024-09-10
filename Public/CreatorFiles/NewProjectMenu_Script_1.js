function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

function showConfirmation() {
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
        createProject(projectTitle, description, goal, startDate, completionDate, 
                        contact, depositMethod, accountNumber);
        const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
        const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
        const userID = sessionStorage.getItem('userID'); 
        createRegisterProject(projectID, 'New Project by user '+userID.toString()+' has been created', currentDateCR, currentTimeCR)
        alert("Project Created!");
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

window.onload = setLastProjectID;