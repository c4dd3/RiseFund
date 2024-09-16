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
        const response1 = await fetch('/GetTotalProjects', {
            method: 'POST'
        });
        const projects = await response1.json();
        console.log('Projects response:', projects); 
        const response2 = await fetch('/GetTotalUsers', {
            method: 'POST'
        });
        const donantes = await response2.json();
        console.log('Users response:', donantes);
        const response3 = await fetch('/GetTotalRaised', {
            method: 'POST'
        });
        const dinero = await response3.json();
        console.log('Raised response:', dinero); 
        const projectsDisplay = document.querySelector('.Estadisticas');
        projectsDisplay.innerHTML = '';
        const projectPanel = `
            <div class="TEXT">Over ${projects.totalProjects} projects</div>
            <div class="TEXT">Over $${dinero.sumaTotal} raised</div>
            <div class="TEXT">Over ${donantes.totalUsers} users</div>
        `;
        const adminLink = document.getElementById('adminLink');
        adminLink.addEventListener('click', (event) => {
            verifyAdminUser();
        });
        projectsDisplay.innerHTML += projectPanel;
    } catch (error) {
        console.error('Error al cargar los proyectos:', error);
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
        const response = await fetch('/GetAdminList');
        if (!response.ok) {
            throw new Error('Error al obtener la lista de administradores');
        }
        const admins = await response.json();
        console.log(admins);
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