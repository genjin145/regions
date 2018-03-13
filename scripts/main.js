var main = document.getElementsByTagName("main")[0],
    p = document.getElementsByTagName("p");

for (var i = 0; i < db.length; i++) {
    main.appendChild(document.createElement("p"));
    
    p[i].textContent = db[i].name;
}