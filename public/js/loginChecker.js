function CheckIfUserIsLoggedIn() {
    let userID = localStorage.getItem("userID");

    if (userID == null) {
        alert("You are not logged in.");
        window.location.href = "/";
    }

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    break;
                default:
                    alert(`You are not logged in!`);
                    localStorage.removeItem("userID");
                    window.location.href = "/";
                    break;
            }
        }
    }

    xhr.open("GET", `/isUserLoggedIn/${userID}`);
    xhr.send();
}

CheckIfUserIsLoggedIn();