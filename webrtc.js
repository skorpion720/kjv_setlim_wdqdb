$(document).ready(function () {
  check_init_conf();
  if (oSipSessionCall === null || oSipSessionCall === undefined) {
    if (fiotg == false || fiotg == undefined) {
      getAccess();
    }
  }
  if (oSipSessionCall === null || oSipSessionCall === undefined) {
    if (sipnumber == false || sipnumber == undefined) {
      getAccess();
    }
  }
});

let crm = JSON.parse(localStorage.getItem("crm"));
let crm7 = JSON.parse(localStorage.getItem("crm7"));
let crm8 = JSON.parse(localStorage.getItem("crm8"));
let crm9 = JSON.parse(localStorage.getItem("crm9"));
let crm10 = JSON.parse(localStorage.getItem("crm10"));
let crm11 = JSON.parse(localStorage.getItem("crm11"));

var audioRemote;
var txtMuteCallStatus = "<b>Mute</b>";
var SoundTogle = JSON.parse(localStorage.getItem("SoundTogle"));
if (SoundTogle === null) {
  SoundTogle = 1;
  SaveSTogle();
}
// 0 - тихо 1 - голосно
function SaveSTogle() {
  localStorage.setItem("SoundTogle", JSON.stringify(SoundTogle));
}
//console.log('SoundTogle   '+SoundTogle)

var SoundToglekl = JSON.parse(localStorage.getItem("SoundToglekl"));
if (SoundToglekl === null) {
  SoundToglekl = 1;
  SaveSToglekl();
}
function SaveSToglekl() {
  localStorage.setItem("SoundToglekl", JSON.stringify(SoundToglekl));
}

//console.log('SoundToglekl   '+SoundToglekl)

//проверка конфигруации каждые 100 тактов
function check_init_conf() {
  //  console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-');

  var requiredKeys = [
    "EXTENSION_NUMBER",
    "DISPLAY_NAME",
    "PASSWORD",
    "SERVER",
    "WSS_SERVER",
    "HTTP_PORT",
    "CA_AUTO_ANSWER",
    "CA_DND",
    "CA_PREFIX",
  ];
  chrome.storage.sync.get(requiredKeys, function (_data) {
    sip_uri = "sip:" + _data.EXTENSION_NUMBER + "@" + _data.SERVER;
    sip_extension = _data.EXTENSION_NUMBER;
    sip_password = _data.PASSWORD;
    ws_port = _data.WSS_SERVER;
    http_port = _data.HTTP_PORT;
    display_name = _data.DISPLAY_NAME;
    sip_server = _data.SERVER;
    sipnumber = _data.EXTENSION_NUMBER;
    sipnumbersave();

    ws_servers = "wss://" + sip_server + ":" + ws_port + "/ws";
    ext = sip_extension;

    localStorage.setItem("extension", sip_extension);
    localStorage.setItem("sip_server", sip_server);
    localStorage.setItem("http_port", http_port);
    // auto_answer = _data.CA_AUTO_ANSWER;
    // do_not_disturb = _data.CA_DND;
    // ca_prefix = _data.CA_PREFIX;
    //   console.log("credentials:" + sip_uri + ":" + ws_servers + ":" + sip_extension + ":" + sip_password + ":" + ws_servers + ":" + sip_server);
    if (
      !isEmpty(_data.EXTENSION_NUMBER) &&
      !isEmpty(_data.SERVER) &&
      !isEmpty(_data.WSS_SERVER) &&
      !isEmpty(_data.DISPLAY_NAME)
    ) {
      setTimeout(function () {
        //registerInit();
        chrome.runtime.sendMessage(
          { action: "config", cause: "registerFail" }
          // function (response) {}
        );
      }, 10);
    } else {
      setTimeout(function () {
        check_init_conf();
      }, 100);
    }
  });
}

let startTime;
let secondsss;
let minutesss;
function startTimer() {
  startTime = new Date();
}

function stopTimer() {
  if (startTime) {
    const endTime = new Date();
    const elapsedTimeMilliseconds = endTime - startTime;
    const elapsedTimeSeconds = elapsedTimeMilliseconds / 1000;
    secondsss = elapsedTimeSeconds % 60;
    minutesss = Math.floor(elapsedTimeSeconds / 60);
    startTime = null;
  }
}

let idmessagetg = 0;
let tgmessage = 0;
const botToken = JSON.parse(localStorage.getItem("bottoken"));
const chatId = "-1002027120281";
//var chatId = 0;
let reply_to_message_id = 0;
var disablelog = 1;

function sendTelegramMessage(reply_to_message_id, messageText) {
  const encodedMessage = encodeURIComponent(messageText);
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&reply_to_message_id=${reply_to_message_id}&text=${encodedMessage}`;

  if (messageText != 0 && reply_to_message_id != 0) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        idmessagetg = data.result.message_id;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function editTelegramMessage(reply_to_message_id, messageText, idmessagetg) {
  const encodedMessage = encodeURIComponent(messageText);
  const url = `https://api.telegram.org/bot${botToken}/editMessageText?chat_id=${chatId}&reply_to_message_id=${reply_to_message_id}&message_id=${idmessagetg}&text=${encodedMessage}`;

  if (messageText != 0 && idmessagetg != 0 && reply_to_message_id != 0) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        idmessagetg = 0;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}


function sendtglog(a){
  setTimeout(function () {
    console.log("disablelog" + disablelog);
    if (phoneinc != 0 && disablelog == 1) {

      reply_to_message_id = 48186;
      tgmessage =
        "🤨" +
        fiotg +
        " " +
        sipnumber +
        "\n" +
        "Відхилив вхідний дзвінок " +
        "\n" +
        "😡" +
        phoneinc +
        "\n" +
        a;
      sendTelegramMessage(reply_to_message_id, tgmessage);
      kate(sipnumber,phoneinc,a);
      tgmessage = 0;
      reply_to_message_id = 0;
      phoneinc = 0;
      disablelog = 1;
      a = 0;
    } else{
      disablelog = 1;
    }
  }, 3000);
}

function kate(sipnumber,phoneinc,a){
  if(phoneinc.length > 5){
  $.ajax({
    url: crm7,
    type: "POST",
    data: { step: 3, a: sipnumber, b: phoneinc, c: a },
    success: function (data) {
      data = $.parseJSON(data);
      if(data.code == 200){
        tgmessage = "Пропущений додано у звіт)"
        reply_to_message_id = 48186;
        sendTelegramMessage(reply_to_message_id, tgmessage);
        tgmessage = 0;
        reply_to_message_id = 0;
      }

    }
    });
  }
}


setInterval(function () {
  var phoneStat = localStorage.getItem("phoneStatus");
  if (phoneStat == 200) {
    checkreg = 1;
    saveToLocalStorageREG();
  } else {
    checkreg = 0;
    saveToLocalStorageREG();
  }
}, 2000);

var cheater = JSON.parse(localStorage.getItem("cheater"));
var newCheaterValue = cheater;
setInterval(function () {
  if (oSipSessionCall === null || oSipSessionCall === undefined) {
    cheater = 0;
  } else {
    cheater = 1;
  }
  if (cheater !== newCheaterValue) {
    cheaterSave();
    newCheaterValue = cheater;
  }
}, 5000);
function cheaterSave() {
  localStorage.setItem("cheater", JSON.stringify(cheater));
}

var reg = 0;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "change_config") {
    if (request.cause === "addAcc") {
      console.log("--------------------------------change_config");
      reg = 1;
      //sipUnRegister();
      // check_init_conf();
      // btnCall();
      window.location.reload();
    }
    if (request.cause === "removeAcc") {
      reg = 0;
      sipUnRegister();
    }
  }
  if (request.type === "miscall_historyLog") {
    setTimeout(function () {
      chrome.runtime.sendMessage({
        action: "miscallHistory",
        remoteNumber: misscallLog,
        remoteDate: misscallLogDate,
        remoteTime: misscallLogTime,
      });
    }, 1000);
  }
  if (request.type === "offrellfs") {
    offrellfs = request.value;
  }
  if (request.type === "SoundTogle") {
    SoundTogle = request.value;
  }

  if (request.type === "SoundToglekl") {
    SoundToglekl = request.value;
    if (oSipSessionCall != null || oSipSessionCall != undefined) {
      if (txtMuteCallStatus === "<b>UnMute</b>") {
        if (SoundToglekl == 1) {
          audioRemote.play();
          console.log("audioRemote.play();");
          console.log(audioRemote);
        } else {
          audioRemote.pause();
          console.log("audioRemote.pause();");
          console.log(audioRemote);
        }
      }
    }
  }

  if (request.type === "btnOnOffState") {
    console.log(
      "---0-0-0-0-00--------- " + localStorage.getItem("phoneStatus")
    );
    var phoneStat = localStorage.getItem("phoneStatus");

    if (phoneStat == 200) {
      sipUnRegister();
      localStorage.setItem("phoneStatus", 500);
      chrome.browserAction.setBadgeText({ text: "off" });
      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });

      //  console.log(phoneStat);
      // checkreg = 0;
    } else if (phoneStat == 500) {
      checkreg = 1;
      saveToLocalStorageREG();

      chrome.browserAction.setBadgeText({ text: "on" });
      chrome.browserAction.setBadgeBackgroundColor({ color: [3, 125, 14, 1] });
      localStorage.setItem("phoneStatus", 200);
      check_init_conf();
      btnCall();

      console.log(phoneStat);
    }
  }

  // console.log('on foff state');
});

