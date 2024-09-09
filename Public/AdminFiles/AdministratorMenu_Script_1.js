function UserManage(){
    console.log("Admin on UserManage");
    window.location.href = 'AdministratorUser.html';
}
function DonationManage(){
    console.log("Admin on DonationManage");
    window.location.href = 'AdministratorDonation.html';
}
function ProjectsManage(){
    console.log("Admin on ProjectsManage");
    window.location.href = 'AdministratorProjects.html';
}
/*
async function loadUsers() {
    try {
        const response = await fetch('/FUNCTION NAME');
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const result = await response.json();
        const li = document.createElement('li');
        li.textContent = `${table.atribute} ${table.atribute} (${table.atribute}) ${table.atribute}`;
        console.log(li);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
*/



// Load users when the page is loaded
window.onload = loadUsers;