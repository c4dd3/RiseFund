function toggleDropdown() {
    var dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'block';
    }
}

function showConfirmation() {
    const projectID = document.getElementById("project-id").value;
    const startDate = document.getElementById("start-date").value;
    const goal = document.getElementById("goal").value;
    const completionDate = document.getElementById("completion-date").value;
    const status = document.getElementById("status").value;
    const contact = document.getElementById("contact").value;
    const depositMethod = document.getElementById("deposit-method").value;
    const expirationDate = document.getElementById("expiration").value;
    const accountNumber = document.getElementById("account-number").value;


    if (!goal || !contact || !accountNumber) {
        alert("Please fill in all the required fields before confirming.");
        return;
    }

    const confirmed = confirm(`
    Please verify the project details:
    - Project ID: ${projectID}
    - Start Date: ${startDate}
    - Contribution Goal: ${goal}
    - Expected Completion: ${completionDate}
    - Status: ${status}
    - Project Contact: ${contact}
    - Deposit Method: ${depositMethod}
    - Expiration Date: ${expirationDate}
    - Account Number: ${accountNumber}

    Confirm project creation?`);

    if (confirmed) {
        alert("Project Created!");
    }
}

function updateImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('uploaded-image').src = e.target.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    }
}