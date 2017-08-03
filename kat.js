/*
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
  }
});

  function writeUserData(userName, email, password, firstName, lastName, age, zipCode) {
        firebase.database().ref('users/' + userId).set({
            UserName: userName,
            Email: email,
            Password: password,
            FirstName: firstName,
            LastName: lastName,
            Age: age,
            ZipCode: zipCode
        });
    }




*/

 //send that input to our database
  

