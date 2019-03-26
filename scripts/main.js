var main = document.getElementsByTagName("main")[0],
  result = document.getElementsByClassName("result")[0],
  p = document.getElementsByTagName("p"),

  date = new Date(),
  arrReg = [],
  searchReg;

var buttonAllResult = document.getElementsByClassName("button-all-result")[0];

function convert_hour(gmt) {
  if (date.getUTCHours() + gmt > 24) {
    return date.getUTCHours() + gmt - 24;
  } else {
     return date.getUTCHours() + gmt;
  } 
}

function clearResult() {
  result.innerHTML = "";
}

function set_default() {
  clearResult();

  for (let i = 0; i < db.length; i++) {
    let resultTemplate = document.getElementsByClassName("result-template")[0].content.cloneNode(true);

    result.appendChild(resultTemplate);

    let info = result.getElementsByClassName("info")[i],
      td = info.getElementsByTagName("td");
    
    td[0].textContent = db[i].id;
    td[1].textContent = db[i].name;
    td[2].textContent = convert_hour(db[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + db[i].time + ")";
  }
}

search.oninput = function() {
  searchReg = this.value;

  if (Number(searchReg.slice(0, 2))) {
    searchReg = Number(searchReg.slice(0, 2));
    clearResult();
    for (let i = 0; i < db.length; i++) {
      if (searchReg == db[i].id) {
        let resultTemplate = document.getElementsByClassName("result-template")[0].content.cloneNode(true);

        result.appendChild(resultTemplate);

        let info = result.getElementsByClassName("info")[0],
          td = info.getElementsByTagName("td");
    
        td[0].textContent = db[i].id;
        td[1].textContent = db[i].name;
        td[2].textContent = convert_hour(db[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + db[i].time + ")";
      }
    }
  }

  if (typeof searchReg == "string") {
    arrReg = [];
    for (let i = 0; i < db.length; i++) {
      if (~db[i].name.toLowerCase().indexOf(searchReg.toLowerCase())) {
        arrReg.push({
          id: db[i].id,
          name: db[i].name,
          time: convert_hour(db[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + db[i].time + ")"
        });
      }
    }
    clearResult();
    for (let i = 0; i < arrReg.length; i++) {
      let resultTemplate = document.getElementsByClassName("result-template")[0].content.cloneNode(true);

      result.appendChild(resultTemplate);

      let info = result.getElementsByClassName("info")[i],
          td = info.getElementsByTagName("td");
  
      td[0].textContent = arrReg[i].id;
      td[1].textContent = arrReg[i].name;
      td[2].textContent = arrReg[i].time;
    }
  }

  if (searchReg == "") {
    clearResult();
  }
}

buttonAllResult.onclick = function() {
  if (this.classList.contains("active")) {
    this.textContent = this.dataset.text;
    clearResult();
    
  } else {
    this.textContent = this.dataset.secondText;
    set_default();
  }
  this.classList.toggle("active");
}

// 1) вводится строка в input, value присваиваются в переменную searchReg
// 2) если searchReg число, то поиск по id
// 3) если searchReg слово, то поиск по name

// вывод результатов максимально 4 шт
