// Initialize Firebase
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
  var userName = "";
  var email = "";
  var password = "";
  var firstName = "";
  var lastName = "";
  var age = "";
  var zipCode = "";


$("#register-btn").on("click", function() {
  event.preventDefault();


  email = $("#user-email").val().trim();
  password = $("#user-pw").val().trim();
firstName = $("#user-first").val().trim();
 lastName = $("#user-last").val().trim();
  age = $("#user-age").val().trim();
  zipcode = $("#user-zip").val().trim();

            database.ref().push({

                UserName: userName,
                Email: email,
                Password:  password,
                FirstName: firstName,
                LastName: lastName,
                Age: age,
                ZipCode: zipCode
            });
}
)
