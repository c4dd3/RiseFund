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
}

function Contacto() {
    console.log("Se quiere contactar con el autor");
}

// Función para obtener el parámetro de consulta de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtener el ID del proyecto de la URL
document.addEventListener('DOMContentLoaded', () => {
    const projectId = getQueryParam('id');
    if (projectId) {
        document.getElementById('projectId').textContent = `Project ID: ${projectId}`;
    } else {
        document.getElementById('projectId').textContent = 'Project ID not found.';
    }
});

// Mostrar el limite de palabras
const commentBox = document.getElementById('Comment');
const charCount = document.getElementById('charCount');

commentBox.addEventListener('input', () => {
    const currentLength = commentBox.value.length;
    charCount.textContent = `${currentLength}/500 characters`;
});

// Mostrar informacion con respecto al contenido
