function switchToArtist() {
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

    console.log(data);

    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    // create a post request to /switchToArtist to add new artwork and update the user to an artist
    let xhr = new XMLHttpRequest();
    xhr.open("POST", `/postArt/${userID}`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`);
                    window.location.href = `/artistUser`
                    break;
                default:
                    alert(`Failed to add artwork: ${this.responseText}`);
                    break;
            }
        }
    }

    xhr.send(JSON.stringify(data));
}
