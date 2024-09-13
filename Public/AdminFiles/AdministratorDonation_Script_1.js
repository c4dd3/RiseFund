document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.querySelector('.search-btn');
    const acceptButton = document.querySelector('.accept-btn');
    const declineButton = document.querySelector('.decline-btn');
    const searchInput = document.querySelector('.search-bar');
    const donationIDField = document.getElementById('donationID');
    const amountField = document.getElementById('amountDonated');
    const contributorIDField = document.getElementById('userID');
    const projectIDField = document.getElementById('projectID');
    const commentField = document.getElementById('Comment');
    const donationTableBody = document.querySelector('.donation-table tbody');

    async function loadDonations() {
        try {
            const response = await fetch('/GetDonationList');
            if (response.ok) {
                const donations = await response.json();
                displayDonations(donations);
            } else {
                alert('Error fetching donations data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading donations');
        }
    }

    function displayDonations(donations) {
        donationTableBody.innerHTML = '';
        donations.forEach(donation => {
            donationTableBody.innerHTML += `
                <tr>
                    <td>${donation.ID}</td>
                    <td>${donation.Date}</td>
                    <td>${donation.ProjectID}</td>
                    <td>${donation.Ammount}</td>
                    <td>${donation.UserID}</td>
                </tr>
            `;
        });
    }

    searchButton.addEventListener('click', function() {
        const donationID = parseInt(searchInput.value.trim());
        
        if (donationID) {
            searchDonation(donationID);
        }
    });

    async function searchDonation(donationID) {
        const donationData = {
            donationID: donationID
        };
        try {
            const response = await fetch('/GetDonationByID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    const donation = data.donation;
                    donationIDField.value = donation.ID;
                    amountField.value = donation.Ammount;
                    contributorIDField.value = donation.UserID;
                    projectIDField.value = donation.ProjectID;
                    commentField.value = donation.Comment;
                    if(donation.Status == 1){
                        desactiveButtons();
                    }
                } else {
                    alert(data.message || 'Donation not found');
                    clearForm();
                    loadDonations();
                }
            } else {
                alert('Error fetching donation data');
                clearForm();
                loadDonations();
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while searching for the donation');
            clearForm();
            loadDonations();
        }
    }

    function desactiveButtons() {
        acceptButton.disabled = true
        declineButton.disabled = true
    }

    async function searchDonationData(donationID) {
        const donationData = {
            donationID: donationID
        };
        try {
            const response = await fetch('/GetDonationDataByID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });
            const data = await response.json();
        
            if (response.ok) {
                if (data.success) {
                    const returnBody = {
                        sumToAdd : data.donation.DonationAmount,
                        ProjectID : data.donation.ProjectID,
                        collected : data.donation.ProjectCollected
                    };
                    return returnBody;
                } else {
                    alert(data.message || 'Donation not found');
                }
            } else {
                alert('Error fetching donation data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while searching for the donation');
        }
    }


    

    async function confirmDonation(DonationID) {
        
        // Mueve el dinero al proyecto
        const donationData = {
            DonationID: DonationID,
            Status: 1
        };
        try {
            const response = await fetch('/ChangeDonationStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    alert('Donation status edited successfully');



                    
                } else {
                    alert(data.message || 'Donation not found');
                    clearForm();
                    loadDonations();
                }
            } else {
                alert('Error editing donation');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while editing the donation');
        }

        const resultbody = await searchDonationData(DonationID);
        const ProjectID = resultbody.ProjectID;
        const collected = resultbody.collected;
        const sumToAdd = resultbody.sumToAdd;
        await updateCollectedAmmount(ProjectID, collected, sumToAdd);

        clearForm();
        loadDonations();
        desactiveButtons();

        
    }

    async function updateCollectedAmmount(ProjectID, collected, sumToAdd) {
        const newProjectData = {
            ProjectID: ProjectID,
            Collected: (collected+sumToAdd)
        };
        const response = await fetch('/UpdateProjectCollected', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProjectData),
        });
        const data = await response.json();

        if (response.ok) {
            if (data.success) {
                alert('Project given donation successfully');
            } else {
                alert(data.message || 'Donation not found');
                clearForm();
                loadDonations();
            }
        } else {
            alert('Error donation project');
        }
    }

    async function confirmDecline(DonationID) {
        const donationData = {
            DonationID: DonationID
        };
        try {
            const response = await fetch('/DeleteDonation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(donationData),
            });
            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    alert('Donation deleted successfully');
                } else {
                    alert(data.message || 'Donation not found');
                    clearForm();
                    loadDonations();
                }
            } else {
                alert('Error deleting donation');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the donation');
        }
        clearForm();
        loadDonations();
    }

    acceptButton.addEventListener('click', function() {
        const donationID = parseInt(donationIDField.value.trim());
        if (donationID) {
            confirmDonation(donationID);
        }
    });

    declineButton.addEventListener('click', function() {
        const donationID = parseInt(donationIDField.value.trim());
        if (donationID) {
            confirmDecline(donationID);
        }
    });


    function clearForm() {
        searchInput.value = '';
        donationIDField.value = '';
        amountField.value = '';
        contributorIDField.value = '';
        projectIDField.value = '';
        commentField.value = '';
        donationTableBody.innerHTML = '';
    }

    loadDonations();
});