var asterisk_extension_password;
var asterisk_server_ip;

var TransferNumber;
var oRingTone, oRingbackTone;
var oSipStack, oSipSessionRegister, oSipSessionCall, oSipSessionTransferCall;
var videoRemote, videoLocal;
var bFullScreen = false;
var oNotifICall;
var bDisableVideo = false;
var viewVideoLocal, viewVideoRemote, viewLocalScreencast; // <video> (webrtc) or <div> (webrtc4all)
var oConfigCall;
var oReadyStateTimer;
var txtIncmngCallStatus;
var hangup_channel;
var redirect_channel;
var asterisk_extension;

var secondsLabel;
var mincolsecLabel;
var minutesLabel;
var userInfo;
var taskId;

var totalSeconds = 0;
var is_user_available = 1;

C = {
  divKeyPadWidth: 220,
};

window.onload = function () {
  // if (starttelfs == 1) {
  //  btnCall();
  // } else {
  //   setTimeout(function () {
  console.log("<b>Не увімкнутий автозапуск</b>");
  localStorage.setItem("phoneStatus", 500);
  chrome.browserAction.setBadgeText({ text: "off" });
  chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });

  if (cheater === 1) {
    reply_to_message_id = 11659;
    tgmessage =
      "😡 " +
      fiotg +
      " " +
      sipnumber +
      "\n" +
      "Вимикав телефон (Розширення) під час вхідного двізка, або активного вхідного дзвінка" +
      "\n" +
      "😡😡😡";
    sendTelegramMessage(reply_to_message_id, tgmessage);
    reply_to_message_id = 0;
    tgmessage = 0;
  }
  // }, 200);
  //   }
};

function btnCall() {
  webrtc_click_to_call("9664858334");
}

function webrtc_click_to_call(number) {
  window.console &&
    window.console.info &&
    window.console.info("location=" + window.location);
  videoLocal = document.getElementById("video_local");
  videoRemote = document.getElementById("video_remote");
  //audioRemote = document.getElementById("audio_remote");
  audioRemote = new Audio();
  audioRemote.autoplay = true;
  audioRemote.setAttribute("id", "audio_remote");
  console.log("Ініціалізація аудіо...");
  audioRemote.onloadedmetadata = function () {
    if (audioRemote.paused) {
      audioRemote = new Audio();
      audioRemote.autoplay = true;
    } else {
      console.log(" Ініціалізація аудіо успішна...");
    }
  };

  console.log("webrtc click to call!:" + asterisk_server_ip);
  loadCredentials();
  loadCallOptions();
  uiBtnCallSetText("Call");

  var getPVal = function (PName) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === PName) {
        return decodeURIComponent(pair[1]);
      }
    }
    return null;
  };

  var preInit = function () {
    // set default webrtc type (before initialization)
    var s_webrtc_type = getPVal("wt");
    var s_fps = getPVal("fps");
    var s_mvs = getPVal("mvs"); // maxVideoSize
    var s_mbwu = getPVal("mbwu"); // maxBandwidthUp (kbps)
    var s_mbwd = getPVal("mbwd"); // maxBandwidthUp (kbps)
    var s_za = getPVal("za"); // ZeroArtifacts
    var s_ndb = getPVal("ndb"); // NativeDebug

    if (s_webrtc_type) WebRTC.setWebRtcType(s_webrtc_type);

    // initialize SIPML5
    WebRTC.init(postInit);
    console.log("PostInit Initialize");

    // set other options after initialization
    if (s_fps) WebRTC.setFps(parseFloat(s_fps));
    if (s_mvs) WebRTC.setMaxVideoSize(s_mvs);
    if (s_mbwu) WebRTC.setMaxBandwidthUp(parseFloat(s_mbwu));
    if (s_mbwd) WebRTC.setMaxBandwidthDown(parseFloat(s_mbwd));
    if (s_za) WebRTC.setZeroArtifacts(s_za === "true");
    if (s_ndb == "true") WebRTC.startNativeDebug();
  };

  oReadyStateTimer = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(oReadyStateTimer);
      // initialize SIPML5
      preInit();
      sipRegister();
    }
  }, 200);
}

function postInit() {
  // check for WebRTC support
  if (!WebRTC.isWebRtcSupported()) {
    // is it chrome?
    if (WebRTC.getNavigatorFriendlyName() == "chrome") {
      if (
        confirm(
          "You're using an old Chrome version or WebRTC is not enabled.\nDo you want to see how to enable WebRTC?"
        )
      ) {
        window.location = "http://www.webrtc.org/running-the-demos";
      } else {
        window.location = "index.html";
      }
      return;
    } else {
      if (
        confirm(
          "webrtc-everywhere extension is not installed. Do you want to install it?\nIMPORTANT: You must restart your browser after the installation."
        )
      ) {
        window.location = "https://github.com/sarandogou/webrtc-everywhere";
      } else {
        // Must do nothing: give the user the chance to accept the extension
        // window.location = "index.html";
      }
    }
  }

  // checks for WebSocket support
  if (!WebRTC.isWebSocketSupported()) {
    if (
      confirm(
        "Your browser don't support WebSockets.\nDo you want to download a WebSocket-capable browser?"
      )
    ) {
      window.location = "https://www.google.com/intl/en/chrome/browser/";
    } else {
      window.location = "index.html";
    }
    return;
  }

  // FIXME: displays must be per session
  viewVideoLocal = videoLocal;
  viewVideoRemote = videoRemote;

  if (!WebRTC.isWebRtcSupported()) {
    if (
      confirm(
        "Your browser don't support WebRTC.\naudio/video calls will be disabled.\nDo you want to download a WebRTC-capable browser?"
      )
    ) {
      window.location = "https://www.google.com/intl/en/chrome/browser/";
    }
  }

  //btnRegister.disabled = false;
  document.body.style.cursor = "default";
  oConfigCall = {
    audio_remote: audioRemote,
    video_local: viewVideoLocal,
    video_remote: viewVideoRemote,
    screencast_window_id: 0x00000000, // entire desktop
    bandwidth: { audio: undefined, video: undefined },
    video_size: {
      minWidth: undefined,
      minHeight: undefined,
      maxWidth: undefined,
      maxHeight: undefined,
    },
    events_listener: { events: "*", listener: onSipEventSession },
    sip_caps: [
      { name: "+g.oma.sip-im" },
      { name: "language", value: '"en,fr"' },
    ],
  };
}

function loadCredentials() {
  /*  var txtDisplayName = "1060";
            var txtPrivateIdentity = "1060";
            var txtPublicIdentity = "sip:1060@192.168.1.52";
            var txtPassword = "enj@y10601060";
            var txtRealm = "192.168.1.52";
            var txtPhoneNumber = "9664858334";
    */
}

function uiOnConnectionEvent(b_connected, b_connecting) {
  //btnRegister.disabled = b_connected || b_connecting;
  //btnUnRegister.disabled = !b_connected && !b_connecting;
  btnCall.disabled = !(
    b_connected &&
    tsk_utils_have_webrtc() &&
    tsk_utils_have_stream()
  );
  //btnHangUp.disabled = !oSipSessionCall;
}

function sipRegister() {
  try {
    // enable notifications if not already done
    if (
      window.webkitNotifications &&
      window.webkitNotifications.checkPermission() != 0
    ) {
      window.webkitNotifications.requestPermission();
    }

    // update debug level to be sure new values will be used if the user haven't updated the page
    WebRTC.setDebugLevel(
      window.localStorage &&
        window.localStorage.getItem("org.doubango.expert.disable_debug") ==
          "true"
        ? "error"
        : "info"
    );

    // create SIP stack

    oSipStack = new WebRTC.Stack({
      //realm: "192.168.1.120",
      realm: sip_server,
      //realm: asterisk_server_ip,
      //impi: "123",
      impi: sip_extension,
      //impi: asterisk_extension,
      //impu: "sip:123@192.168.1.120",
      impu: sip_uri,
      //impu: "sip:"+asterisk_extension+"@"+asterisk_server_ip,
      //password: "enjay123",
      password: sip_password,
      //password: asterisk_extension_password,
      //display_name: asterisk_extension,
      display_name: display_name,
      //websocket_proxy_url: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.websocket_server_url') : null),
      //websocket_proxy_url: "wss://"+asterisk_server_ip+":8089/ws",
      //websocket_proxy_url: "wss://192.168.1.120:8089/ws",
      websocket_proxy_url: ws_servers,
      //outbound_proxy_url: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.sip_outboundproxy_url') : null),
      outbound_proxy_url: null,
      //ice_servers: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.ice_servers') : null),
      //ice_servers: "[{ url: 'stun:stun.l.google.com:19302'}]",
      ice_servers: "[{ url: 'stun:stun'}]",
      //enable_rtcweb_breaker: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.enable_rtcweb_breaker') == "true" : false),
      enable_rtcweb_breaker: "false",
      events_listener: { events: "*", listener: onSipEventStack },
      //enable_early_ims: (window.localStorage ? window.localStorage.getItem('org.doubango.expert.disable_early_ims') != "true" : true), // Must be true unless you're using a real IMS network
      enable_early_ims: "true", // Must be true unless you're using a real IMS network
      enable_media_stream_cache: "true",
      //bandwidth: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.bandwidth')) : null), // could be redefined a session-level
      bandwidth: null, // could be redefined a session-level
      //video_size: (window.localStorage ? tsk_string_to_object(window.localStorage.getItem('org.doubango.expert.video_size')) : null), // could be redefined a session-level
      video_size: null, // could be redefined a session-level
      sip_headers: [
        { name: "User-Agent", value: "IM-client/OMA1.0 sipML5-v1.2016.03.04" },
        { name: "Organization", value: crm },
      ],
    });
    if (oSipStack.start() != 0) {
      //txtRegStatus.innerHTML = '<b>Failed to start the SIP stack</b>';
      console.log("<b>Failed to start the SIP stack</b>");
      localStorage.setItem("phoneStatus", 500);
      chrome.browserAction.setBadgeText({ text: "off" });
      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
    } else {
      console.log(oSipStack);

      console.log(
        "**************************Register fun call*************" + oSipStack
      );
      localStorage.setItem("phoneStatus", 200);
      chrome.browserAction.setBadgeText({ text: "on" });
      chrome.browserAction.setBadgeBackgroundColor({ color: [3, 125, 14, 1] });
      return;
    }
  } catch (e) {
    console.log("Started SIP stack!!" + e);
    localStorage.setItem("phoneStatus", 500);
    chrome.browserAction.setBadgeText({ text: "off" });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
    //txtRegStatus.innerHTML = "<b>2:" + e + "</b>";
  }
  //btnRegister.disabled = false;
}

