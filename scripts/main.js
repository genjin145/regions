var main = document.getElementsByTagName("main")[0],
    map = document.getElementsByClassName("map")[0],
    result = document.getElementsByClassName("result")[0],
    p = document.getElementsByTagName("p"),

    date = new Date(),
    maxResult = 5,
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

function writeResult(where, what, howMuch) {
  function wrapper(i) {
    let resultTemplate = document.getElementsByClassName("result-template")[0].content.cloneNode(true);
  
    where.appendChild(resultTemplate);

    let info = result.getElementsByClassName("info")[i],
        td = info.getElementsByTagName("td");

    td[0].textContent = what[i].id;
    td[1].textContent = what[i].name;
    td[2].textContent = convert_hour(what[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + what[i].time + ")";
  }

  if (Array.isArray(what)) {
    if (!howMuch) {
      howMuch = what.length;
    }
    for (let i = 0; i < what.length && i < howMuch; i++) {
      wrapper(i);
    }
  } else if (typeof what == "object") {
    what = [what];
    wrapper(0);
  }
}

function set_default() {
  clearResult();
  writeResult(result, db);
}

map.onmouseover = function(evt) {
  let lostColor;
  if (evt.target.tagName == "path") {
    lostColor = evt.target.style.fill;
    evt.target.style.fill = "rgba(0, 0, 0, 0.2)";
    for (let i = 0; i < db.length; i++) {
      if (evt.target.id == db[i].textId) {
        search.value = db[i].name;
        search.oninput();
        break;
      } else {
        search.value = evt.target.id;
      }
    }
    
    console.log(evt.target.id);
    evt.target.onmouseout = function() {
      this.style.fill = lostColor;
      // console.log("wow");
    }
  }
}

function clearMap() {
  let path = map.getElementsByTagName("path");
  for (let i = 0; i < path.length; i++) {
    path[i].style.fill = "transparent";
  }
}

search.oninput = function() {
  searchReg = this.value;

  if (Number(searchReg.slice(0, 2))) {
    searchReg = Number(searchReg.slice(0, 2));
    arrReg = [];
    for (let i = 0; i < db.length; i++) {
      if (~db[i].id.toString().indexOf(searchReg)) {
        arrReg.push({
          id: db[i].id,
          name: db[i].name,
          time: db[i].time
        });
      }
    }
    clearResult();
    writeResult(result, arrReg, maxResult);
  }

  if (typeof searchReg == "string") {
    arrReg = [];
    for (let i = 0; i < db.length; i++) {
      if (~db[i].name.toLowerCase().indexOf(searchReg.toLowerCase())) {
        arrReg.push({
          id: db[i].id,
          textId: db[i].textId,
          name: db[i].name,
          time: db[i].time
        });
      }
    }
    clearResult();
    writeResult(result, arrReg);
    
    clearMap();
    for (let i = 0; i < arrReg.length; i++) {
      if (arrReg[i].textId) {
        let path = document.querySelector("#" + arrReg[i].textId);
        console.log(arrReg[i].textId);
        path.style.fill = "red";
      }
      
    }
  }

  if (searchReg == "") {
    clearResult();
    clearMap();
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

writeResult(result, db[76]);

// var a = document.querySelectorAll("path");
// for (let i = 0; i < a.length; i++) {
//   document.write('"textId": "' + a[i].id + '",<br>');
// }

// 1) Интерактивная карта.
//     при hover подсвечиается и выходит tooltip с наименованием области
//     при click заполняется поиск, показывается инфа
    
//     3 цвета региона на карте: 
//         1. не активный (белый)
//         2. при hover (более темный оттенок от исходного цвета)
//         3. при click (зеленый)

// 2) Поиск и таблица результатов
//     отображание на карте происходит при input (отображаются все регионы)
//     при нажатии на ячейку подсвечивается только одна область и подсвечивается сама строка в таблице, при повторном нажатии все возвращается на круги своя (подсвечиваются все результаты)

//     поиск по коду региона
//         вывести все совпадения по id
//     поиск по наименованию региона
//         вывести все совпадения по name