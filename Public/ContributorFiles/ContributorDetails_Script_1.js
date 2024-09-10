function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

function Compartir() {
    console.log("Ha compartido el proyecto");
};

function Contacto() {
    console.log("Se quiere contactar con el autor");
};

function Donar() {
    console.log("Se quiere donar");
    
};

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function showConfirmation() {
    const ammountToDonate = document.getElementById("AmmountToDonate").value;
    const comment = document.getElementById("Comment").value;
    const projectID = parseInt(getQueryParam('id'));


    if (!ammountToDonate || !comment ) {
        alert("Please fill in all the required fields before confirming.");
        return;
    }

    const confirmed = confirm(`
    Please verify the project details:

    - ammountToDonate: ${ammountToDonate}
    - comment: ${comment}

    Confirm project creation?`);

    if (confirmed) {
        const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
        const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
        const userID = sessionStorage.getItem('userID'); 
        createDonation(projectID, userID, ammountToDonate, comment, currentDateCR, currentTimeCR);
        //createRegisterDonation(projectID, 'New Donation by user '+userID.toString()+' has been created', currentDateCR, currentTimeCR)
        alert("Donation Created!");
    }
}

async function createDonation(projectID, userID, ammountToDonate, comment, currentDateCR, currentTimeCR) {
    const projectData = {
        UserID: userID,
        ProjectID: projectID,
        Ammount: ammountToDonate,
        Comment: comment,
        Status: 0,
        Date: currentDateCR,
        Time: currentTimeCR,
    };

    try {
        const response = await fetch('/AddDonation', {
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

async function createRegisterDonation(ProjectID, Detail, Date, Times) {
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














// Función para obtener el parámetro de consulta de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};

// Mostrar el limite de palabras
document.addEventListener('DOMContentLoaded', () => {
    const commentBox = document.getElementById('Comment');
    const charCount = document.getElementById('charCount');

    // Verifica si el elemento existe antes de agregar el evento
    if (commentBox && charCount) {
        commentBox.addEventListener('input', () => {
            const currentLength = commentBox.value.length;
            charCount.textContent = `${currentLength}/500 characters`;
        });
    } else {
        console.error('Comment box or charCount element not found');
    }
});