//For Showing Registration success or fail.

setInterval(function () {
  // console.log(offrellfs + "___" + oSipSessionCall);
  if (
    (oSipSessionCall === null || oSipSessionCall === undefined) &&
    offrellfs === 1
  ) {
    offrellfs = 0;
    offrellfsssave();
    // console.log('Тестова мітка 1111111111111111111111111111111111'+ offrellfs )
    sipUnRegister();
  }
}, 300);

setInterval(function () {
  if (oSipSessionCall === null || oSipSessionCall === undefined) {
    chrome.runtime.sendMessage({ type: "oSipSessionCall", value: "0" });
  } else {
    chrome.runtime.sendMessage({ type: "oSipSessionCall", value: "1" });
  }

  if (!oSipSessionRegister) {
    chrome.runtime.sendMessage(
      { action: "config", cause: "registerFail" }
      //  function (response) { }
    );
    //btnCall();
  } else {
    chrome.runtime.sendMessage(
      { action: "config", cause: "registerSuccess" }
      //  function (response) { }
    );
  }
  if (!oSipSessionCall) {
    chrome.runtime.sendMessage(
      { action: "CallSession", cause: "callSessionStoped" }
      //   function (response) { }
    );
  } else {
    chrome.runtime.sendMessage(
      { action: "CallSession", cause: "callSessionRunning" }
      // function (response) { }
    );
  }
}, 100);

//For checking Registration every 20sec.

setInterval(function () {
  if (!oSipSessionRegister) {
    if (reg == "0") {
      console.log(
        "-------------------registration:" +
          sip_uri +
          ":" +
          ws_servers +
          ":" +
          sip_extension +
          ":" +
          sip_password +
          ":" +
          ws_servers +
          ":" +
          sip_server
      );
      if (
        sip_uri != "undefined" ||
        ws_servers != "undefined" ||
        sip_extension != "undefined" ||
        ws_servers != "undefined"
      ) {
        //btnCall();
        window.location.reload();
      }
    }
  }
  if (reg == "1") {
    setTimeout(function () {
      reg = "0";
    }, 10000);
  }
}, 80000000);

function sipCall(s_type, number) {
  console.log("1111111asterisk_conn_click_to_call_number:" + number);

  //if(number > 0){
  var txtPhoneNumber = number.replace(/\s+/, "");
  //}

  if (number !== "undefined") {
    localStorage.setItem("CallStatus", txtPhoneNumber);
    localStorage.setItem("reDial", txtPhoneNumber);
  }

  console.log(
    "sipCall Accessed1111!:" +
      s_type +
      ":" +
      oSipStack +
      ":" +
      oSipSessionCall +
      ":" +
      tsk_string_is_null_or_empty(txtPhoneNumber) +
      "------____---" +
      txtPhoneNumber
  );
  //if ( oSipStack && !oSipSessionCall && !tsk_string_is_null_or_empty(txtPhoneNumber.value) )
  if (
    oSipStack &&
    !oSipSessionCall &&
    !tsk_string_is_null_or_empty(txtPhoneNumber)
  ) {
    console.log("sipCall Accessed2!:" + s_type);
    if (s_type == "call-screenshare") {
      if (!WebRTC.isScreenShareSupported()) {
        alert("Screen sharing not supported. Are you using chrome 26+?");
        return;
      }
      if (!location.protocol.match("https")) {
        if (
          confirm(
            "Screen sharing requires https://. Do you want to be redirected?"
          )
        ) {
          sipUnRegister();
          window.location = "https://ns313841.ovh.net/call.htm";
        }
        return;
      }
    }
    btnCall.disabled = true;
    //btnHangUp.disabled = false;

    console.log("sipCall Accessed!:" + s_type);

    oSipSessionCall = oSipStack.newSession(s_type, oConfigCall);
    console.log("oSipSessionCall:" + oSipSessionCall.call(txtPhoneNumber));
    if (oSipSessionCall.call(txtPhoneNumber) != 0) {
      oSipSessionCall = null;
      //txtCallStatus.value = 'Failed to make call';
      chrome.runtime.sendMessage({
        action: "outgoingCall",
        sts: "Failed to make call",
      });
      console.log("Failed to make call");
      btnCall.disabled = false;
      //btnHangUp.disabled = true;
      return;
    }
    //saveCallOptions();
  } else if (oSipSessionCall) {
    //txtCallStatus.innerHTML = '<i>Connecting...</i>';
    chrome.runtime.sendMessage({
      action: "outgoingCall",
      sts: "Connecting...",
    });
    console.log("Connecting...");
    oSipSessionCall.accept(oConfigCall);
    console.log("**************************ACCEPT*******************");
    sRemoteNumberCall = localStorage.getItem("sRemoteNumberFromIntelserv");
    const secondstg = Math.round(secondsss);
    const minutestg = Math.round(minutesss);
    tgmessage =
      "🧨 Вхідний дзвінок від: " +
      sRemoteNumberCall +
      "\n Тривалість вхідного дзвінку: " +
      "0" +
      " хв. " +
      "0" +
      " c." +
      " \n Номер консультанта: " +
      sipnumber +
      "\n " +
      fiotg +
      "\n Дзвінок не завершився...";
    // chatId = '-1002027120281';
    reply_to_message_id = 9;
    startTimer();
    sendTelegramMessage(reply_to_message_id, tgmessage);
    tgmessage = 0;
    // chatId = 0;
    reply_to_message_id = 0;
  }
}

// sends SIP REGISTER (expires=0) to logout
function sipUnRegister() {
  // console.log('----exittttttt--');
  if (oSipStack) {
    console.log(oSipStack);

    oSipStack.stop(); // shutdown all sessions
    sip_uri = "";
    sip_extension = "";
    sip_password = "";
    ws_servers = "";
    display_name = "";
    sip_server = "";
    oSipStack = "";
    console.log(oSipStack);
    console.log("----ljkhuhiu--");
  }
}

function uiDisableCallOptions() {
  if (window.localStorage) {
    window.localStorage.setItem(
      "org.doubango.expert.disable_callbtn_options",
      "true"
    );
    uiBtnCallSetText("Call");
    //alert('Use expert view to enable the options again (/!\\requires re-loading the page)');
  }
}

function uiBtnCallSetText(s_text) {
  switch (s_text) {
    case "Call": {
      //btnCall.value = btnCall.innerHTML = 'Call';
      console.log("Call");
      //document.getElementById("btnCall").src = "icons/dial1.png";
      //$("#Calltooltiptext").text("Call Someone");
      //btnCall.setAttribute("class", "btn btn-primary");
      btnCall.onclick = function () {
        sipCall(bDisableVideo ? "call-audio" : "call-audiovideo", "");
      };
      break;
    }
    default: {
      //btnCall.value = btnCall.innerHTML = s_text;
      console.log("Call:" + s_text);
      if (s_text == "Call") {
        //document.getElementById("btnCall").src = "modules/AsteriskConnector/images/dial1.png";
        //$("#Calltooltiptext").text("Call Someone");
      } else {
        //document.getElementById("btnCall").src = "modules/AsteriskConnector/images/answer.png";
        //$("#Calltooltiptext").text("Call Answer");
      }
      //btnCall.setAttribute("class", "btn btn-primary");
      btnCall.onclick = function () {
        alert("3333333333");
        sipCall(bDisableVideo ? "call-audio" : "call-audiovideo", "");
      };
      break;
    }
  }
}

var misscallLog;
var misscallLogDate;
var misscallLogTime;
var missCallRemoteNumber = [];
var missCallRemoteDate = [];
var missCallRemoteTime = [];

if (missCallRemoteNumber.length == "0") {
  //document.getElementById("CallLogData").innerHTML += "<img style='height:70px; width:280px; margin-top:5px;' src='modules/AsteriskConnector/images/no-records1.png' alt='No Record Found'>";
  console.log("NO Miscalls!!");
}

