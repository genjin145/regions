var main = document.getElementsByTagName("main")[0],
	p = document.getElementsByTagName("p"),
	td = info.getElementsByTagName("td"),

	date = new Date(),
	search_code;


function convert_hour(gmt) {
	if (date.getUTCHours() + gmt > 24) {
		return date.getUTCHours() + gmt - 24;
	} else {
	   return date.getUTCHours() + gmt;
	} 
}

function set_default() {
	td[0].textContent = db[65].id;
	td[1].textContent = db[65].name;
	td[2].textContent = convert_hour(db[65].time) + ":" + date.getUTCMinutes() + " (GMT +" + db[65].time + ")";
}

set_default();

search.oninput = function() {
	if (this.value.length < 2) {
		search_code = this.value;
	} else {
		search_code = this.value.slice(0, 2);
	}
	
	if (Number(search_code)) {
		date = new Date();
		for (var i = 0; i < db.length; i++) {
			if (result.getAttribute("class") == "show" && search_code == db[i].id) {
				p[i].classList.add("mark");
			} else if (result.getAttribute("class") == "show") {
				p[i].classList.remove("mark");
			}

			if (search_code == db[i].id) {
				td[0].textContent = db[i].id;
				td[1].textContent = db[i].name;
				td[2].textContent = convert_hour(db[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + db[i].time + ")";
			}
		}
	}
	if (search_code == "") {
		set_default();
	}
}
