let main = document.getElementsByTagName("main")[0],
    map = document.getElementsByClassName("map")[0],
    result = document.getElementsByClassName("result")[0],
    p = document.getElementsByTagName("p"),

    date = new Date(),
    maxResult = 5,
    arrReg = [],
    searchReg;

let buttonAllResult = document.getElementsByClassName("button-all-result")[0];

function prepareArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].id = arr[i].id.toString();
    if (arr[i].id.length == 1) {
      arr[i].id = "0" + arr[i].id;
    }
    for (let j = i; j < arr.length - 1; j++) {
      if (arr[i].name == arr[j + 1].name) {
        arr[i].id += ", " + arr[j + 1].id;
        arr.splice(j + 1, 1);
      }
    }
  }
}

function convertHour(gmt) {
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

    let resulRow = result.getElementsByClassName("result__row")[i],
        resultId = resulRow.getElementsByClassName("result__id")[0],
        resultName = resulRow.getElementsByClassName("result__name")[0],
        resultTime = resulRow.getElementsByClassName("result__time")[0];

    resultId.textContent = what[i].id;
    resultName.textContent = what[i].name;
    resultTime.textContent = convertHour(what[i].time) + ":" + date.getUTCMinutes() + " (GMT +" + what[i].time + ")";
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
      path.style.fill = "#6C757D";
    }
  }
}

function searchOverlap(elem, arr) {
  if (Number(elem.slice(0, 2))) {
    return arr.filter((el) => el.id.indexOf(elem.slice(0, 2)) > -1);
  }
  if (typeof elem == "string") {
    return arr.filter((el) => el.name.toLowerCase().indexOf(elem.toLowerCase()) > -1);
  }
}

map.onmouseover = function(evt) {
  let lostColor;
  if (evt.target.tagName == "path") {
    lostColor = evt.target.style.fill;
    // evt.target.style.fill = "rgba(0, 0, 0, 0.2)";
    evt.target.style.fill = "#E9ECEF";
    evt.target.onmouseout = function() {
      this.style.fill = lostColor;
    }
    evt.target.onclick = function() {
      for (let i = 0; i < db.length; i++) {
        if (evt.target.id == db[i].textId) {
          search.value = db[i].name;
          clearResult();
          writeResult(result, searchOverlap(search.value, db));
          break;
        } else {
          search.value = evt.target.id;
        }
      }
      clearMap();
      this.style.fill = "#6C757D";
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
  // if (this.classList.contains("active")) {
  //   this.textContent = this.dataset.text;
  //   clearResult();
  // } else {
  //   this.textContent = this.dataset.secondText;
  //   setDefault();
  // }
  // this.classList.toggle("active");
  clearResult();
  setDefault();
}

result.onclick = function(evt) {
  let arr = db.filter(elem => elem.name == evt.target.parentNode.getElementsByClassName("result__name")[0].textContent);
  if (arr.length > 0) {
    search.value = arr[0].name;
    clearMap();
    fillRegionMap(arr);
    window.location.assign("#map");
  }
}

document.onmousemove = function(evt) {
  let tooltipRegion = document.getElementsByClassName("tooltip-region")[0];
  tooltipRegion.classList.add("hidden");
  for (let i = 0; i < db.length; i++) {
    if (evt.target.id == db[i].textId) {
      tooltipRegion.classList.remove("hidden");
      tooltipRegion.textContent = db[i].name;
      break;
    }
  }
  tooltipRegion.style.left = evt.clientX + "px";
  tooltipRegion.style.top = evt.clientY + window.pageYOffset + 30 + "px";
}

prepareArray(db);

let btnPlus = document.getElementsByClassName("map__button-plus")[0],
    btnMinus = document.getElementsByClassName("map__button-minus")[0];

let b = map.getBBox();

let rMap = {
  x: b.x,
  y: b.y,
  width: 680,
  height: 400,
  size: 100,
  maxSize: 200,
  minSize: 100,
  stepSize: 10,
};

rMap.drow = function() {
  map.setAttribute("viewBox", `${this.x} ${this.y} ${this.width} ${this.height}`);
}
rMap.drow();
rMap.zoomPlus = function(step) {
  this.size -= step;
  if (this.size > this.maxSize) {
    this.size = this.maxSize;
  }
  this.width = this.width * (this.size / 100);
  this.height = this.height * (this.size / 100);
  rMap.drow();
}

rMap.zoomMinus = function(step) {
  this.size += step;
  if (this.size < this.minSize) {
    this.size = this.minSize;
  }
  this.width = this.width * (this.size / 100);
  this.height = this.height * (this.size / 100);
  rMap.drow();
}

map.onmousedown = function(evt) {
  let start = {
    x: evt.clientX,
    y: evt.clientY
  };

  function onMouseMove(evt) {
    let shift = {
      x: start.x - evt.clientX,
      y: start.y - evt.clientY,
    };
    start = {
      x: evt.clientX,
      y: evt.clientY
    };
    console.log(b.x);
    rMap.x += shift.x;
    rMap.y += shift.y;
    if (rMap.x < 0) {
      rMap.x = 0;
    }
    if (rMap.x > rMap.width * rMap.size / 100) {
      rMap.x = rMap.width * rMap.size / 100;
    }
    if (rMap.y < 0) {
      rMap.y = 0;
    }
    if (rMap.y > rMap.height / rMap.size * 100) {
      rMap.y = rMap.height / rMap.size * 100;
    }
    rMap.drow();
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
  
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}

map.onwheel = function(evt) {
  evt.preventDefault();
  if (evt.deltaY < 0) {
    rMap.zoomPlus(10);
  }
  if (evt.deltaY > 0) {
    rMap.zoomMinus(10);
  }
  this.style.width = rMap.size + "%";
  // console.log(evt);
}

btnPlus.onclick = function() {
  rMap.zoomPlus(25);
  // map.style.width = rMap.size + "%";
}

btnMinus.onclick = function() {
  rMap.zoomMinus(25);
  // map.style.width = rMap.size + "%";
}
// Баг с омской обл
// map

