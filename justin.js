console.log("linked");

// 1. Initialize Firebase

var config = {
    apiKey: "AIzaSyDOjDpYcoEnBzdA5y3d6EPrRcmMzIq5aBc",
    authDomain: "groupproject1-4b4d1.firebaseapp.com",
    databaseURL: "https://groupproject1-4b4d1.firebaseio.com",
    projectId: "groupproject1-4b4d1",
    storageBucket: "groupproject1-4b4d1.appspot.com",
    messagingSenderId: "345420353976"
  };
  firebase.initializeApp(config);


var database = firebase.database();




//------------------------For USER PROFILE PAGE (profile.html) -------------------------

// 2. Add Buttons
$("#submit-changes-btn").on("click", function(event){
	event.preventDefault();

	var userName = $("#user-name-input").val().trim();
	var userFirstName = $("#user-first-input").val().trim();
	var userLastName =  $("#user-last-input").val().trim();
	var userAge = $("#user-age-input").val().trim();
	var userZip = $("#user-zip-input").val().trim();

	var newUser ={
		userName: userName,
		userFirstName: userFirstName,
		userLastName: userLastName,
		userAge: userAge,
		userZip: userZip //Parse?
	};

	database.ref().push(newUser);

	console.log(newUser);
	console.log(newUser.userAge); //check to see if the values are being stored


	/*$("#user-name-input").val("");
	$("#user-first-input").val("");
	$("#user-last-input").val("");
	$("#user-age-input").val("");
	$("#user-zip-input").val(""); clearsthe text boxes but is it necessary since we are dynamically changing the content?*/ 



});



$("#upload-photo").on("click", function(){




});

//Logout Button

$("#logout-btn").on("click", function() {

            firebase.auth().signOut();
            window.location.href = "index.html";

});








//add on button click events
//include moment.js to handle expiration date



//-------------------------For CONTEST PAGE (contest_page.html) -----------------------------


// 2. Add Buttons



$("#like-button").on("click", function(){
	var likes = 0;
	like++;
	//can only click more than once
	//need a contest id

});