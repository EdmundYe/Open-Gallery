function uploadArt(){
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;
    let category = document.getElementById("category").value;
    let medium = document.getElementById("medium").value;
    let description = document.getElementById("description").value;
    let poster = document.getElementById("poster").value;

    let data = {
        title: title,
        year: year,
        category: category,
        medium: medium,
        description: description,
        poster: poster
    }

    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `/uploadArt/${userID}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`);
                    break;
                default:
                    alert(`Failed to add artwork: ${this.responseText}`);
                    break;
            }
        }
    }
    xhr.send(JSON.stringify(data));
}