var manageUsers = {

    init: function() {

        firebase.initializeApp(config);
        var database = firebase.database();

        var email = "";
        var password = "";
        this.renderDom(database);
        this.userState(database);
        this.handleClicks(database);
        this.createContests(database);
        this.renderDom();
    },


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
    },

    renderDom: function() {

    },

    userPromise: function(email, password) {

        var promise = firebase.auth().signInWithEmailAndPassword(email, password);
        promise.catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });

    },

    userRegister: function(database) {
        email = $("#user-email").val().trim();
        password = $("#user-pw").val().trim();
        var userName = $("#user-name").val().trim();
        var firstName = $("#user-first").val().trim();
        var lastName = $("#user-last").val().trim();
        var age = $("#user-age").val().trim();
        var zipCode = $("#user-zip").val().trim();

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
        manageUsers.writeUserData(database, user, userName, email, firstName, lastName, age, zipCode);
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
                manageUsers.userProfile(database, firebaseUser);
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
            var userName = $("#user-name-input").val().trim();
            var firstName = $("#user-first-input").val().trim();
            var lastName = $("#user-last-input").val().trim();
            var age = $("#user-age-input").val().trim();
            var zipCode = $("#user-zip-input").val().trim();
            var currentUser = firebase.auth().currentUser;
            firebase.database().ref('/users/' + currentUser.uid).set({

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
        //upload profile pic
        $("#upload-profile-pic").on("change", function(e, database) {
            e.preventDefault();
            manageUsers.uploadProfilePic(e);
        })
    },

    writeUserData: function(database, user, userName, email, firstName, lastName, age, zipCode) {

        var currentUser = firebase.auth().currentUser;
        firebase.database().ref('users/' + currentUser.uid).set({
            uID: currentUser.uid,
            UserName: userName,
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Age: age,
            ZipCode: zipCode
        });
    },

    userProfile: function(database, user) {
        var currentUser = firebase.auth().currentUser;


        database.ref('/users/' + currentUser.uid).on('value', function(user) {
            var userInfo = user.toJSON();
            console.log(userInfo)
            $("#user-first-name").text(userInfo.FirstName);
            $("#user-name").attr("placeholder", userInfo.UserName);
            $("#user-first").attr("placeholder", userInfo.FirstName);
            $("#user-last").attr("placeholder", userInfo.LastName);
            $("#user-name").attr("placeholder", userInfo.UserName);
            $("#user-age").attr("placeholder", userInfo.Age);
            $("#user-zip").attr("placeholder", userInfo.ZipCode);

            $("#profileimageContainer").attr("src",userInfo.ProfilePicUrl);
        });
    },
    uploadProfilePic: function(e) {

        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();

        // File or Blob named mountains.jpg
        var file = e.target.files[0];

        // Create the file metadata
        var metadata = {
            contentType: 'image/jpeg'
        };
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('profilepics/' + file.name).put(file, metadata);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            function(error) {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            function() {
                // Upload completed successfully, now we can get the download URL
                var downloadURL = uploadTask.snapshot.downloadURL;
                var currentUser = firebase.auth().currentUser;
                firebase.database().ref('users/' + currentUser.uid).set({
                    ProfilePicUrl: downloadURL
                });
                console.log(downloadURL)
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