function uiCallTerminated(s_description) {
  uiBtnCallSetText("Call");
  //btnHangUp.value = 'HangUp';
  //document.getElementById("btnHangUp").src = "icons/Hangup.png";
  //btnHoldResume.value = 'hold';
  //document.getElementById("btnHoldResume").src = "icons/Hold.png";
  //$("#Holdtooltiptext").text("Hold a call");
  //btnMute.value = "Mute";
  //document.getElementById("btnMute").src = "icons/Mute.png";
  //$("#Mutetooltiptext").text("Mute a call");
  btnCall.disabled = false;
  //btnHangUp.disabled = true;
  if (window.btnBFCP) window.btnBFCP.disabled = true;

  oSipSessionCall = null;

  // stopRingbackTone();
  stopRingTone();

  //txtCallStatus.innerHTML = "<i>" + s_description + "</i>";
  chrome.runtime.sendMessage({ action: "outgoingCall", sts: s_description });
  console.log(s_description);
  //audioRemote.play();

  sRemoteNumberCall = localStorage.getItem("sRemoteNumberFromIntelserv");
  stopTimer();
  const secondstg = Math.round(secondsss);
  const minutestg = Math.round(minutesss);
  disablelog = 0;
  tgmessage =
    "📲 Вхідний дзвінок від: " +
    sRemoteNumberCall +
    "\n Тривалість вхідного дзвінку: " +
    minutestg +
    " хв. " +
    secondstg +
    " c." +
    " \n Номер консультанта: " +
    sipnumber +
    "\n " +
    fiotg +
    "\n ☎️ Дзвінок завершився!" +
    "\n ⚡️ Час оновлено!!!";
  // chatId = '-1002027120281';
  reply_to_message_id = 9;
  setTimeout(function () {
    editTelegramMessage(reply_to_message_id, tgmessage, idmessagetg);
    tgmessage = 0;
    //chatId = 0;
    reply_to_message_id = 0;
    idmessagetg = 0;
  }, 1500);
  showDisplayErrorNotification(s_description);
  clearInterval(HoldInterval);
  clearInterval(MuteInterval);

  //Reload the chrome extension after call finish
  //chrome.runtime.reload();

  if (s_description == "Request Cancelled") {
    //opencallLog();
    missCallRemoteNumber.push(misscallLog);
    missCallRemoteDate.push(misscallLogDate);
    missCallRemoteTime.push(misscallLogTime);

    console.log("Miscall from " + missCallRemoteNumber);

    var theLog = document.getElementById("CallLogData");
    var messageBody = document.querySelector("#divCallLog");

    setTimeout(function () {
      chrome.runtime.sendMessage({
        action: "miscallHistory",
        remoteNumber: misscallLog,
        remoteDate: misscallLogDate,
        remoteTime: misscallLogTime,
      });
    }, 1000);

    //window.open ("chrome-extension://" + chrome.runtime.id + "/miscall_history.html","mywindow","menubar=1,resizable=1,width=220,height=550,scrollbars=1");
    //showMiscallNotification(miscallMessageBody);
  }

  if (
    s_description == "Call terminated" ||
    s_description == "Call terminating..." ||
    s_description == "Declined" ||
    s_description == "Call Rejected" ||
    s_description == "Busy Here" ||
    s_description == "Request Cancelled"
  ) {
    if (
      s_description == "Declined" ||
      s_description == "Call Rejected" ||
      s_description == "Busy Here" ||
      s_description == "Request Cancelled"
    ) {
      sRemoteNumberCall = localStorage.getItem("sRemoteNumberFromIntelserv");

      //тут если звонок сброшен клиентом или астериском

      //   console.log('ты лошара не взял трубку');
      //пропущенный звонок

      //console.log(s_description);//Declined//Declined
      if (s_description != "Declined") {
        onCreateIncomingTask(sRemoteNumberCall, 6, 4, 1);
      }

      //сюда попадает в случает если астериск сбросил клиента
      closeKeyPad();
      closeAttendedTransfer();
      //txtCallStatus.innerHTML = "<i>"+ s_description  +"</i>";
      chrome.runtime.sendMessage({
        action: "outgoingCall",
        sts: "<i>" + s_description + "</i>",
      });
      txtIncmngCallStatus = "";

      console.log("state 2 -------------------------------");

      chrome.runtime.sendMessage({
        action: "IncomingCall",
        sts: txtIncmngCallStatus,
        btnState: false,
      });
      chrome.notifications.clear("showDisplayNotification");

      console.log("HoldInterval");

      clearInterval(HoldInterval);
      clearInterval(MuteInterval);

      chrome.runtime.sendMessage({ action: "terminatedCall", sts: "" });

      setTimeout(function () {
        //txtCallStatus.innerHTML = "";
        chrome.runtime.sendMessage({ action: "outgoingCall", sts: "" });

        console.log("clearTimeout");
      }, 3000);
    } else {
      setUpdateTaskDateEnd(taskId);

      closeKeyPad();
      closeAttendedTransfer();
      //txtCallStatus.innerHTML = "<i>Call terminated</i>";
      chrome.runtime.sendMessage({
        action: "outgoingCall",
        sts: "<i>Call terminated</i>",
      });
      txtIncmngCallStatus = "";

      console.log("state 3 -------------------------------");

      chrome.runtime.sendMessage({
        action: "IncomingCall",
        sts: txtIncmngCallStatus,
      });
      clearTimeout(t);
      setTimeout(function () {
        minutesLabel = "";
        mincolsecLabel = "";
        //document.getElementById("seconds").innerHTML = '';
        secondsLabel = "";
        //txtCallStatus.innerHTML = "";
        chrome.runtime.sendMessage({ action: "outgoingCall", sts: "" });
        console.log("clearTimeout");
      }, 3000);

      console.log("HoldInterval");

      clearInterval(HoldInterval);
      clearInterval(MuteInterval);

      chrome.runtime.sendMessage({ action: "terminatedCall", sts: "" });
    }
  }

  //uiVideoDisplayShowHide(false);
  //divCallOptions.style.opacity = 0;

  if (oNotifICall) {
    oNotifICall.cancel();
    oNotifICall = null;
  }

  //uiVideoDisplayEvent(false, false);
  //uiVideoDisplayEvent(true, false);

  /*setTimeout(function ()
    {
        if ( !oSipSessionCall )
            txtCallStatus.innerHTML = '';
    }, 2500);*/
}

// transfers the call
function sipTransfer() {
  if (oSipSessionCall) {
    var s_destination = prompt("Enter destination number", "");
    if (!tsk_string_is_null_or_empty(s_destination)) {
      //btnTransfer.disabled = true;
      if (oSipSessionCall.transfer(s_destination) != 0) {
        //txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call transfer failed</i>",
        });
        console.log("Call transfer failed");
        //btnTransfer.disabled = false;
        return;
      }
      //txtCallStatus.innerHTML = '<i>Transfering the call...</i>';
      chrome.runtime.sendMessage({
        action: "outgoingCall",
        sts: "<i>Transfering the call...</i>",
      });
      console.log("Transfering the call...");
    }
  }
}

function sipSendDTMF(c) {
  if (oSipSessionCall && c) {
    if (oSipSessionCall.dtmf(c) == 0) {
      try {
        //alert("hello3:"+c);
        dtmfTone.play();
      } catch (e) {}
    }
  }
}

// holds or resumes the call

var HoldInterval;
var MuteInterval;

function sipToggleHoldResume() {
  if (oSipSessionCall) {
    var i_ret;
    //btnHoldResume.disabled = true;
    txtHoldCallStatus = oSipSessionCall.bHeld ? "<b>Hold</b>" : "<b>Resume</b>";

    HoldInterval = setInterval(function () {
      chrome.runtime.sendMessage({
        action: "outgoingCallHold",
        HoldSts: txtHoldCallStatus,
      });
    }, 2000);
    i_ret = oSipSessionCall.bHeld
      ? oSipSessionCall.resume()
      : oSipSessionCall.hold();
    // i_ret = oSipSessionCall.mute('audio'/*could be 'video'*/, bMute);
    if (i_ret != 0) {
      //  txtCallStatus.innerHTML = '<i>Hold / Resume failed</i>';
      chrome.runtime.sendMessage({
        action: "outgoingCallHold",
        HoldSts: "<i><b>Hold / Resume failed</b></i>",
      });
      console.log("Hold / Resume failed");
      //btnHoldResume.disabled = false;
      return;
    }
  }

  console.log("0-----0-0-0-0-0-0--0-0-0-0-0-0-0-0-");
}

// Mute or Unmute the call
function sipToggleMute() {
  if (oSipSessionCall) {
    var i_ret;
    var bMute = !oSipSessionCall.bMute;
    txtMuteCallStatus = bMute ? "<b>UnMute</b>" : "<b>Mute</b>";
    if (SoundToglekl == 0) {
      if (txtMuteCallStatus == "<b>Mute</b>") {
        audioRemote.play();
        console.log("audioRemote.play();");
        console.log(audioRemote);
      } else {
        audioRemote.pause();
        console.log("audioRemote.pause();");
        console.log(audioRemote);
      }
    }
    MuteInterval = setInterval(function () {
      if (oSipSessionCall != null || oSipSessionCall != undefined) {
        chrome.runtime.sendMessage({
          action: "outgoingCallMute",
          MuteSts: txtMuteCallStatus,
        });
      } else {
        chrome.runtime.sendMessage({
          action: "outgoingCallMute",
          MuteSts: "<b>Mute</b>",
        });
        txtMuteCallStatus = "<b>Mute</b>";
      }
    }, 200);
    i_ret = oSipSessionCall.mute("audio" /*could be 'video'*/, bMute);
    if (i_ret != 0) {
      //txtCallStatus.innerHTML = '<i>Mute / Unmute failed</i>';
      chrome.runtime.sendMessage({
        action: "outgoingCallMute",
        MuteSts: "<i><b>Mute / Unmute failed<b></i>",
      });
      console.log("Mute / Unmute failed");
      return;
    }
    oSipSessionCall.bMute = bMute;
    //btnMute.value = bMute ? "Unmute" : "Mute";
    if (bMute) {
      $("#Mutetooltiptext").text("Unmute a call");

      //document.getElementById("btnMute").src = "modules/AsteriskConnector/images/Unmute.png";
    } else {
      $("#Mutetooltiptext").text("Mute a call");

      //document.getElementById("btnMute").src = "modules/AsteriskConnector/images/Mute.png";
    }
  }
}

