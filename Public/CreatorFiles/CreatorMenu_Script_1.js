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
                const percentage = (project.Collected * 100)/project.ContributionGoal;

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
});