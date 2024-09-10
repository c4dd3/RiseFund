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
document.addEventListener('DOMContentLoaded', () => {
    fetchUserRecords();
});
async function fetchUserRecords() {
    try {
        const response = await fetch('/getUserRegisters'); // Ruta del servidor para obtener registros
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const records = await response.json(); 
        displayRecordsUSER(records);
    } catch (err) {
        console.error('Error fetching records:', err);
    }
}
function displayRecordsUSER(records) {
    const container = document.getElementById('userRegisterList');
    container.innerHTML = '';
    records.forEach(record => {
        const date = new Date(record.Date);
        const formattedDate = date.toLocaleDateString(); 
        const formattedTime = record.Time;  
        const recordElement = document.createElement('div');
        recordElement.className = 'record'; 
        recordElement.innerHTML = `<strong>ID:</strong> ${record.ID} ${formattedDate} ${formattedTime} <strong> Detail:</strong> ${record.Detail} `;
        container.appendChild(recordElement);
    });
}