function autoans() {
  //console.log("Auto Answer"+asterisk_auto_answer);
}

var flg;

function openKeyPad() {
  if (oSipSessionCall) {
    if (flg == "0" || !flg) {
      callboxmaindirectcall.style.height = "220px";
      divAttendedTransfer.style.visibility = "hidden";
      divConferenceTransfer.style.visibility = "hidden";
      divKeyPad.style.visibility = "visible";
      divKeyPad.style.left =
        ((document.body.clientWidth - C.divKeyPadWidth) >> 1) + "px";
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
  }
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

var conf;

function openConferenceTransfer() {
  //if(oSipSessionCall){
  if (conf == "0" || !conf) {
    //console.log("HangUp:"+hangup_channel);

    callboxmaindirectcall.style.height = "200px";
    divKeyPad.style.visibility = "hidden";
    divAttendedTransfer.style.visibility = "hidden";
    divConferenceTransfer.style.visibility = "visible";
    divConferenceTransfer.style.left =
      ((document.body.clientWidth - C.divKeyPadWidth) >> 1) + "px";
    divConferenceTransfer.style.top = "70px";
    divKeyPad.style.height = "100px";
    divAttendedTransfer.style.height = "30px";
    divConferenceTransfer.style.height = "30px";
    divConferenceTransfer.focus();
    divConferenceTransfer.value = "";
    //sipSendDTMF('*');
    conf = "1";
    temp = "0";
    flg = "0";
    //asterisk_connector_call_conference(hangup_channel,redirect_channel,"10","dynamic-nway");
  } else {
    closeConferenceTransfer();
  }
  console.log("conf:" + conf);
  OnConferenceStartClick();
  //}
}

function closeConferenceTransfer() {
  callboxmaindirectcall.style.height = "140px";
  divConferenceTransfer.style.left = "0px";
  divConferenceTransfer.style.top = "0px";
  divConferenceTransfer.style.visibility = "hidden";
  divConferenceTransfer.style.height = "0px";
  conf = "0";
  console.log("conf:" + conf);
}

var temp;

function openAttendedTransfer() {
  if (oSipSessionCall) {
    if (temp == "0" || !temp) {
      callboxmaindirectcall.style.height = "200px";
      divKeyPad.style.visibility = "hidden";
      divConferenceTransfer.style.visibility = "hidden";
      divAttendedTransfer.style.visibility = "visible";
      divAttendedTransfer.style.left =
        ((document.body.clientWidth - C.divKeyPadWidth) >> 1) + "px";
      divAttendedTransfer.style.top = "70px";
      divKeyPad.style.height = "100px";
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
  }
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

function OnAttendedCallClick(attendedNumber) {
  console.log("attendedNumber:" + attendedNumber);
  //var str        = txtAttendedPhoneNumber.value;
  var str = attendedNumber;
  sipSendDTMF("*");
  for (var i = 0; i < str.length; i++) {
    console.log("ddddddddddd:" + str.charAt(i));
    var singleEle = str.charAt(i);
    sipSendDTMF(singleEle);
  }
}

// terminates the call (SIP BYE or CANCEL)
function sipHangUp() {
  if (oSipSessionCall) {
    //txtCallStatus.innerHTML = '<i>Terminating the call...</i>';
    chrome.runtime.sendMessage({
      action: "outgoingCall",
      sts: "<i>Terminating the call...</i>",
    });
    console.log("Terminating the call...");
    oSipSessionCall.hangup({
      events_listener: { events: "*", listener: onSipEventSession },
    });
    console.log("HoldInterval");
    clearInterval(HoldInterval);
    clearInterval(MuteInterval);
    chrome.runtime.sendMessage({ action: "terminatedCall", sts: "" });
    setUpdateTaskDateEnd(taskId);
  }
}

//Проскурня 26.01.24  додав нові функції запуску звука дзвінка
var audio;
function startRingTone() {
  if (SoundTogle == 1) {
    //гучно
    audio = new Audio("src/tinySIP/src/api/sip.wav");
  } else {
    //тихо
    audio = new Audio("src/tinySIP/src/api/sipL.wav");
  }
  audio.addEventListener(
    "ended",
    function () {
      this.currentTime = 0;
      this.play();
    },
    false
  );
  audio.play();
  console.log("Звук вхідного включився!!!!!!!!!!!");
}

function stopRingTone() {
  if (audio) {
    console.log("Звук вхідного Відключився");
    audio.pause();
    audio.currentTime = 0;
  } else {
    console.log("Я не знайшов звук вхідного дзвінка");
  }
}

function showNotifICall(s_number) {
  console.log("showNotifICall:" + s_number);
  console.log("funkSlideBtn:-------------------------------");
  // permission already asked when we registered

  if (
    window.webkitNotifications &&
    window.webkitNotifications.checkPermission() == 0
  ) {
    if (oNotifICall) {
      oNotifICall.cancel();
    }
    oNotifICall = window.webkitNotifications.createNotification(
      "images/sipml-34x39.png",
      "Incaming call",
      "Incoming call from " + s_number
    );
    oNotifICall.onclose = function () {
      oNotifICall = null;
    };
    oNotifICall.show();
  }
}

function onSipEventStack(e) {
  console.log("Stack Events:" + e.type);
  tsk_utils_log_info("==stack event = " + e.type);

  switch (e.type) {
    case "started": {
      try {
        oSipSessionRegister = this.newSession("register", {
          expires: 200,
          events_listener: { events: "*", listener: onSipEventSession },
          sip_caps: [
            { name: "+g.oma.sip-im", value: null },
            { name: "+audio", value: null },
            { name: "language", value: '"en,fr"' },
          ],
        });
        oSipSessionRegister.register();
        console.log(
          "oSipSessionRegister.register:" + oSipSessionRegister.register()
        );

        localStorage.setItem("phoneStatus", 200);
        chrome.browserAction.setBadgeText({ text: "on" });
        chrome.browserAction.setBadgeBackgroundColor({
          color: [3, 125, 14, 1],
        });
      } catch (e) {
        //txtRegStatus.value = txtRegStatus.innerHTML = "<b>1:" + e + "</b>";
        //btnRegister.disabled = false;
      }
      break;
    }
    case "stopping":
    case "stopped": {
      //   console.log('єбаний стоп')
      // console.log( checkreg)
    }
    case "failed_to_start":
    case "failed_to_stop": {
      localStorage.setItem("phoneStatus", 500);
      chrome.browserAction.setBadgeText({ text: "off" });
      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
      var bFailure = e.type == "failed_to_start" || e.type == "failed_to_stop";
      oSipStack = null;
      oSipSessionRegister = null;
      oSipSessionCall = null;

      uiOnConnectionEvent(false, false);

      //stopRingbackTone();
      //stopRingTone();

      //uiVideoDisplayShowHide(false);
      //divCallOptions.style.opacity = 0;

      //txtCallStatus.innerHTML = '';
      chrome.runtime.sendMessage({ action: "outgoingCall", sts: "" });
      //txtRegStatus.innerHTML = bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>";
      break;
    }
    case "stopped1": {
      if (localStorage.getItem("btnOnOffState")) {
        localStorage.setItem("phoneStatus", 500);
        chrome.browserAction.setBadgeText({ text: "off" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
        var bFailure =
          e.type == "failed_to_start" || e.type == "failed_to_stop";
        oSipStack = null;
        oSipSessionRegister = null;
        oSipSessionCall = null;
        console.log("Тестова мітка стоп");

        uiOnConnectionEvent(false, false);

        //stopRingbackTone();
        //stopRingTone();

        //uiVideoDisplayShowHide(false);
        //divCallOptions.style.opacity = 0;

        //txtCallStatus.innerHTML = '';
        chrome.runtime.sendMessage({ action: "outgoingCall", sts: "" });
        //txtRegStatus.innerHTML = bFailure ? "<i>Disconnected: <b>" + e.description + "</b></i>" : "<i>Disconnected</i>";
      }
      break;
    }
    case "i_new_call": {
      if (oSipSessionCall) {
        // do not accept the incoming call if we're already 'in call'
        // comment this line for multi-line support
        e.newSession.hangup();

        console.log("Работает функция сброса телефона");
      } else {
        oSipSessionCall = e.newSession;
        oSipSessionCall.setConfiguration(oConfigCall);

        uiBtnCallSetText("Answer");

        //btnHangUp.value = 'Reject';
        //document.getElementById("btnHangUp").src = "modules/AsteriskConnector/images/reject.png";
        btnCall.disabled = false;
        //btnHangUp.disabled = false;
        startRingTone();
        console.log("-----------------Answer-----------------");
        var sRemoteNumber =
          oSipSessionCall.getRemoteFriendlyName() || "unknown";
        console.log("state 1 -------------------------------");
        txtIncmngCallStatus = sRemoteNumber;
        chrome.runtime.sendMessage({
          action: "IncomingCallBtn",
          btnState: true,
        });
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: sRemoteNumber,
        });
        localStorage.setItem("InCmngCallStatus", sRemoteNumber);
        localStorage.setItem("sRemoteNumberFromIntelserv", sRemoteNumber);
        showDisplayNotification(sRemoteNumber);

        //setTimeout(function ()
        //{
        //alert("You have a call from " + sRemoteNumber);
        //},1000);
        //chrome.runtime.sendMessage({ type: "NumberForSms", value: sRemoteNumber });

        var d = new Date();
        var n = d.toLocaleDateString();
        var t = d.toLocaleTimeString();
        misscallLog = sRemoteNumber;
        misscallLogDate = n;
        misscallLogTime = t;

        console.log(
          "miscall log:" +
            misscallLog +
            ":" +
            misscallLogDate +
            ":" +
            misscallLogTime
        );

        //Auto Answer
        //if(asterisk_auto_answer == "1"){
        //    sipCall("call-audio","");
        //}

        //var al = window.open('', 'test');
        //window.setTimeout(function() {al.close()}, 1);

        /*confirm("Press a button!");
                var e = jQuery.Event("keydown");
                e.which = 13;
                e.trigger;*/

        //ajaxStatus.showStatus('You have a call from '+sRemoteNumber);
        //setTimeout('ajaxStatus.hideStatus()', 15000);
        console.log("You have a call from " + sRemoteNumber);
        startTimer();
        showNotifICall(sRemoteNumber);
      }
      break;
    }
    case "m_permission_requested": {
      //divGlassPanel.style.visibility = 'visible';
      break;
    }
    case "m_permission_accepted":
    case "m_permission_refused": {
      //divGlassPanel.style.visibility = 'hidden';
      if (e.type == "m_permission_refused") {
        uiCallTerminated("Media stream permission denied");
      }
      break;
    }

    case "starting":
    default:
      break;
  }
}

//alert('CallStatus - test'+ request.sts);
let lastExecutionTime = 0; // Час останнього виконання коду
const delay = 2000; // Затримка у 2 секундиК

// sends SIP REGISTER request to login
function onSipEventSession(e /* WebRTC.Session.Event */) {
  tsk_utils_log_info("==session event = " + e.type);

  switch (e.type) {
    case "connecting":
    case "connected": {
      var bConnected = e.type == "connected";

      if (e.session == oSipSessionRegister) {
        uiOnConnectionEvent(bConnected, !bConnected);
        //txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
        console.log("<i>" + e.description + "</i>");
        const currentTime = Date.now();
        if (currentTime - lastExecutionTime >= delay) {
          reply_to_message_id = 4;
          tgmessage =
            "🟢 " + sipnumber + " - Телефон увімкнуто 2.2.2" + "\n" + "🧑‍💻 " + fiotg;
          sendTelegramMessage(reply_to_message_id, tgmessage);
          tgmessage = 0;
          setTimeout(function () {
            idmessagetg = 0;
          }, 1000);
          reply_to_message_id = 0;
          lastExecutionTime = currentTime;
        }
      } else if (e.session == oSipSessionCall) {
        //btnHangUp.value = 'HangUp';
        //document.getElementById("btnHangUp").src = "icons/Hangup.png";
        btnCall.disabled = true;
        //btnHangUp.disabled = false;
        //btnTransfer.disabled = false;
        if (window.btnBFCP) window.btnBFCP.disabled = false;

        if (bConnected) {
          //  stopRingbackTone();
          stopRingTone();

          if (oNotifICall) {
            oNotifICall.cancel();
            oNotifICall = null;
          }
        }

        // if(txtIncmngCallStatus.innerHTML == ''){

        //                          //txtCallStatus.innerHTML = "<i>" + e.description + "</i>";
        //                          console.log("HANG UP<i>" + e.description + "</i>");
        // }
        // else{

        //                          //txtCallStatus.innerHTML = "";
        //                          console.log("HANG UP<i>" + e.description + "</i>");

        // }

        if (e.description == "In Call" || e.description == "In call") {
          t = setInterval(setTime, 1000);
          totalSeconds = "0";

          function setTime() {
            ++totalSeconds;
            // secondsLabel.innerHTML = pad(totalSeconds % 60);
            // mincolsecLabel.innerHTML = ':';
            // minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));

            secondsLabel = pad(totalSeconds % 60);
            mincolsecLabel = ":";
            minutesLabel = pad(parseInt(totalSeconds / 60));

            //console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMM:"+totalSeconds+":"+secondsLabel+":"+minutesLabel);

            chrome.runtime.sendMessage({
              action: "timer",
              seconds: secondsLabel,
              minutes: minutesLabel,
            });

            chrome.browserAction.setBadgeText({
              text: minutesLabel + " " + secondsLabel,
            });
            chrome.browserAction.setBadgeBackgroundColor({
              color: [174, 67, 212, 1],
            });
          }

          chrome.runtime.sendMessage({ action: "callStarted" });

          function pad(val) {
            valString = val + "";
            if (valString.length < 2) {
              return "0" + valString;
            } else {
              return valString;
            }
          }
        }
        //divCallOptions.style.opacity = bConnected ? 1 : 0;

        if (WebRTC.isWebRtc4AllSupported()) {
          // IE don't provide stream callback
          //uiVideoDisplayEvent(false, true);
          //uiVideoDisplayEvent(true, true);
        }
      }
      break;
    } // 'connecting' | 'connected'
    case "terminating":
    case "terminated": {
      if (e.session == oSipSessionRegister) {
        uiOnConnectionEvent(false, false);

        oSipSessionCall = null;
        oSipSessionRegister = null;

        //txtRegStatus.innerHTML = "<i>" + e.description + "</i>";
        //txtCallStatus.innerHTML = "<i>" + e.description + "</i>";
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: e.description,
        });
        console.log("HoldInterval");
        clearInterval(HoldInterval);
        clearInterval(MuteInterval);

        chrome.runtime.sendMessage({ action: "terminatedCall", sts: "" });

        console.log("<i>TERMINATED:" + e.description + "</i>");
        reply_to_message_id = 4;
        tgmessage =
          "🔴 " + sipnumber + " - Телефон вимкнуто" + "\n" + "🧑‍💻 " + fiotg;
        sendTelegramMessage(reply_to_message_id, tgmessage);
        tgmessage = 0;
        setTimeout(function () {
          idmessagetg = 0;
        }, 1000);
        reply_to_message_id = 0;

        sipUnRegister();
        $("#onOffPhone").prop("checked", false);
        chrome.browserAction.setBadgeText({ text: "off" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
      } else if (e.session == oSipSessionCall) {
        chrome.browserAction.setBadgeText({ text: "on" });
        chrome.browserAction.setBadgeBackgroundColor({
          color: [3, 125, 14, 1],
        });
        uiCallTerminated(e.description);
      }
      callRunning = false;
      break;
    } // 'terminating' | 'terminated'

    case "m_stream_video_local_added": {
      if (e.session == oSipSessionCall) {
        //uiVideoDisplayEvent(true, true);
      }
      break;
    }
    case "m_stream_video_local_removed": {
      if (e.session == oSipSessionCall) {
        //uiVideoDisplayEvent(true, false);
      }
      break;
    }
    case "m_stream_video_remote_added": {
      if (e.session == oSipSessionCall) {
        //uiVideoDisplayEvent(false, true);
      }
      break;
    }
    case "m_stream_video_remote_removed": {
      if (e.session == oSipSessionCall) {
        //uiVideoDisplayEvent(false, false);
      }
      break;
    }
    case "m_stream_audio_remote_added": {
      callRunning = true;
      break;
    }

    case "m_stream_audio_local_added":
    case "m_stream_audio_local_removed":
    //case 'm_stream_audio_remote_added':
    case "m_stream_audio_remote_removed": {
      break;
    }

    case "i_ect_new_call": {
      oSipSessionTransferCall = e.session;
      break;
    }

    case "i_ao_request": {
      if (e.session == oSipSessionCall) {
        var iSipResponseCode = e.getSipResponseCode();
        if (iSipResponseCode == 180 || iSipResponseCode == 183) {
          CStatus = localStorage.getItem("CallStatus");
          if (CStatus.length < 5) {
            //  startRingbackTone();
          }
          //txtCallStatus.innerHTML = '<i>Remote ringing...</i>';
          chrome.runtime.sendMessage({
            action: "outgoingCall",
            sts: "<i>Remote ringing...</i>",
          });
          console.log("Remote ringing...");
        }
      }
      callRunning = true;
      break;
    }

    case "m_early_media": {
      if (e.session == oSipSessionCall) {
        // stopRingbackTone();
        stopRingTone();
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call connected to <i>",
        });
        //txtCallStatus.innerHTML = '<i>Early media started</i>';
      }
      break;
    }

    case "m_local_hold_ok": {
      if (e.session == oSipSessionCall) {
        if (oSipSessionCall.bTransfering) {
          oSipSessionCall.bTransfering = false;
          // this.AVSession.TransferCall(this.transferUri);
        }
        //btnHoldResume.value = 'Resume';
        //btnHoldResume.src = 'modules/AsteriskConnector/images/Unhold.png';
        //document.getElementById("btnHoldResume").src = "modules/AsteriskConnector/images/Unhold.png";
        //$("#Holdtooltiptext").text("UnHold a call");
        //btnHoldResume.disabled = false;
        //txtCallStatus.innerHTML = '<i>Call placed on hold</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call placed on hold</i>",
        });
        oSipSessionCall.bHeld = true;
      }
      break;
    }
    case "m_local_hold_nok": {
      if (e.session == oSipSessionCall) {
        oSipSessionCall.bTransfering = false;
        //btnHoldResume.value = 'Hold';
        //btnHoldResume.src = 'modules/AsteriskConnector/images/hold.png';
        //document.getElementById("btnHoldResume").src = "modules/AsteriskConnector/images/Hold.png";
        //$("#Holdtooltiptext").text("Hold a call");
        //btnHoldResume.disabled = false;
        txtCallStatus.innerHTML = "<i>Failed to place remote party on hold</i>";
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Failed to place remote party on hold</i>",
        });
      }
      break;
    }
    case "m_local_resume_ok": {
      if (e.session == oSipSessionCall) {
        oSipSessionCall.bTransfering = false;
        //btnHoldResume.value = 'Hold';
        //btnHoldResume.src = 'modules/AsteriskConnector/images/hold.png';
        //document.getElementById("btnHoldResume").src = "modules/AsteriskConnector/images/Hold.png";
        //$("#Holdtooltiptext").text("Hold a call");
        //btnHoldResume.disabled = false;
        //txtCallStatus.innerHTML = '<i>Call taken off hold</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call taken off hold</i>",
        });
        oSipSessionCall.bHeld = false;

        if (WebRTC.isWebRtc4AllSupported()) {
          // IE don't provide stream callback yet
          //uiVideoDisplayEvent(false, true);
          //uiVideoDisplayEvent(true, true);
        }
      }
      break;
    }
    case "m_local_resume_nok": {
      if (e.session == oSipSessionCall) {
        oSipSessionCall.bTransfering = false;
        //btnHoldResume.disabled = false;
        //txtCallStatus.innerHTML = '<i>Failed to unhold call</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Failed to unhold call</i>",
        });
      }
      break;
    }
    case "m_remote_hold": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Placed on hold by remote party</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Placed on hold by remote party</i>",
        });
      }
      break;
    }
    case "m_remote_resume": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Taken off hold by remote party</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Taken off hold by remote party</i>",
        });
      }
      break;
    }
    case "m_bfcp_info": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = 'BFCP Info: <i>' + e.description + '</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "BFCP Info: <i>" + e.description + "</i>",
        });
      }
      break;
    }
    case "o_ect_trying": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Call transfer in progress...</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call transfer in progress...</i>",
        });
      }
      break;
    }
    case "o_ect_accepted": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Call transfer accepted</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call transfer accepted</i>",
        });
      }
      break;
    }
    case "o_ect_completed":
    case "i_ect_completed": {
      alert("new Call 222 test");
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Call transfer completed</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call transfer completed</i>",
        });
        //btnTransfer.disabled = false;
        if (oSipSessionTransferCall) {
          oSipSessionCall = oSipSessionTransferCall;
        }
        oSipSessionTransferCall = null;
      }
      break;
    }
    case "o_ect_failed":
    case "i_ect_failed": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Call transfer failed</i>",
        });
        //btnTransfer.disabled = false;
      }
      break;
    }
    case "o_ect_notify":
    case "i_ect_notify": {
      if (e.session == oSipSessionCall) {
        //txtCallStatus.innerHTML = "<i>Call Transfer: <b>" + e.getSipResponseCode() + " " + e.description + "</b></i>";
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts:
            "<i>Call Transfer: <b>" +
            e.getSipResponseCode() +
            " " +
            e.description +
            "</b></i>",
        });
        if (e.getSipResponseCode() >= 300) {
          if (oSipSessionCall.bHeld) {
            oSipSessionCall.resume();
          }
          //btnTransfer.disabled = false;
        }
      }
      break;
    }
    case "i_ect_requested": {
      if (e.session == oSipSessionCall) {
        var s_message =
          "Do you accept call transfer to [" +
          e.getTransferDestinationFriendlyName() +
          "]?"; //FIXME
        if (confirm(s_message)) {
          //txtCallStatus.innerHTML = "<i>Call transfer in progress...</i>";
          chrome.runtime.sendMessage({
            action: "outgoingCall",
            sts: "<i>Call transfer in progress...</i>",
          });
          oSipSessionCall.acceptTransfer();
          break;
        }
        oSipSessionCall.rejectTransfer();
      }
      break;
    }
  }
}

