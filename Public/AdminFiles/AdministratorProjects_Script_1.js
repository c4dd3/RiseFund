document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-bar');
    const projectIDField = document.getElementById('projectID');
    const amountField = document.getElementById('amountGathered');
    const creatorIDField = document.getElementById('creatorID');
    const progressField = document.getElementById('progress');
    const contributorField = document.getElementById('contributor');
    const statusField = document.getElementById('status');
    const projectTableBody = document.querySelector('.project-table tbody');


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
            if (response.ok) {
                const project = await response.json();
                
                if (project) {
                    projectIDField.value = project.ID;
                    creatorIDField.value = project.UserID;
                    progressField.value = project.Progress;
                    amountField.value = project.Collected;
                    contributorField.value = project.Contributors;
                    if(project.Status == 1){
                        statusField.value = 'Active';
                    } else if (project.Status == 2) {
                        statusField.value = 'Finished';
                    } else if (project.Status == 3) {
                        statusField.value = 'Blocked';
                    }

                } else {
                    alert('project not found');
                    clearForm();
                }
            } else {
                alert('Error fetching project data');
                clearForm();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while searching for the project');
            clearForm();
        }
    }

    function clearForm() {
        projectIDField.value = '';
        firstNameField.value = '';
        lastNameField.value = '';
        emailField.value = '';
        statusField.value = '';
        projectTableBody.innerHTML = '';
    }

    loadProjects();
});
