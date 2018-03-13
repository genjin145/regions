var main = document.getElementsByTagName("main")[0],
    p = document.getElementsByTagName("p"),
    td = info.getElementsByTagName("td"),

    date = new Date();


show_all.onclick = function() {
    result.classList.toggle("hide");
    if (result.getAttribute("class") == "hide") {
        this.textContent = "Скрыть все регионы";
        result.style.display ="block";
        for (var i = 0; i < db.length; i++) {
            result.appendChild(document.createElement("p"));
            p[i].textContent = db[i].id + " - " + db[i].name;
        }
    } else {
        this.textContent = "Показать все регионы";
        result.style.display ="none";
    }
}

function convert_hour(gmt) {
    if (date.getUTCHours() + gmt > 24) {
        return date.getUTCHours() + gmt - 24;
    } else {
       return date.getUTCHours() + gmt;
    } 
}

search.oninput = function() {
    date = new Date();
    for (var i = 0; i < db.length; i++) {
        if (this.value == db[i].id) {
            td[0].textContent = db[i].id;
            td[1].textContent = db[i].name;
            td[2].textContent = convert_hour(db[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + db[i].time + ")";
        }
    }
    
}