function loadCallOptions() {
  if (window.localStorage) {
    var s_value;
    if (
      (s_value = window.localStorage.getItem("org.doubango.call.phone_number"))
    )
      txtPhoneNumber = s_value;
    bDisableVideo =
      window.localStorage.getItem("org.doubango.expert.disable_video") ==
      "true";

    //txtCallStatus.innerHTML = '<i>Video ' + (bDisableVideo ? 'disabled' : 'enabled') + '</i>';
    //chrome.runtime.sendMessage({action:"outgoingCall",sts : "<i>Video ' + (bDisableVideo ? 'disabled' : 'enabled') + '</i>"});
  }
}

/*var e1    = document.getElementById("btnCall");

//alert(phone);
e1.addEventListener("click",clicktocall);

function clicktocall(){
    var phone = document.getElementById("txtPhoneNumber").value;
    document.getElementById("demo").innerHTML = "Hello World"+phone;
    console.log("Hello World:"+phone);

    sipCall("call-audio",phone);

}// function end*/

//Chrome extension popup

/*chrome.browserAction.onClicked.addListener(btnclicked)

function btnclicked()
{
   console.log("hello World");
}*/

//Audio Call control functions-----------------------------------------------------------------------------------------------------
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "dial_ext") {
    current_status = "dialing";
    //ringbacktone = request.faudio;
    //console.log("ringbacktone:"+ringbacktone);
    if (oSipSessionRegister) {
      //Исходящий звонок
      onCreateIncomingTask("+38" + request.ext_num, 2, 3, "");

      sipCall("call-audio", request.ext_num);
      chrome.runtime.sendMessage(
        { action: "current_status", cause: current_status }

        // function (response) { }
      );
    } else {
      showDisplayErrorNotification("You are not registered.");
    }
  }
  if (request.action === "detail") {
    sip_extension = request.ext;
    sip_password = request.pw;
    sip_server = request.server;
  }
  if (request.type === "hangUp_ext") {
    if (oSipSessionCall) {
      sipHangUp();
      a = '(Через інтерфейс телефону)'
      sendtglog(a);
    }
  }
  if (request.type === "mute_ext") {
    if (oSipSessionCall) {
      sipToggleMute();
    }
  }
  //Снять трубку
  if (request.type === "btnCallUp") {
    sRemoteNumberCall = localStorage.getItem("sRemoteNumberFromIntelserv");
    //создать задачу при снятии трубки

    if (oSipSessionCall) {
      onCreateIncomingTask(sRemoteNumberCall, 6, 3, "");

      sipCall("call-audio", "");
      chrome.notifications.clear("showDisplayNotification");
    }
  }

  if (request.type === "transferToUser") {
    if (oSipSessionCall) {
      setTransferToWorkman(request.ext_num);
    }
  }

  if (request.type === "hold_ext") {
    if (oSipSessionCall) {
      sipToggleHoldResume();
    }
  }
  if (request.type === "transfer_ext") {
    if (oSipSessionCall) {
      sipTransfer();
    }
  }
  if (request.type === "attended_ext") {
    if (oSipSessionCall) {
      attendedNumber = request.ext_num;
      //alert("attendedNumber:"+attendedNumber);
      //sipHangUp();
      OnAttendedCallClick(attendedNumber);
    }
  }
  if (request.type === "conference_ext") {
    if (oSipSessionCall) {
      conferenceNumber = request.ext_num;
      console.log("conferencecall:" + conferenceNumber);
      OnConferenceStartClick(conferenceNumber);
      //OnConferenceCallClick(conferenceNumber);
    }
  }
  if (request.type === "merge_ext") {
    if (oSipSessionCall) {
      console.log("mutecall:");
      OnMergeClick();
      //OnConferenceCallClick(conferenceNumber);
    }
  }
  if (request.action === "channel") {
    hangup_channel = request.hangup;
    redirect_channel = request.redirect;
    extension = request.extension;
  }
  if (request.type === "dial_num") {
    if (oSipSessionCall) {
      num = request.ext_num;
      sipSendDTMF(num);
    }
  }
});

