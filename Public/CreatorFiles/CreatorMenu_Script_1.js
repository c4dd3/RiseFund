function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Obtener el userID desde el sessionStorage
        const userID = sessionStorage.getItem('userID');

        // Enviar el userID en el cuerpo de la solicitud POST
        const response = await fetch('/ProjectsCreatorInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userID: userID })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Convertir la respuesta en formato JSON
        const projects = await response.json();
        
        // Seleccionar el contenedor donde se mostrarán los proyectos
        const projectsDisplay = document.querySelector('.project-container');
        projectsDisplay.innerHTML = ''; // Limpiar los paneles anteriores
                

        // Generar dinámicamente un panel para cada proyecto
        projects.forEach(project => {
            if(project.Status == 1 || project.Status == 2  ){ // Los bloqueados no salen
                let number = (project.Collected * 100) / project.ContributionGoal;
                let limitedDecimals = number.toFixed(2);  
                const percentage = parseFloat(limitedDecimals); 

                const projectPanel = `
                    <div class="project">
                    <img src="ProjectImage.jpg" alt="Project 1 Image" class="project-image">
                    <div class="project-title">${project.Title}</div>
                    <div class="Info">
                            <p>USD Collected: $${project.Collected}</p>
                            <p>Progress: ${percentage}%</p>
                            <progress class="ProgressBar" value="${project.Collected}" max="${project.ContributionGoal}"></progress>
                            <button class="edit-button" onclick="window.location.href='../CreatorFiles/EditProjectMenu.html?id=${project.ID}'">✎ Edit</button>
                    </div>
                </div>
                `;
                // Agregar el panel al contenedor
                projectsDisplay.innerHTML += projectPanel;
            }
            
        });
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
        console.error('Error al cargar los proyectos:', error);
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