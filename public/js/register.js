function register(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let data = {
        username: username,
        password: password
    };

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState==4 && this.status==201){
            let response = JSON.parse(this.responseText);

            localStorage.setItem("userID", response.userID);

            // redirect to user page
            window.location.href = `/user`;
        }
        else if(this.readyState==4 && this.status==400){
            alert("Username already taken.");
        }
    }
    xhr.open("POST", `/register`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    console.log("Request sent.")
}