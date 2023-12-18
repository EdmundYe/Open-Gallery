function sendLogoutRequest() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`)
                    localStorage.removeItem("userID");
                    window.location.href = "/";
                    break;
                default:
                    alert(`Logout failed: ${this.responseText}`);
                    localStorage.removeItem("userID");
                    window.location.href = "/";
                    break;
            }
        }
    };
    
    let userID = localStorage.getItem("userID");

    if (userID == null) {
        alert("You are not logged in.");
        return;
    }

    xhr.open("PUT", `/logout/${userID}`);

    xhr.send();
}