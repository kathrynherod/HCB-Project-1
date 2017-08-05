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

  // 2. 

  $("#register-btn").on("click",function(event){
    event.preventDeafult();

    var username = $("#exampleUserName1").val().trim(); //hmtl chaneexampleUserName1 - exampleInputUserName1
    var email = $("#exampleInputEmail1").val().trim();
    var password = $("#exampleInputEmail1").val().trim();
    var firstName = $("#exampleInputFirstName1").val().trim();
    var lastName =  $("#exampleLastName1").val().trim();
    var age = $("#exampleInputAge").val().trim();
    var zipCode = $("exampleInputZip").val().trim();

    var newUser = {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      age: age,
      zipCode: zipCode
    };

    database.ref().push(newUser);

    console.log(newUser);


  });
