var main = document.getElementsByTagName("main")[0],
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
    console.log(what);
    wrapper(0);
  }
}

function set_default() {
  clearResult();
  writeResult(result, db);
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
          name: db[i].name,
          time: db[i].time
        });
      }
    }
    clearResult();
    writeResult(result, arrReg);
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

writeResult(result, db[76]);