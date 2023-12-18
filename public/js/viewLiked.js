likedList = []

function likedMain() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    likedList = JSON.parse(this.responseText);
                    console.log(likedList);

                    let likedListElement = document.getElementById("liked-list");
                    likedListElement.innerHTML = "";

                    for (let i = 0; i < likedList.length; i++) {
                        likedListElement.innerHTML += `<li><a href="/artByName/${likedList[i]}">${likedList[i]}</a></li>`;
                    }
                    break;
                default:
                    alert(`Failed to get liked list: ${this.responseText}`);
                    break;
            }
        }
    }

    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    xhr.open("GET", `/getLiked/${userID}`);
    xhr.send();
}

likedMain();