//var flgConf = 0;
function OnConferenceStartClick(number) {
  var sip_server = localStorage.getItem("sip_server");
  var http_port = localStorage.getItem("http_port");

  if (http_port === "" || http_port === "undefined") {
    http_port = 80;
  }

  console.log("sipserver:" + sip_server);

  //if (flgConf === 0) {

  if (number.length > 0) {
    $.ajax({
      url:
        "http://" +
        sip_server +
        ":" +
        http_port +
        "/webrtc/confCall.php?ext=" +
        ext,
      success: function (data) {
        console.log("outside:" + data);
        setTimeout(function () {
          console.log("inside:" + data);
          sipSendDTMF("0");
          for (var i = 0; i < number.length; i++) {
            //console.log("ddddddddddd:"+str.charAt(i));
            var singleEle = number.charAt(i);
            sipSendDTMF(singleEle);
          }
          sipSendDTMF("#");

          flgConf = 1;
        }, 2200);

        //chrome.runtime.sendMessage({action:"concallDone"});
      },
      error: function () {
        console.log("Conference call Error");
      },
    });
  } else {
    alert("Please enter number");
  }

  // }else{

  //     var merge ='88';
  //     for (var i = 0; i < merge.length; i++) {
  //         //console.log("ddddddddddd:"+str.charAt(i));
  //         var singleEle   = merge.charAt(i)
  //         sipSendDTMF(singleEle);
  //     }

  // }

  //asterisk_connector_call_conference(hangup_channel,redirect_channel,asterisk_extension,"dynamic-nway");
}

