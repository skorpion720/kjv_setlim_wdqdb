//window.intelserv = window.intelserv || {};
//window.intelserv.updateset = false;
var updateset = JSON.parse(localStorage.getItem("updateset"));
if (updateset === null) {
  updateset = false;
  saveToLocalStorage();
}
function saveToLocalStorage() {
  localStorage.setItem("updateset", JSON.stringify(updateset));
}
var checkreg = JSON.parse(localStorage.getItem("checkreg"));
checkreg = 1;
if (checkreg === null) {
  checkreg = 1;
  saveToLocalStorageREG();
}
function saveToLocalStorageREG() {
  localStorage.setItem("checkreg", JSON.stringify(checkreg));
}
var fiotg = JSON.parse(localStorage.getItem("fiotg"));
if (fiotg === null) {
  fiotg = false;
  fiotgsave();
}
function fiotgsave() {
  localStorage.setItem("fiotg", JSON.stringify(fiotg));
}

var sipnumber = JSON.parse(localStorage.getItem("sipnumber"));
if (sipnumber === null) {
  sipnumber = false;
  sipnumbersave();
}
function sipnumbersave() {
  localStorage.setItem("sipnumber", JSON.stringify(sipnumber));
}

var starttelfs = JSON.parse(localStorage.getItem("starttelfs"));
if (starttelfs === null) {
  starttelfs = 0;
  sstarttelfssave();
}
function sstarttelfssave() {
  localStorage.setItem("starttelfs", JSON.stringify(starttelfs));
}

var offrellfs = JSON.parse(localStorage.getItem("offrellfs"));
if (offrellfs === null) {
  offrellfs = 0;
  offrellfsssave();
}
function offrellfsssave() {
  localStorage.setItem("offrellfs", JSON.stringify(offrellfs));
}

var onoffstarts = JSON.parse(localStorage.getItem("onoffstarts"));
if (onoffstarts === null) {
  onoffstarts = 12;
  onoffstartsave();
}
function onoffstartsave() {
  localStorage.setItem("onoffstarts", JSON.stringify(onoffstarts));
}
