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

            const percentage = (project.Collected * 100)/project.ContributionGoal;

            const projectPanel = `
                <div class="project">
                <img src="ProjectImage.jpg" alt="Project 1 Image" class="project-image">
                <div class="project-title">Project 1</div>
                <div class="project-details">Money Collected: $1000</div>
                <div class="project-details">Progress: 50%</div>
                <div class="progress-bar">
                    <div class="progress" style="width: 50%;"></div>
                </div>
                <button class="edit-button" onclick="window.location.href='../CreatorFiles/EditProjectMenu.html'">✎ Edit</button>
            </div>
            `;
            // Agregar el panel al contenedor
            projectsDisplay.innerHTML += projectPanel;
        });
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
        console.error('Error al cargar los proyectos:', error);
    }
});