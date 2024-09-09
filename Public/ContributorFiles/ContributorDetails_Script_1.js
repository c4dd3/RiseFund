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

