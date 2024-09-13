function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

// Actualizar la pantalla según la información
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Solicitar la cantidad de proyectos
        const response1 = await fetch('/GetTotalProjects', {
            method: 'POST'
        });
        const projects = await response1.json();
        console.log('Projects response:', projects); // Verifica la estructura
        
        // Solicitar la cantidad de usuarios
        const response2 = await fetch('/GetTotalUsers', {
            method: 'POST'
        });
        const donantes = await response2.json();
        console.log('Users response:', donantes); // Verifica la estructura
 
        // Solicitar la cantidad de dinero donado
        const response3 = await fetch('/GetTotalRaised', {
            method: 'POST'
        });
        const dinero = await response3.json();
        console.log('Raised response:', dinero); // Verifica la estructura

        // Seleccionar el contenedor donde se mostrarán los proyectos
        const projectsDisplay = document.querySelector('.Estadisticas');
        projectsDisplay.innerHTML = ''; // Limpiar los paneles anteriores
        
        // Generar dinámicamente un panel para cada dato
        const projectPanel = `
            <div class="TEXT">Over ${projects.totalProjects} projects</div>
            <div class="TEXT">Over $${dinero.sumaTotal} raised</div>
            <div class="TEXT">Over ${donantes.totalUsers} users</div>
        `;
 
        projectsDisplay.innerHTML += projectPanel;
    } catch (error) {
        // Manejo de errores en caso de problemas con la solicitud
        console.error('Error al cargar los proyectos:', error);
    }
});
