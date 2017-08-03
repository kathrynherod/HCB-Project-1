(function() {


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
    var auth = firebase.auth();

    //global variables
    //grab the user's input from the page
    var email = "";
    var password = "";

    //when user clicks register button
    $("#register-btn").on("click", function() {

        //grab the user's input from the page
        var userName = $("#user-name").val().trim();
        email = $("#user-email").val().trim();
        password = $("#user-pw").val().trim();
        var firstName = $("#user-first").val().trim();
        var lastName = $("#user-last").val().trim();
        var age = $("#user-age").val().trim();
        var zipCode = $("#user-zip").val().trim();

        //this is the authentication email and password check provided by firebase
        //under Sign Up New Users: https://firebase.google.com/docs/auth/web/start
        var promise = auth.createUserWithEmailAndPassword(email, password);
        promise.catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // ...
        });

        var user = firebase.auth().currentUser;
        console.log(user);

        user.updateProfile({

            displayName: userName,
            photoURL: "",

        }).then(function() {
            console.log("success");
            // Update successful.
        }).catch(function(error) {
            console.log("error");
        });
    })

    //watches for login/logout of user
    auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log("logged in");
        } else {
            console.log("not logged in")
        }
    })

    //when user clicks logout button
    $("#logout-btn").on("click", function() {
        auth.signOut();
    })

    //when user clicks login button
    $("#login-btn").on("click", function() {

        email = $("#login-email").val().trim();
        password = $("#login-pw").val().trim();
        var promise = auth.signInWithEmailAndPassword(email, password)

        promise.catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error Code " + errorCode);
            console.log("Error Msg " + errorMessage);
        });
    })


}());