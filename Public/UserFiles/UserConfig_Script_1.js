document.addEventListener('DOMContentLoaded', async function() {
    const firstNameField = document.getElementById('firstName');
    const lastNameField = document.getElementById('lastName');
    const oldPasswordField = document.getElementById('oldPassword');
    const newPasswordField = document.getElementById('newPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const confirmButtonPersonalInfo = document.getElementById('confirm-btn-personal-info');
    const confirmButtonPaymentInfo = document.getElementById('confirm-btn-payment-info');
    const accountNumberField = document.getElementById('accountNumber');
    const cardNumberField = document.getElementById('cardNumber');
    const expirationDateField = document.getElementById('expirationDate');
    const securityNumberField = document.getElementById('securityNumber');
    const UserID = sessionStorage.getItem('userID');
    const CurrentUserData = await loadUserData(UserID);

    async function loadUserData(UserID) {
        const UserData = {
            UserID: UserID
        };
        try {
            const response = await fetch('/GetUserByID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UserData),
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            if (data && data.ID) {
                firstNameField.value = data.FirstName;
                lastNameField.value = data.LastName;
                return data;
            } else {
                alert('User not found');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while getting the user');
        }
    }

    async function updatePersonalInfo() {
        const FirstName = firstNameField.value;
        const LastName = lastNameField.value;
        const OldPassword = oldPasswordField.value;
        const NewPassword = newPasswordField.value
        const ConfirmPassword = confirmPasswordField.value
        const UserData = {
            UserID: UserID,
            FirstName: FirstName,
            LastName: LastName,
            OldPassword: OldPassword,
            NewPassword: NewPassword,
            ConfirmPassword: ConfirmPassword
        };
        if (!FirstName || !LastName || !OldPassword || !NewPassword || !ConfirmPassword) {
            alert("All fields are required.");
            return false;
        }
        if (contieneSimbolosEspeciales(FirstName) || contieneSimbolosEspeciales(LastName) || contieneNumero(FirstName)|| contieneNumero(LastName)) {
            alert("The name or last name are invalid");
            return false;
        }
        if (NewPassword.length < 8) {
            alert("Password must be at least 8 characters long.");
            return false;
        }
        if(CurrentUserData.UserPassword != OldPassword) {
            alert('Incorrect password');
            return;
        }
        if(NewPassword != ConfirmPassword){
            alert('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('/UpdateUserPersonalInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UserData),
            });
            const result = await response.json();
            console.log(result.success);
            if(result.success) {
                alert('Personal information updated successfully');
            } else {
                alert('Error updating personal information');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating personal information');
        }
        
    }

    function contieneSimbolosEspeciales(str) {
        const regex = /[^a-zA-Z0-9 ]/;  
        return regex.test(str);  
    }
    
    function contieneNumero(str) {
        const regex = /\d/;  
        return regex.test(str);  
    }

        

    confirmButtonPersonalInfo.addEventListener('click', updatePersonalInfo);
    
    

    async function userHaveAccount(UserID) {
        try {
            const response = await fetch('/GetBankAccountsList');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            const isOnList = data.some(account => account.UserID == UserID);
            if (isOnList) {
                confirmButtonPaymentInfo.textContent = 'Update Account Info';   
                accountNumberField.disabled = true;
                return true;
            } else {
                confirmButtonPaymentInfo.textContent = 'Add Account';
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while checking if user is on list');
            return false;
        }
    }
    
    async function loadPaymentData(UserID) {
        const isOnList = await userHaveAccount(UserID);
        if(!isOnList) {

            return;
        }
        const UserData = {
            UserID: UserID
        };
        try {
            const response = await fetch('/GetPaymentDataByID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(UserData),
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            if (data) {
                accountNumberField.value = data.AccountNumer;
                cardNumberField.value = data.UserCardNumber;
                const expirationDate = new Date(data.UserCardExpirationDate);
                const formattedExpirationDate = `${expirationDate.getFullYear()}-${(expirationDate.getMonth() + 1).toString().padStart(2, '0')}-${expirationDate.getDate().toString().padStart(2, '0')}`;
                expirationDateField.value = formattedExpirationDate;
                securityNumberField.value = data.UserCardSecurityNumber;
                //return data.UserPassword;
            } else {
                alert('Payment info not found');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while getting the payment info');
            return;
        }
    }

    function isValidDate(yyyyMmDd) {
        const [year, month, day] = yyyyMmDd.split('-').map(Number);
    
        // Check for invalid month or day range
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }
    
        // Check for correct number of days in the month
        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth) {
            return false;
        }
    
        return true;
    }
    
    function isDateInFuture(yyyyMmDd) {
        const enteredDate = new Date(yyyyMmDd);
        const currentDate = new Date();
    
        // Compare the entered date with the current date
        return enteredDate > currentDate;
    }
    
    
    async function updatePaymentInfo() {
        const AccountNumer = accountNumberField.value;
        const CardNumber = cardNumberField.value;
        const ExpirationDate = expirationDateField.value;
        const SecurityNumber = securityNumberField.value;
        const UserData = {
            UserID: UserID,
            AccountNumer: AccountNumer,
            UserCardNumber: CardNumber,
            UserCardExpirationDate: ExpirationDate,
            UserCardSecurityNumber: SecurityNumber
        };

        if (!AccountNumer || !CardNumber || !ExpirationDate || !SecurityNumber) {
            alert("All fields are required.");
            return false;
        }
        if (CardNumber.length != 16) {
            alert("Card number must be 16 digits long.");
            return false;
        }
        if (SecurityNumber.length != 3) {
            alert("Security number must be 3 digits long.");
            return false;
        }
        if (!isValidDate(ExpirationDate)) {
            alert("Invalid date format or the day is not valid for the month.");
            return false;
        }
        if (!isDateInFuture(ExpirationDate)) {
            alert("The expiration date must be in the future.");
            return false;
        }
        
        
        if(await userHaveAccount(UserID)){ //Tiene cuenta -- UPDATE
            try {
                const response = await fetch('/UpdatePaymentInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(UserData),
                }
                );
                const result = await response.json();
                console.log(result);
                if(result) {
                    alert('Payment information updated successfully');
                } else {
                    alert('Error updating payment information');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while updating payment information');
            }
        } else{ //No tiene cuenta -- Insert
            if(await inAccountNumberInUse(AccountNumer)){
                alert('Error Account Number already in use');
                return;
            }
            if(await inCardNumberInUse(CardNumber)){
                alert('Error Card Number already in use');
                return;
            }
            try {
                const response = await fetch('/AddBankAccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'  
                    },
                    body: JSON.stringify(UserData)  
                });
                if (!response.ok) {
                    const errorData = await response.json(); 
                    throw new Error(errorData.error);
                }
                const result = await response.json();  
                alert('Bank Account registered');
                console.log('Response from server:', result);
            } catch (err) {
                console.error('Error creating user:', err.message);  
            }
        }
    }

    
    async function inAccountNumberInUse(accNumber) {
        try {
            const response = await fetch('/GetBankAccountsList');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            const isOnList = data.some(account => account.AccountNumer == accNumber);
            if (isOnList) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while checking if account number is on list');
            return false;
        }
    }
    async function inCardNumberInUse(cardNumber) {
        try {
            const response = await fetch('/GetBankAccountsList');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            const isOnList = data.some(account => account.UserCardNumber == cardNumber);
            if (isOnList) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error while checking if card number is on list');
            return false;
        }
    }
    
    confirmButtonPaymentInfo.addEventListener('click', updatePaymentInfo);
    
    loadPaymentData(UserID);
});

            
