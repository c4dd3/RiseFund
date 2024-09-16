
function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
async function showConfirmation() {
    const ammountToDonate = document.getElementById("AmmountToDonate").value;
    const comment = document.getElementById("Comment").value;
    const projectID = parseInt(getQueryParam('id'));
    if (!ammountToDonate || !comment ) {
        alert("Please fill in all the required fields before confirming.");
        return;
    }
    if (ammountToDonate <= 0) {
        alert("Please enter a valid amount to donate.");
        return;
    }
    const confirmed = confirm(`
    Please verify the project details:

    - Amount to donate: ${ammountToDonate}
    - Comment: ${comment}

    Confirm project donation?`);
    if (confirmed) {
        const currentDateCR = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
        const currentTimeCR = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/Costa_Rica', hour12: false });
        const userID = sessionStorage.getItem('userID'); 
        await createDonation(projectID, userID, ammountToDonate, comment, currentDateCR, currentTimeCR);
        const DonationID = await getDonationID(projectID, userID, currentDateCR, currentTimeCR);
        createRegisterDonation(DonationID, 'New Donation by user '+userID.toString()+' has been created', currentDateCR, currentTimeCR)
        alert("Donation Created!"); 
    }
}
async function getDonationID(projectID, userID, currentDateCR, currentTimeCR) {
    const projectData = {
        UserID: userID,
        ProjectID: projectID,
        Date: currentDateCR,
        Time: currentTimeCR,
    };
    try {
        const response = await fetch('/GetDonationID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.DonationID) {
            console.log('Donation ID:', result.DonationID);
            return result.DonationID;
        } else {
            console.error('No donation ID found for the given parameters');
            return null;
        }
    } catch (error) {
        console.error('Error fetching donation ID:', error);
        return null;
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
        console.error('Error creating Donation:', err.message);  
    }
}
async function createRegisterDonation(DonationID, Detail, Date, Times) {
    const ProjectRegisterData = {
        DonationID:DonationID,
        Detail:Detail,
        Date:Date,
        Times:Times,
    };
    try {
        const response = await fetch('/AddRegisterDonationActivity', {
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
        console.error('Error creating Register Donation:', err.message);
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

        // Convertir la respuesta en formato JSON
        const project = await response1.json();
        
        const response2 = await fetch('/SearchDonatedPeople',{
            method: 'POST',
        headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({projectID: projectID})
        });
        const donantes = await response2.json(); 

        // Seleccionar el contenedor donde se mostrarán los proyectos
        const projectsDisplay = document.querySelector('.container');
        projectsDisplay.innerHTML = ''; // Limpiar los paneles anteriores
        
        // Calcular el porcentaje de error

        let number = (project.Collected * 100) / project.ContributionGoal;
        let limitedDecimals = number.toFixed(2);  
        const percentage = parseFloat(limitedDecimals);  

        // Generar dinámicamente un panel para cada proyecto
        const projectPanel = `
            <h1 class="Titulo">${project.Title}</h1>

        <div class="ProjectInfo">
            <div class="InfoPanel">

                <img src="ProjectImage.jpg" class="image">
                <div class="DescriptionPanel">
                    <p class="Description">
                        ${project.Description}
                    </p>
                    <p id="projectId">Project ID: ${projectID} </p>
                    <script src="ContributorDetails_Script_1.js"></script>
                </div>
                <p class="Authors">By: ${project.FirstName} ${project.LastName}</p>

            </div>

            <div class="InfoDatos">

                <div class="PrimerPanel">
                    <div class="ProgressContainerText">
                        <h2 class="ProgressText">Progress: ${percentage}%</h2>
                        <h2 class="AmountRaised">USD Collected: ${project.Collected}</h2>
                    </div>

                    <progress class="ProgressBar" value="${project.Collected}" max="${project.ContributionGoal}"></progress>

                    <div class="AdditionalText">
                        <h2 class="GoalAmount">Goal: ${project.ContributionGoal}$</h2>
                        <h2 class="AmountContributors">Contributors: ${donantes.DONANTES}</h2>
                    </div>

                    <div class="ButtonContainer">
                        <button class="ShareButton" onclick="Compartir()" id="shareButton">Share</button>
                        <button class="ContactButton" onclick="Contactar()">Contact</button>
                    </div>
                </div>

                <div class="SegundoPanel">
                    <h2>Comment:</h2>
                    <textarea id="Comment" class="Comentario" placeholder="Share your thoughts with the author/authors" maxlength="500"></textarea>
                    <p id="charCount">0/500 characters</p>
                    <!--Contador de caracteres-->
                    <script src="ContributorDetails_Script_1.js"></script>

                    <div class="DonateContainer">
                        <input id="AmmountToDonate" class="AmmountInputText" placeholder="$0000.00"></input>
                        <button class="DonateButton" onclick="showConfirmation()">Donate</button>
                    </div>

                </div>

            </div>

        </div>
        `
 
        projectsDisplay.innerHTML += projectPanel;
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
        console.error('Error al cargar los proyectos:', error);
    }
});

// Función para mostrar el pop-up
function Compartir() {
    const sharePopup = document.getElementById("sharePopup");
    const overlay = document.getElementById("overlay");
    sharePopup.style.display = "block";
    overlay.style.display = "block";
}

// Función para ocultar el pop-up
function closePopup() {
    const sharePopup = document.getElementById("sharePopup");
    const overlay = document.getElementById("overlay");
    sharePopup.style.display = "none";
    overlay.style.display = "none";
}

// Función para compartir el enlace en redes sociales
function shareOn(platform) {
    const url = window.location.href;
    let shareUrl;

    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
            break;
        default:
            return;
    }

    window.open(shareUrl, '_blank');
}

// Función
async function Contactar() {
    const projectID = getQueryParam('id');
    const response1 = await fetch('/ProjectById', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectID: projectID })
    });

    // Convertir la respuesta en formato JSON
    const project = await response1.json();

    const email = project.Email;
    window.location.href = `mailto:${email}`;
}