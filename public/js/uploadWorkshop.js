function uploadWorkshop(){
    let title = document.getElementById("title").value;

    let data = {
        title: title
    }

    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `/postWorkshop/${userID}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`);
                    break;
                default:
                    alert(`Failed to add workshop: ${this.responseText}`);
                    break;
            }
        }
    }
    xhr.send(JSON.stringify(data));
}