var manageUsers = {
    init: function() {
        firebase.initializeApp(config);
        var database = firebase.database();
        var email = "";
        var password = "";
        this.renderDom(database);
        this.userState(database);
        this.handleClicks(database);
    },
    renderDom: function(database) {},
    userPromise: function(email, password) {
        var promise = firebase.auth().signInWithEmailAndPassword(email, password);
        promise.catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    },
    userRegister: function() {
        //grab the user's input from the page
        email = $("#user-email").val().trim();
        password = $("#user-pw").val().trim();
        //this is the authentication email and password check provided by firebase
        //under Sign Up New Users: https://firebase.google.com/docs/auth/web/start
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
            });
        var user = firebase.auth().currentUser;
        console.log(user);
        manageUsers.writeUserData(user, userName, email, firstName, lastName, age, zipCode);
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                window.location.href = "profile.html";
            }
        })
    },
    userState: function(database) {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                console.log("logged in ");
                console.log(firebaseUser);
                manageUsers.handleClicks(database, firebaseUser);
                manageUsers.userProfile(database,firebaseUser);
            } else {
                console.log("not logged in")
            }
        })
    },
    handleClicks: function(database, firebaseUser) {
        //register
        $("#register-btn").on("click", function(e) {
            e.preventDefault();
            manageUsers.userRegister();
            $("#register-btn").hide();
        })
        //login
        $("#login-btn").on("click", function(e) {
            e.preventDefault();

            email = $("#login-email").val().trim();
            password = $("#login-pw").val().trim();
            manageUsers.userPromise(email, password);
            firebase.auth().onAuthStateChanged(firebaseUser => {
                if (firebaseUser) {
                    window.location.href = "profile.html";
                }
            })
        })
        //logout
        $("#logout-btn").on("click", function() {
            firebase.auth().signOut();
            window.location.href = "index.html";
        })
        //update info
        $("#submit-changes-btn").on("click", function(e, database) {
            e.preventDefault();

            var userName = $("#user-name").val().trim();
            var firstName = $("#user-first").val().trim();
            var lastName = $("#user-last").val().trim();
            var age = $("#user-age").val().trim();
            var zipCode = $("#user-zip").val().trim();

            database.ref('/users/' + currentUser.uid).set({
                uID: currentUser.uid,
                UserName: userName,
                Email: currentUser.email,
                FirstName: firstName,
                LastName: lastName,
                Age: age,
                ZipCode: zipCode
            });
            $("#update-profile").hide();
        })
    },
    writeUserData: function(user, userName, email, firstName, lastName, age, zipCode) {
        firebase.database().ref('users/' + user.uid).set({
            uID: currentUser.uid,
            UserName: userName,
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Age: age,
            ZipCode: zipCode
        });
    },
    userProfile: function(database,user) {
        var currentUser = firebase.auth().currentUser;
        console.log(currentUser);

        database.ref('/users/' + currentUser.uID).on('child_added', function(user) {
            var userInfo = user.toJSON();

            console.log('Welcome ' + userInfo.FirstName);
        });
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