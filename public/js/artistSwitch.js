function switchToPatron(){
    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `/switchToPatron/${userID}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`);
                    window.location.href = `/user`
                    break;
                default:
                    alert(`Failed to switch to patron: ${this.responseText}`);
                    break;
            }
        }
    }
    xhr.send();
}