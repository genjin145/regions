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

function setDefault() {
  clearResult();
  writeResult(result, db);
}

function clearMap() {
  let path = map.getElementsByTagName("path");
  for (let i = 0; i < path.length; i++) {
    path[i].style.fill = "transparent";
  }
}

function fillRegionMap(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].textId) {
      let path = document.querySelector("#" + arr[i].textId);
      path.style.fill = "#343A40";
    }
  }
}

function searchOverlap(elem, arr) {
  if (Number(elem.slice(0, 2))) {
    return arr.filter((el) => {
      if (el.id.toString().length == 1) {
        el.id = "0" + el.id.toString();
      } 
      return el.id.toString().indexOf(elem.toString().slice(0, 2)) > -1;
    });
  }
  if (typeof elem == "string") {
      return arr.filter((el) =>
      el.name.toLowerCase().indexOf(elem.toLowerCase()) > -1
    );
  }
}

map.onmouseover = function(evt) {
  let lostColor;
  if (evt.target.tagName == "path") {
    lostColor = evt.target.style.fill;
    evt.target.style.fill = "rgba(0, 0, 0, 0.2)";
    evt.target.onmouseout = function() {
      this.style.fill = lostColor;
      // console.log("wow");
    }
    evt.target.onclick = function() {
      for (let i = 0; i < db.length; i++) {
        if (evt.target.id == db[i].textId) {
          search.value = db[i].name;
          clearResult();
          writeResult(result, searchOverlap(search.value, db));
          // search.oninput();
          break;
        } else {
          search.value = evt.target.id;
        }
      }
      clearMap();
      this.style.fill = "#343A40";
      lostColor = this.style.fill;
    }
  }
}

search.oninput = function() {
  searchReg = this.value;
  arrReg = searchOverlap(searchReg, db);

  clearResult();
  writeResult(result, arrReg);

  clearMap();
  fillRegionMap(arrReg);

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
    setDefault();
  }
  this.classList.toggle("active");
}

writeResult(result, db[76]);

document.onmousemove = function(evt) {
  let tooltipRegion = document.getElementsByClassName("tooltip-region")[0];
  tooltipRegion.classList.add("hidden");
  for (let i = 0; i < db.length; i++) {
    if (evt.target.id == db[i].textId) {
      tooltipRegion.classList.remove("hidden");
      tooltipRegion.textContent = db[i].name;
      // search.oninput();
      break;
    }
  }
  tooltipRegion.style.left = evt.clientX + "px";
  tooltipRegion.style.top = evt.clientY + window.pageYOffset + 30 + "px";
}

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