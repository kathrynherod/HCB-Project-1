// Initialize Firebase
var config = {
    apiKey: "AIzaSyDOjDpYcoEnBzdA5y3d6EPrRcmMzIq5aBc",
    authDomain: "groupproject1-4b4d1.firebaseapp.com",
    databaseURL: "https://groupproject1-4b4d1.firebaseio.com",
    projectId: "groupproject1-4b4d1",
    storageBucket: "groupproject1-4b4d1.appspot.com",
    messagingSenderId: "345420353976"
};
//this uses the info in config and passes into the function calling firebase
firebase.initializeApp(config);

//rename firebase to database
var database = firebase.database();


//global variables
var userName = "";
var email = "";
var password = "";
var firstName = "";
var lastName = "";
var age = "";
var zipCode = "";

//when user clicks register button
$("#register-btn").on("click", function() {

    //stop page from refreshing
    event.preventDefault();

    //grab the user's input from the page
    userName = $("#user-name").val().trim();
    email = $("#user-email").val().trim();
    password = $("#user-pw").val().trim();
    firstName = $("#user-first").val().trim();
    lastName = $("#user-last").val().trim();
    age = $("#user-age").val().trim();
    zipCode = $("#user-zip").val().trim();

    //this is the authentication email and password check provided by firebase
    //under Sign Up New Users: https://firebase.google.com/docs/auth/web/start
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

    //send that input to our database
    database.ref().push({

        UserName: userName,
        Email: email,
        Password: password,
        FirstName: firstName,
        LastName: lastName,
        Age: age,
        ZipCode: zipCode

    });
})