followingList = [];

function followingMain() {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    followingList = JSON.parse(this.responseText);
                    console.log(followingList);

                    let followingListElement = document.getElementById("following-list");
                    followingListElement.innerHTML = "";

                    for (let i = 0; i < followingList.length; i++) {
                        followingListElement.innerHTML += `<li><a href="/artists/${followingList[i]}">${followingList[i]}</a></li>`;
                    }
                    break;
                default:
                    alert(`Failed to get following list: ${this.responseText}`);
                    break;
            }
        }
    }

    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    xhr.open("GET", `/getFollowing/${userID}`);
    xhr.send();
}

followingMain();