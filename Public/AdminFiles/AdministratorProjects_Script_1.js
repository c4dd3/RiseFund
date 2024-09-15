document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-btn');
    const confirmButton = document.querySelector('.confirm-btn');
    const searchInput = document.querySelector('.search-bar');
    const projectIDField = document.getElementById('projectID');
    const amountField = document.getElementById('amountGathered');
    const creatorIDField = document.getElementById('creatorID');
    const progressField = document.getElementById('progress');
    const contributorField = document.getElementById('contributors');
    const statusField = document.getElementById('status');
    const descriptionField = document.getElementById('Description');
    const projectTableBody = document.querySelector('.project-table tbody');
    const statisticsBtn = document.querySelector('.statistics-btn');
    const popup = document.querySelector('.popup');
    const closeBtn = document.querySelector('.close-btn');
    const activeProjectDiv = document.getElementById('activeProject');
    const finishedProjectDiv = document.getElementById('finishedProject');
    const blockedProjectDiv = document.getElementById('blockedProject');

    statisticsBtn.addEventListener('click', async () => {
        activeProjectDiv.textContent = `Total Active Project: ${(await getActiveProjects())}`;
        finishedProjectDiv.innerHTML = `Total Finished Projects: ${(await getFinishedProjects())}`;
        blockedProjectDiv.innerHTML = `Total Blocked Project: ${(await getBlockedProjects())}`;
        popup.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
        }
    });

    async function getActiveProjects() {
        try{
            const response = await fetch('/GetActiveProject');
            if (response.ok) {
                const projects = await response.json();
                return projects.Total;
            } else {
                alert('Error fetching projects data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading projects');
        }
    }

    async function getBlockedProjects() {
        try{
            const response = await fetch('/GetBlockedProject');
            if (response.ok) {
                const projects = await response.json();
                return projects.Total;
            } else {
                alert('Error fetching projects data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading projects');
        }
    }

    async function getFinishedProjects() {
        try{
            const response = await fetch('/GetFinishedProject');
            if (response.ok) {
                const projects = await response.json();
                return projects.Total;
            } else {
                alert('Error fetching projects data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading projects');
        }
    }


    async function loadProjects() {
        try {
            const response = await fetch('/GetProjectList');
            if (response.ok) {
                const projects = await response.json();
                displayProjects(projects);
            } else {
                alert('Error fetching projects data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading projects');
        }
    }

    function displayProjects(projects) {
        projectTableBody.innerHTML = '';
        projects.forEach(project => {
            projectTableBody.innerHTML += `
                <tr>
                    <td>${project.ID}</td>
                    <td>${project.UserID}</td>
                    <td>${project.Progress}</td>
                    <td>${project.Collected}</td>
                    <td>${project.Contributors}</td>
                </tr>
            `;
        });
    }

    searchButton.addEventListener('click', function() {
        const projectID = parseInt(searchInput.value.trim());
        
        if (projectID) {
            searchProject(projectID);
        }
    });

    async function searchProject(projectID) {
        const projectData = {
            projectID: projectID
        };
        try {
            const response = await fetch('/GetProjectByID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(projectData),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    const project = data.project;
                    projectIDField.value = project.ID;
                    creatorIDField.value = project.UserID;
                    progressField.value = project.Progress;
                    amountField.value = project.Collected;
                    contributorField.value = project.Contributors;
                    if(project.Status == 1) {
                        statusField.value = 'Active';
                    } else if (project.Status == 2) {
                        statusField.value = 'Finished';
                    } else {
                        statusField.value = 'Blocked';
                    }
                    descriptionField.value = project.Description;
                } else {
                    alert(data.message || 'Project not found');
                    clearForm();
                    loadProjects();
                }
            } else {
                alert('Error fetching project data');
                clearForm();
                loadProjects();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while searching for the project');
            clearForm();
            loadProjects();
        }
    }

    async function updateProjectStatus() {
        const projectID = projectIDField.value;
        const statusValue = statusField.value === 'Active' ? 1 : statusField.value === 'Finished' ? 2 : 3 ;

        const updateData = {
            projectID: projectID,
            status: statusValue
        };

        try {
            const response = await fetch('/UpdateProjectStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();
            if (response.ok) {
                if (result.success) {
                    alert('Project status updated successfully');
                    loadProjects(); // Reload project data after updating
                } else {
                    alert(result.message || 'Failed to update project status');
                }
            } else {
                alert('Error updating project status');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the project status');
        }
    }

    confirmButton.addEventListener('click', updateProjectStatus);


    function clearForm() {
        projectIDField.value = '';
        amountField.value = '';
        creatorIDField.value = '';
        progressField.value = '';
        contributorField.value = '';
        statusField.value = '';
        descriptionField.value = '';
    }

    loadProjects();
});
