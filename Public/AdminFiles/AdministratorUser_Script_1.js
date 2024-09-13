document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-btn');
    const confirmButton = document.querySelector('.confirm-btn');
    const searchInput = document.querySelector('.search-bar');
    const userIDField = document.getElementById('userID');
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const statusField = document.getElementById('status');
    const emailField = document.getElementById('email');
    const userTableBody = document.querySelector('.user-table tbody');


    async function loadUsers() {
        try {
            const response = await fetch('/GetUserList');
            if (response.ok) {
                const users = await response.json();
                displayUsers(users);
            } else {
                alert('Error fetching users data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading users');
        }
    }

    function displayUsers(users) {
        userTableBody.innerHTML = '';
        users.forEach(user => {
            userTableBody.innerHTML += `
                <tr>
                    <td>${user.ID}</td>
                    <td>${user.FirstName}</td>
                    <td>${user.LastName}</td>
                    <td>${user.Email}</td>
                    <td>${user.STATUS}</td>
                </tr>
            `;
        });
    }

    searchButton.addEventListener('click', function() {
        const userID = parseInt(searchInput.value.trim());
        
        if (userID) {
            searchUser(userID);
        }
    });

    async function searchUser(userID) {
        const UserData = {
            UserID: userID
        };
        try {
            const response = await fetch('/GetUserByID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UserData),
            });
            if (response.ok) {
                const user = await response.json();
                
                if (user) {
                    userIDField.value = user.ID;
                    firstNameField.value = user.FirstName;
                    lastNameField.value = user.LastName;
                    emailField.value = user.Email;
                    if(user.Status == 1){
                        statusField.value = 'Active';
                    } else{
                        statusField.value = 'Blocked';
                    }

                } else {
                    alert('User not found');
                    clearForm();
                }
            } else {
                alert('Error fetching user data');
                clearForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while searching for the user');
            clearForm();
        }
    }

    async function updateUserStatus() {
        const UserID = parseInt(userIDField.value);
        const Status = statusField.value === 'Active' ? 1 : 0;
        const UserData = {
            UserID: UserID,
            Status: Status
        }
        try {
            const response = await fetch('/UpdateUserStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UserData),
            });
            if (response.ok) {
                alert('User status updated successfully');
                clearForm();
                loadUsers();
            } else {
                alert('Error updating user status');
                clearForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating user status');
            clearForm();
        }
    }

    confirmButton.addEventListener('click', updateUserStatus);

    function clearForm() {
        userIDField.value = '';
        firstNameField.value = '';
        lastNameField.value = '';
        emailField.value = '';
        statusField.value = '';
        userTableBody.innerHTML = '';
    }

    loadUsers();
});
