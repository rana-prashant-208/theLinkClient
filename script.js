var firebaseConfig = {
    apiKey: "AIzaSyCm93qaWDxzwZTp1sJXTP9g7ygcyUfOjKQ",
    authDomain: "thelink-b8cd2.firebaseapp.com",
    databaseURL: "https://thelink-b8cd2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "thelink-b8cd2",
    storageBucket: "thelink-b8cd2.appspot.com",
    messagingSenderId: "405437988895",
    appId: "1:405437988895:web:fa6b30d342212dd043d52a",
    measurementId: "G-3HVNSRRNF2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
// var uid=Math.floor((Math.random() * 1000000));
var uid = "";
if (localStorage.getItem('uid') == null || localStorage.getItem('uid') == "null") {
    console.log("setting uid from localStorage is null");
    uid = new Date().getTime();
} else {
    console.log("setting uid from localStorage");
    uid = localStorage.getItem('uid');
}
var code = document.querySelector('.code');
var qrcode = document.querySelector('#qrcode');
var toast = document.querySelector('#toast');
var helpCard = document.querySelector('#helpCard');
var untoast = document.querySelector('#untoast');
console.log("YAY");

function sendData(data) {
    console.log("Send data");
    var boxValue = document.getElementById('textToSend').value // first element in DOM  (index 0) with name="txtJob"
    console.log("boxValue");
    database.ref('UserTemp/' + uid + "/WEB").set({
        text: boxValue,
        source: "Mobile",
    }).catch((error) => {
        console.log(error);
    });
    alert("Sent");
}

function getData() {
    database.ref("UserTemp/" + uid + "/PHONE").get().then((snapshot) => {
        if (snapshot.exists()) {
            var val = snapshot.val();
            if (val.source == "Mobile") {
                console.log("data " + val.text);
                alert(val.text);
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.log(error);
    });
}

function generate() {
    untoast.className = toast.className.replace("show", "");;
    var url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uid}`;
    code.src = url;
    qrcode.className = "show";
    toastDiv();
    longPolling();
    console.log(uid);
}

function toastDiv() {
    toast.className = "show";
    untoast.className = untoast.className.replace("show", "");
    setTimeout(function() {
        toast.className = toast.className.replace("show", "");
    }, 2000);
}
generate();

function longPolling() {
    var url = "https://radiant-depths-80988.herokuapp.com/checkAuth/client/";
    var params = "clientUID="+uid;
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.setRequestHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    http.setRequestHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    http.onreadystatechange = function() { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
        if(http.responseText=="Authenticated"){
                 console.log("setting uid " + uid);
                 localStorage.setItem("uid", uid);
                 console.log(http.responseText);
                 untoast.className = "show";
                 qrcode.className = qrcode.className.replace("show", "");
                 helpCard.className = helpCard.className.replace("show", "");
            }else{
                     console.log("setting uid null");
                     localStorage.setItem("uid", null);
                     untoast.className = untoast.className.replace("show", "");
                     qrcode.className = "show";
                     helpCard.className = "show";
                                 setTimeout(longPolling, 30000);
            }
//            setTimeout(longPolling, 10000);
        }else{
//        	setTimeout(longPolling, 10000);
        }
    }
    http.send(params);
    // if (snapshot.exists()) {
    //     console.log("setting uid " + uid);
    //     localStorage.setItem("uid", uid);
    //     console.log(data);
    //     untoast.className = "show";
    //     qrcode.className = qrcode.className.replace("show", "");
    //     helpCard.className = helpCard.className.replace("show", "");
    // } else {
    //     console.log("setting uid null");
    //     localStorage.setItem("uid", null);
    //     untoast.className = untoast.className.replace("show", "");
    //     qrcode.className = "show";
    //     helpCard.className = "show";
    // }
}

function logout() {
    console.log("logout for id " + uid);
    var starCountRef = database.ref("UserTemp").child(uid);
    starCountRef.remove();
    uid = new Date().getTime();
    console.log("setting uid null in logout");
    localStorage.setItem("uid", null);
    generate();
}
document.getElementById('sendButton').addEventListener("click", sendData);
document.getElementById('getButton').addEventListener("click", getData);
document.getElementById('logout').addEventListener("click", logout);