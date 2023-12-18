function main() {
    if (localStorage.getItem("userID") != null) {
        window.location.href = "/user";
    }
}

function login(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let data = {
        username: username,
        password: password
    }
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            let response = JSON.parse(this.responseText);

            localStorage.setItem("userID", response.userID);
            localStorage.setItem("userType", response.userType);

            // redirect to new item page
            if (response.userType) {
                window.location.href = `/artistUser`;
            } else {
                window.location.href = `/user`;
            }
        }
        else if(this.readyState==4 && this.status==400){
            alert(`Login Failed: ${this.responseText}`);
        }
    }
    xhr.open("POST", `/login`);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    console.log("Request sent.")
}