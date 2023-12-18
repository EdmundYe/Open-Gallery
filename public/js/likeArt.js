function loadReviews() {
    // Get the id of the art
    let artID = document.getElementById("id").value;
    console.log(artID);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    reviews = JSON.parse(this.responseText);
                    console.log(reviews);

                    let reviewListElement = document.getElementById("review-list");
                    reviewListElement.innerHTML = "";

                    for (let i = 0; i < reviews.length; i++) {
                        let reviewContent = reviews[i].split("|")[1];

                        reviewListElement.innerHTML += `<li>${reviewContent}</li>`;
                    }
                    break;
                default:
                    alert(`Failed to get review list: ${this.responseText}`);
                    break;
            }
        }
    }

    xhr.open("GET", `/getReviews/${artID}`);
    xhr.send();
}

function likeArt(){
    // Get the id of the art
    let artID = document.getElementById("id").value;
    console.log(artID);

    // Get User ID
    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    // Send a put request to /likeArt
    let req = new XMLHttpRequest();
    req.open("PUT", `/Art/${userID}/${artID}`);
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
        if (this.readyState==4 && this.status==200) {
            console.log("Art liked");
        } else {
            console.log("Error in network request: " + req.statusText);
        }
    });
    req.send();
}

function reviewArt(){
    // Get the id of the art
    let id = document.getElementById("id").value;
    console.log(id);
    
    // Get the review
    let review = document.getElementById("review").value;

    // Get User ID
    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    // Send a POST request to /reviewArt/:userID/:artID

    let xhr = new XMLHttpRequest();
    xhr.open("POST", `/reviewArt/${userID}/${id}`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`);
                    break;
                default:
                    alert(`Failed to add review: ${this.responseText}`);
                    break;
            }
        }
    }
    xhr.send(JSON.stringify({
        review: review
    }));
}