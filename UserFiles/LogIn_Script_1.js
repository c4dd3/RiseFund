function Login(){
    const email = document.getElementById("LoginEmail").value;
    const password = document.getElementById("LoginPassword").value;
    console.log("User Email: " + email);
    console.log("User Password: " + password);
    if(email == "jfeng@estudiantec.cr" && password == 123){
        console.log("Granted");
        window.location.href = 'MainMenu.html';
    } else {
        console.log("Denied");
    }
}