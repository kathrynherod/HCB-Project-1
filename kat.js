var manageUsers = {
    init: function() {
        firebase.initializeApp(config);
        var database = firebase.database();
        //var auth = firebase.auth();
      
        var email = "";
        var password = "";
        this.renderDom(database);
        this.handleClicks(database);
        this.userState(database);
        this.userProfile(database);
    },

    renderDom: function(database) {

    },
    userPromise: function(email, password) {
        var promise = firebase.auth().signInWithEmailAndPassword(email, password);
        promise.catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // ...
        });
    },
    userRegister: function() {
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
        manageUsers.userPromise(email, password);

        var user = firebase.auth().currentUser;
        console.log(user);

        user.updateProfile({

            displayName: userName,
            photoURL: "",

        }).then(function() { console.log("profile update success"); }).catch(function(error) { console.log("profile update error"); });

    },
    userState: function(auth) {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                console.log("logged in");
            } else {
                console.log("not logged in")
            }
           
        })
    },
    handleClicks: function(database) {
        //register
        $("#register-btn").on("click", function(e) {
            e.preventDefault();
            manageUsers.userRegister();
        })
        //login
        $("#login-btn").on("click", function(e) {
            e.preventDefault();

            email = $("#login-email").val().trim();
            password = $("#login-pw").val().trim();

            manageUsers.userPromise(email, password);

            firebase.auth().onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    window.location.href="profile.html"; 
                } 
            })
        })
        //logout
        $("#logout-btn").on("click", function() {
            firebase.auth().signOut();
            window.location.href="index.html"; 
        })
    },
    userProfile: function(database) {
       
    }

}
var config = {
    apiKey: "AIzaSyDOjDpYcoEnBzdA5y3d6EPrRcmMzIq5aBc",
    authDomain: "groupproject1-4b4d1.firebaseapp.com",
    databaseURL: "https://groupproject1-4b4d1.firebaseio.com",
    projectId: "groupproject1-4b4d1",
    storageBucket: "groupproject1-4b4d1.appspot.com",
    messagingSenderId: "345420353976"
}
manageUsers.init();