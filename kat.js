var manageUsers = {

    init: function() {

        firebase.initializeApp(config);

        var database = firebase.database();

        var email = "";

        var password = "";

        this.renderDom(database);

        this.userState(database);

        this.handleClicks(database);
<<<<<<< HEAD
=======
        this.createContests(database);
    },
    renderDom: function(database) {},
    createContests: function(database) {
        database.ref('/contests/' + 1).push({
                id: 1,
                CompanyName: "Coca Cola",
                Location: "New York City, NY",
                Prize: "$500",
                Description: "Take a selfie enjoying a delicious coca-cola.",
                ContestEnd: "August 5th, 2017 at 5pm EST",
                Website: "http://www.coca-cola.com/global/"
            });
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1

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
<<<<<<< HEAD

    userRegister: function(database) {

=======
    userRegister: function(database) {
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
        //grab the user's input from the page
        email = $("#user-email").val().trim();

        password = $("#user-pw").val().trim();
<<<<<<< HEAD

        var userName = $("#user-name").val().trim();

            var firstName = $("#user-first").val().trim();

            var lastName = $("#user-last").val().trim();

            var age = $("#user-age").val().trim();

            var zipCode = $("#user-zip").val().trim();

=======
        var userName = $("#user-name").val().trim();
            var firstName = $("#user-first").val().trim();
            var lastName = $("#user-last").val().trim();
            var age = $("#user-age").val().trim();
            var zipCode = $("#user-zip").val().trim();
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
        //this is the authentication email and password check provided by firebase

        //under Sign Up New Users: https://firebase.google.com/docs/auth/web/start

        firebase.auth().createUserWithEmailAndPassword(email, password)

            .catch(function(error) {
<<<<<<< HEAD

=======
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
                var errorCode = error.code;

                var errorMessage = error.message;

                console.log(errorMessage);
<<<<<<< HEAD

=======
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
            });
        var user = firebase.auth().currentUser;

        console.log(user);
<<<<<<< HEAD

        manageUsers.writeUserData(database,user, userName, email, firstName, lastName, age, zipCode);

=======
        manageUsers.writeUserData(database,user, userName, email, firstName, lastName, age, zipCode);
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
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
<<<<<<< HEAD

                manageUsers.userProfile(database,firebaseUser);

=======
                manageUsers.userProfile(database,firebaseUser);
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
            } else {

                console.log("not logged in")

            }

        })
<<<<<<< HEAD

=======
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
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
<<<<<<< HEAD
            var userName = $("#user-name-input").val().trim();
            var firstName = $("#user-first-input").val().trim();
            var lastName = $("#user-last-input").val().trim();
            var age = $("#user-age-input").val().trim();
            var zipCode = $("#user-zip-input").val().trim();

            database.ref('/users/' + currentUser.uid).set({
=======

            var userName = $("#user-name").val().trim();
            var firstName = $("#user-first").val().trim();
            var lastName = $("#user-last").val().trim();
            var age = $("#user-age").val().trim();
            var zipCode = $("#user-zip").val().trim();
            var currentUser = firebase.auth().currentUser;
            firebase.database().ref('/users/' + currentUser.uid).set({
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
                uID: currentUser.uid,
                UserName: userName,
                Email: currentUser.email,
                FirstName: firstName,
                LastName: lastName,
                Age: age,
                ZipCode: zipCode
            });
            $("#update-profile").hide();
<<<<<<< HEAD

=======
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
        })
    },
<<<<<<< HEAD

    writeUserData: function(database,user, userName, email, firstName, lastName, age, zipCode) {

        var currentUser = firebase.auth().currentUser;

        firebase.database().ref('users/' + currentUser.uid).set({

            uID: currentUser.uid,

=======
    writeUserData: function(database,user, userName, email, firstName, lastName, age, zipCode) {
        var currentUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + currentUser.uid).set({
            uID: currentUser.uid,
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
            UserName: userName,

            Email: email,

            FirstName: firstName,

            LastName: lastName,

            Age: age,

            ZipCode: zipCode

        });

    },
<<<<<<< HEAD

=======
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
    userProfile: function(database,user) {
        var currentUser = firebase.auth().currentUser;
        console.log(currentUser);

        database.ref('/users/' + currentUser.uid).on('value', function(user) {
<<<<<<< HEAD

            var userInfo = user.toJSON();

=======
            var userInfo = user.toJSON();
>>>>>>> 1557f4e5ec117e249f40f504a258a3d3b096c5b1
            console.log(userInfo)

            $("#user-first-name").text(userInfo.FirstName);
            $("#user-name").attr("placeholder",userInfo.UserName);
            $("#user-first").attr("placeholder",userInfo.FirstName);
            $("#user-last").attr("placeholder",userInfo.LastName);
            $("#user-name").attr("placeholder",userInfo.UserName);
            $("#user-age").attr("placeholder",userInfo.Age);
            $("#user-zip").attr("placeholder",userInfo.ZipCode);
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