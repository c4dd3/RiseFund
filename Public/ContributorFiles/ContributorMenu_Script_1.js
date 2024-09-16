var raised = 0;
var progress = 100;

function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    let projects = [];
    async function loadProjects() {
        try {
            const projectsDisplay = document.querySelector('.ProjectsDisplay');
            if (!projectsDisplay) return;
            const response = await fetch('/ProjectsInfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            console.error('Error al cargar los proyectos:', error);
        }
    }
    function displayProjects(projects) {
        const projectsDisplay = document.querySelector('.ProjectsDisplay');
        projectsDisplay.innerHTML = '';
        projects.forEach(project => {
            if(project.Status == 1 && project.Collected >= raised){ // Los bloqueados o finalizados no
                let number = (project.Collected * 100) / project.ContributionGoal;
                let limitedDecimals = number.toFixed(2);  
                const percentage = parseFloat(limitedDecimals); 
                if (percentage <= progress) {
                const projectPanel = `
                    <div class="InfoPanel">
                        <img class="Portada" src="ProjectImage.jpg" alt="Project Image">
                        <h1 class="Titulos">${project.Title}</h1>
                        <div class="Info">
                            <p>USD Collected: $${project.Collected}</p>
                            <p>Progress: ${percentage}%</p>
                            <progress class="ProgressBar" value="${project.Collected}" max="${project.ContributionGoal}"></progress>
                            <div class="ButtonContainer">
                                <a href="ContributorDetails.html?id=${project.ID}" class="btn">Details</a>
                            </div>
                        </div>
                    </div>
                `;
                projectsDisplay.innerHTML += projectPanel;
                }
            }
        });
    }
    const searchButton = document.querySelector('.search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = document.querySelector('.search-bar').value.toLowerCase();
            const filteredProjects = projects.filter(project => project.Title.toLowerCase().includes(searchTerm));
            displayProjects(filteredProjects);
        });
    }
    if (document.querySelector('.ProjectsDisplay')) {
        loadProjects();
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

function applyFilters() {
    
    // Obtener los elementos de los filtros
    const completionFilter = document.getElementById('completionFilter');
    const moneyFilter = document.getElementById('moneyFilter');

    // Obtener los valores seleccionados
    const completionValue = completionFilter.value;
    const moneyValue = moneyFilter.value;

    // Convertir los valores a números enteros si es necesario
    progress = parseInt(completionValue, 10);
    raised = parseInt(moneyValue, 10);
    
    let projects = [];
    loadProjects();    
    displayProjects(projects);
    async function loadProjects() {
        try {
            const projectsDisplay = document.querySelector('.ProjectsDisplay');
            if (!projectsDisplay) return;
            const response = await fetch('/ProjectsInfo');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            console.error('Error al cargar los proyectos:', error);
        }
    }
    function displayProjects(projects) {
        const projectsDisplay = document.querySelector('.ProjectsDisplay');
        projectsDisplay.innerHTML = '';
        projects.forEach(project => {
            if(project.Status == 1 && project.Collected <= raised){ // Los bloqueados o finalizados no
                const percentage = (project.Collected * 100) / project.ContributionGoal;
                if (percentage <= progress) {
                const projectPanel = `
                    <div class="InfoPanel">
                        <img class="Portada" src="ProjectImage.jpg" alt="Project Image">
                        <h1 class="Titulos">${project.Title}</h1>
                        <div class="Info">
                            <p>USD Collected: $${project.Collected}</p>
                            <p>Progress: ${percentage}%</p>
                            <progress class="ProgressBar" value="${project.Collected}" max="${project.ContributionGoal}"></progress>
                            <div class="ButtonContainer">
                                <a href="ContributorDetails.html?id=${project.ID}" class="btn">Details</a>
                            </div>
                        </div>
                    </div>
                `;
                projectsDisplay.innerHTML += projectPanel;
                }
            }
        });
    }
}