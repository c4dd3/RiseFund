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


async function sendQuestion() {
    const name = document.getElementById('name').value.trim();
    const question = document.getElementById('inquiry').value.trim();
    const UserID = sessionStorage.getItem('userID');

    if (!name || !question) {
        alert('Please, fill in all the spaces');
        return;
    }

    try {
        const response = await fetch('/sendQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, question, UserID })
        });

        if (response.ok) {
            alert('Question sent successfully!');
        } else {
            alert('Failed to send the question.');
        }
    } catch (error) {
        console.error('Error sending the question:', error);
        alert('An error occurred while sending your question.');
    }
}