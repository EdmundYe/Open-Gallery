function init(){
    document.getElementById("search").onclick = search;
}

function search() {
    console.log("Searching");
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200){
            console.log(this.responseText);
            document.getElementById("results").innerHTML = this.responseText;
        }
    }

    let values = {}
    values.title = document.getElementById("title").value;
    values.artist = document.getElementById("artist").value;
    values.category = document.getElementById("category").value;

    // This block just makes a query string for a URL.
    let queries = [];
    for(key in values){
        if(values[key] != ""){
            queries.push(key + "=" + values[key]);
        }
    }

    let queryString = "";
    if(queries.length > 0){
        queryString = "?" + queries.join("&");
    }

    xhr.open("GET", `http://localhost:3000/artSearch${queryString}`);
    xhr.send();
}