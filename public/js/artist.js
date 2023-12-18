function follow(artistName) {

    let userID = localStorage.getItem("userID");
    if (userID == null) {
        alert("You are not logged in! This should NEVER happen...");
        return;
    }

    let xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            switch(this.status) {
                case 200:
                    alert(`${this.responseText}`);
                    break;
                default:
                    alert(`Follow failed: ${this.responseText}`);
                    break;
            }
        }
    };

    xhr.open("PUT", `/follow/${userID}/${artistName}`);

    xhr.send();

    
}