function OnMergeClick() {
  var str = "88";
  console.log("date*****" + str);
  for (var i = 0; i < str.length; i++) {
    //alert(str.charAt(i));
    var singleEle = str.charAt(i);
    sipSendDTMF(singleEle);
  }

  //chrome.runtime.sendMessage({action:"concallMergeDone"});
}

function isEmpty(data) {
  if (data == null || data == "" || data == undefined) {
    return true;
  } else {
    return false;
  }
}

//Send message from web page to chrome extension's background script
//CLICK TO CALL FROM CRM.-------------START-----------------

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.number != undefined) {
    console.log("CRM extension:" + request.extension);
    enjayphoneExtension = localStorage.getItem("extension");
    console.log("SIP extension:" + enjayphoneExtension);
    if (oSipSessionRegister) {
      if (request.extension === enjayphoneExtension) {
        console.log("done");
        alert("1111111111");
        sipCall("call-audio", request.number);
      } else {
        showDisplayErrorNotification(
          "Please register an extension number " +
            request.extension +
            " in enjay phone"
        );
      }
    } else {
      console.log("Failure");
      //showDisplayErrorNotification('You are not registered.');
    }
    //sipCall("call-audio",request.number);
  }
});

//----------------END---------------------

function showDisplayErrorNotification(msg) {
  var options = {
    type: "basic",
    iconUrl: "img/logo.png",
    title: chrome.runtime.getManifest().name,
    message: msg,
    priority: 2,
    isClickable: false,
  };

  chrome.notifications.create(
    "showDisplayErrorNotification",
    options,
    function () {}
  );
  setTimeout(function () {
    chrome.notifications.clear("showDisplayErrorNotification");
  }, 3000);
}

var myNotificationID = null;
var myMiscallNotificationID = null;

function showDisplayNotification(msg) {
  var options = {
    type: "basic",
    iconUrl: "img/logo.png",
    title: chrome.runtime.getManifest().name,
    message: "Вхідний дзвінок " + msg,
    priority: 2,
    isClickable: false,
    buttons: [
      {
        title: "Прийняти",
        iconUrl: "icons/answer.png",
      },
      {
        title: "Відхилити",
        iconUrl: "icons/reject.png",
      },
    ],
  };
  chrome.notifications.create(
    "showDisplayNotification",
    options,
    function (id) {
      myNotificationID = id;
    }
  );
  // setTimeout(function(){
  //         chrome.notifications.clear("showDisplayErrorNotification");
  // }, 2000);
}

function showMiscallNotification(msg) {
  console.log("1111111111111111111:" + msg);

  var options = {
    type: "basic",
    iconUrl: "img/logo.png",
    title: "Miscall History",
    message: msg,
    priority: 2,
    isClickable: false,
  };

  console.log(options);

  chrome.notifications.create(
    "showMiscallNotification",
    options,
    function (id) {
      //myMiscallNotificationID = id;
      timer = setTimeout(function () {
        chrome.notifications.clear(id);
      }, 2000000);
    }
  );

  // setTimeout(function(){
  //         chrome.notifications.clear("showDisplayErrorNotification");
  // }, 2000);
}

/* Respond to the user's clicking one of the buttons */
chrome.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
  if (notifId === myNotificationID) {
    if (btnIdx === 0) {
      sRemoteNumberCall = localStorage.getItem("sRemoteNumberFromIntelserv");
      //снять трубку в пуше
      onCreateIncomingTask(sRemoteNumberCall, 6, 3, "");

      sipCall("call-audio", "");
      chrome.notifications.clear("showDisplayNotification");
    } else if (btnIdx === 1) {
      alert("sorry");

      saySorry();
    }
  }
});

function saySorry() {
  console.log("Sorry to bother you !");
  chrome.notifications.clear("showDisplayNotification");
  sipHangUp();
  a = '(Через ПУШ)'
  sendtglog(a);
}

//Intelserv
var phoneinc = 0;

function onCreateIncomingTask(phone, type, action, userFlag) {
  //getAccess();
  console.log("тут работает функция создания задачи");

  if (type == 2) {
    idmessagetg = 0;
  }

  if (userFlag == 1) {
    console.log("пропущенный звонок");
    disablelog = 1;
    stopTimer();
    const secondstg = Math.round(secondsss);
    const minutestg = Math.round(minutesss);
    // chatId = '-4015175969';
    reply_to_message_id = 6;
    tgmessage =
      "⚠️ Пропущений дзвінок від: " +
      phone +
      "\n  Тривалість вхідного дзвінку: " +
      minutestg +
      " хв. " +
      secondstg +
      " c." +
      " \n  Номер консультанта: " +
      sipnumber +
      "\n ⚡️" +
      fiotg;
    phoneinc = phone;
    sendTelegramMessage(reply_to_message_id, tgmessage);
    tgmessage = 0;
    setTimeout(function () {
      idmessagetg = 0;
    }, 1000);
    reply_to_message_id = 0;
  }

  $.ajax({
    url: crm8,
    type: "POST",
    data: { phone: phone, type: type, action: action, userFlag: userFlag },
    beforeSend: function () {
      console.log("пошло создания задачи");
      startTime = null;
    },
    success: function (data) {
      console.log("task data send");
      if (data.trim()) {
        data = $.parseJSON(data);

        taskId = data.id;

        window.open(data.link);
      }
    },
  });
}

setInterval(function () {
  if (oSipSessionCall === null || oSipSessionCall === undefined) {
    getAccess();
  }
}, 300000); //5хв

function getAccess() {
  $.ajax({
    url: crm9,
    type: "POST",
    data: { step: 1, version: "phone_2.1.0" },
    success: function (data) {
      clearTimeout(serverRequestTimeout);
      data = $.parseJSON(data);
      domen = data.domen;
      if (data.fio) {
        fiotg = data.fio;
        fiotgsave();
      }
      status = data.status;
      console.log(status);
      if (data.error) {
        clearTimeout(serverRequestTimeout);
        // chrome.storage.sync.set({"EXTENSION_NUMBER": null});
        // chrome.storage.sync.set({"SERVER": null});
        // chrome.storage.sync.set({"WSS_SERVER": null});
        // chrome.storage.sync.set({"DISPLAY_NAME": null});
        // ws_servers = domen;
        // sip_server = domen;
        // sip_uri = domen;
        // sip_password = domen;
        // display_name = domen;
        reply_to_message_id = 4;
        tgmessage = "⚠️ " + fiotg + "\n" + data.error;
        sendTelegramMessage(reply_to_message_id, tgmessage);
        tgmessage = 0;
        reply_to_message_id = 0;
        sipUnRegister();
        console.log("<b>Failed to start the SIP stack</b>");
        localStorage.setItem("phoneStatus", 500);
        chrome.browserAction.setBadgeText({ text: "off" });
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 1] });
      }
    },
  });
  serverRequestTimeout = setTimeout(function () {
    $(".server-response").show();
    console.log("testtttttttttttttttttttttttttttttttttttttttttttttttttttttt");
  }, 10000);
}

var reloadcheck = document.getElementById("reloadcheck");
function reloadcheck() {
  reloadcheck.disabled = false;
}

//setInterval(checkSIP, 10000);
//function checkSIP(){
//
//
//console.log('nihuya');
//
//}

function getInfoUser(phone) {
  $.ajax({
    url: crm10,
    type: "POST",
    data: { phone: phone, type: type },
    success: function (data) {
      console.log("task data send");
      if (data.trim()) {
        userInfo = data;
      }
    },
  });
}

function setUpdateTaskDateEnd(taskId) {
  $.ajax({
    url: crm11,
    type: "POST",
    data: { taskId: taskId },
    success: function (data) {},
  });
}

function setTransferToWorkman(phoneTransfer) {
  if (oSipSessionCall) {
    if (!tsk_string_is_null_or_empty(phoneTransfer)) {
      //btnTransfer.disabled = true;
      if (oSipSessionCall.transfer(phoneTransfer) != 0) {
        //txtCallStatus.innerHTML = '<i>Call transfer failed</i>';
        chrome.runtime.sendMessage({
          action: "outgoingCall",
          sts: "<i>Ошибка при переводе звонка</i>",
        });
        console.log("Call transfer failed");
        //btnTransfer.disabled = false;
        return;
      }
      //txtCallStatus.innerHTML = '<i>Transfering the call...</i>';
      chrome.runtime.sendMessage({
        action: "outgoingCall",
        sts: "<i>Выполняется перевод звонка</i>",
      });
      console.log("Transfering the call...");
    }
  }
}
