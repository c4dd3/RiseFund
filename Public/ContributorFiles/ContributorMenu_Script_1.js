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
        const response = await fetch('/ProjectsInfo');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Convertir la respuesta en formato JSON
        const projects = await response.json();
        
        // Seleccionar el contenedor donde se mostrarán los proyectos
        const projectsDisplay = document.querySelector('.ProjectsDisplay');
        projectsDisplay.innerHTML = ''; // Limpiar los paneles anteriores
                

        // Generar dinámicamente un panel para cada proyecto
        projects.forEach(project => {

            const percentage = (project.Collected * 100)/project.ContributionGoal;

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
            // Agregar el panel al contenedor
            projectsDisplay.innerHTML += projectPanel;
        });
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
        console.error('Error al cargar los proyectos:', error);
    }
});