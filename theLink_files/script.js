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
var uid=780900;

var code = document.querySelector('.code');
var qrcode = document.querySelector('#qrcode');

var toast = document.querySelector('#toast');

var untoast = document.querySelector('#untoast');




function sendData(data) {
	console.log("Send data");
	var boxValue = document.getElementById('textToSend').value // first element in DOM  (index 0) with name="txtJob"
		console.log("boxValue");

    database.ref('UserTemp/' + uid + "/PHONE").set({
        text: boxValue,
        source: "Mobile",
    }).catch((error) => {
        console.log(error);
    });
}
function getData() {
    database.ref("UserTemp/" + uid + "/PHONE").get().then((snapshot) => {
        if (snapshot.exists()) {
            var val = snapshot.val();
            if (val.source == "Mobile") {
                console.log("data "+val.text);
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
    untoast.className=toast.className.replace("show" , "");;
    var url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uid}`;
    code.src = url;
    qrcode.className="show";
    toastDiv();
    longPolling();
    console.log(uid);
}
function toastDiv() {
    toast.className = "show";
    untoast.className=untoast.className.replace("show" , "");
    setTimeout( function() {
            toast.className=toast.className.replace("show" , "");

    },2000);
}
generate();

function longPolling(){
	var starCountRef = database.ref("UserTemp/" + uid);
		starCountRef.on('value', (snapshot) => {
  		const data = snapshot.val();
		if(snapshot.exists()){
			console.log(data);
			untoast.className="show";
			qrcode.className=qrcode.className.replace("show" , "");;

		}else{
			console.log(null);
   		untoast.className=untoast.className.replace("show" , "");
			qrcode.className="show";
		}

	});
	 // database.ref("UserTemp/" + uid).get().then((snapshot) => {
  //       if (snapshot.exists()) {
  //  			 untoast.className="show";
  //       } else {
  //           setTimeout( function() {
		// 		longPolling();
  //           },2000);
  //       }
  //   }).catch((error) => {
  //       console.log(error);
  //       setTimeout( function() {
		// 		longPolling();
  //           },2000);
  //   });
}

document.getElementById('sendButton').addEventListener("click", sendData);
document.getElementById('getButton').addEventListener("click", getData);


