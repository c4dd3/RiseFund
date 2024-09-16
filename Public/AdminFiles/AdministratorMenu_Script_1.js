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
    fetchProjects();
    fetchDonations();
});
async function fetchUserRecords() {
    try {
        const response = await fetch('/getUserRegisters');
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
async function fetchProjects() {
    try {
        const response = await fetch('/getProjectRegisters');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const projects = await response.json();
        displayProjects(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
    }
}
function displayProjects(projects) {
    const container = document.getElementById('projectRegisterList');
    container.innerHTML = '';  

    projects.forEach(project => {
        const date = new Date(project.Date);
        const formattedDate = date.toLocaleDateString(); 
        const time = project.Time;
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `
           <strong>ID:</strong> ${project.ID} ${formattedDate} ${time} <strong>Detail:</strong> ${project.Detail} Num: ${project.ProjectID}
        `;
        container.appendChild(projectElement);
    });
}
async function fetchDonations() {
    try {
        const response = await fetch('/getDonationRegisters');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const donations = await response.json();
        displayDonations(donations);
    } catch (err) {
        console.error('Error fetching donations:', err);
    }
}
function displayDonations(donations) {
    const container = document.getElementById('donationRegisterList');
    container.innerHTML = '';
    donations.forEach(donation => {
        const date = new Date(donation.Date);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = donation.Time;
        const donationElement = document.createElement('div');
        donationElement.className = 'donation';
        donationElement.innerHTML = `
            <strong>ID:</strong> ${donation.ID} ${formattedDate} ${formattedTime} <strong>Donation ID:</strong> ${donation.DonationID} <strong>Detail:</strong> ${donation.Detail} 
        `;
        container.appendChild(donationElement);
    });
}