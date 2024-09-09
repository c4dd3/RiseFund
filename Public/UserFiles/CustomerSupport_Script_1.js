function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

function toggleFAQ(button) {
    const answer = button.parentElement.nextElementSibling;
    const isAnswerVisible = answer.style.display === "block";
    
    if (isAnswerVisible) {
        // Ocultar la respuesta
        answer.style.display = "none";
        // Cambiar el botón a +
        button.innerText = "+";
    } else {
        // Mostrar la respuesta
        answer.style.display = "block";
        // Cambiar el botón a -
        button.innerText = "-";
    }
}