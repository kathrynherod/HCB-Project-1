var manageUsers = {

    init: function() {

        firebase.initializeApp(config);
        var database = firebase.database();

        var email = "";
        var password = "";
        this.userState(database);
        this.handleClicks();
        this.displayContestPhotos();


    },
    displayContestPhotos: function() {
        var contestID = $("#contest-photo-entries").data("id");


        firebase.database().ref('/contests/' + contestID).on('child_added', function(data) {
            var beforeUserImage = "<li class='list-group-item submissions' id='submissionNumber'><div class='panel panel-default'><!-- Default panel contents --><div class='panel-heading white'><div class='row'><div class='col-md-3 col-sm-3 col-xs-3'><img class='img-responsive img-rounded usr-photo' id='user-photo' src='";
            var beforeUserName = "'/></div><div class='col-md-4 col-sm-4 col-xs-4' id='user-name'><strong>";
            var beforeUserLoc = "</strong></div><div class='col-md-5 col-sm-5 col-xs-5' id='user-location'><i class='fa fa-map-marker' aria-hidden='true'></i><strong>";
            var beforeUserPhoto = "</strong></div></div><div class='panel-body'><div class='row'><img class='img-responsive contest-photo' src='";
            var afterPhoto = "'/></div><div class='row'><div class='col-md-1 col-sm-1 col-xs-1'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></div><div class='col-md-4 col-sm-4 col-xs-4'><p id='likes'>451 likes</p></div><div class='col-md-1 col-sm-1 col-xs-1'><i class='fa fa-comments-o' aria-hidden='true'></i></div><div class='col-md-5  col-sm-5 col-xs-5'><p id='comments'>5 comments</p></div></div></div></div></div></li>";

            var contestUserImage = data.val().entryProfilePic;
            var contestUserName = data.val().entryUser;
            var contestUserLocation = data.val().entryLoc;
            var contestUserPhoto = data.val().entryURL;


            $("#contest-photo-entries").append(beforeUserImage + contestUserImage + beforeUserName + contestUserName + beforeUserLoc + contestUserLocation + beforeUserPhoto + contestUserPhoto + afterPhoto);
        })

    },
    userPromise: function(email, password) {

        var promise = firebase.auth().signInWithEmailAndPassword(email, password);
        promise.catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            $("#login-error").text(errorMessage)
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
    userState: function(database, ) {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                console.log("logged in ");
                console.log("Firebase Auth User ")
                console.log(firebaseUser);
                manageUsers.handleClicks(database, firebaseUser, );
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
                } else {

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
                ZipCode: zipCode,
                ProfilePicUrl: ""
            });
            $("#update-profile").hide();

        })
        //upload profile pic
        $("#upload-profile-pic").on("change", function(e, database) {
            e.preventDefault();
            manageUsers.uploadProfilePic(e);
        })
        //upload contest pic
        $("#upload-contest-photo").on("change", function(e) {
            e.preventDefault();

            var contestID = $("#upload-contest-photo").data("id");
            var currentUser = firebase.auth().currentUser;

            firebase.database().ref('/users/' + currentUser.uid).on('value', function(user) {
                userInfo = user.toJSON();
            })
            manageUsers.uploadContestPic(e, userInfo, contestID);

        })
    },
    writeUserData: function(database, user, userName, email, firstName, lastName, age, zipCode) {

        var currentUser = firebase.auth().currentUser;
        firebase.database().ref('/users/' + currentUser.uid).set({
            uID: currentUser.uid,
            UserName: userName,
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Age: age,
            ZipCode: zipCode,
            ProfilePicUrl: "",
            ContestEntries: 0
        });
    },
    userProfile: function(database, currentUser) {
        var currentUser = firebase.auth().currentUser;

        database.ref('/users/' + currentUser.uid).on('value', function(user) {
            var userInfo = user.toJSON();
            console.log("Our Database Info ");
            console.log(userInfo);
            $("#user-first-name").text(userInfo.FirstName);
            $("#user-name-input").attr("placeholder", userInfo.UserName);
            $("#user-first-input").attr("placeholder", userInfo.FirstName);
            $("#user-last-input").attr("placeholder", userInfo.LastName);
            $("#user-name-input").attr("placeholder", userInfo.UserName);
            $("#user-age-input").attr("placeholder", userInfo.Age);
            $("#user-zip-input").attr("placeholder", userInfo.ZipCode);

            $("#profileimageContainer").attr("src", userInfo.ProfilePicUrl);
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
                firebase.database().ref('/users/' + currentUser.uid).update({
                    ProfilePicUrl: downloadURL
                });
                console.log(downloadURL)
            }
        );
    },
    uploadContestPic: function(e, userInfo, contestID) {

        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();

        // File or Blob named mountains.jpg
        var file = e.target.files[0];
        var downloadURL = "";
        // Create the file metadata
        var currentUser = firebase.auth().currentUser;
        var metadata = {
            contentType: 'image/jpeg',
            customMetadata: {
                'location': userInfo.ZipCode,
                'uid': currentUser.uid,
                'user-name': userInfo.UserName,
                'contest': contestID,
                'user-profile-pic': userInfo.ProfilePicUrl
            }
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('contestpics/' + contestID + '/' + file.name).put(file, metadata);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                var uploadStatus = 'Upload is ' + progress + '% done';
                $("#photo-upload-progress").text(uploadStatus);
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    case firebase.storage.TaskState.SUCCESS: // or 'running'
                        console.log('Upload successful');
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
            function(complete) {
                // Upload completed successfully, now we can get the download URL
                downloadURL = uploadTask.snapshot.downloadURL;
                var currentUser = firebase.auth().currentUser;


                firebase.database().ref('/users/' + currentUser.uid).update({
                    ContestEntries: userInfo.ContestEntries + 1
                });
                firebase.database().ref('/contests-entries-by-userid/' + currentUser.uid + "/" + parseInt(userInfo.ContestEntries + 1)).set({
                    userID: userInfo.uID,
                    contestNo: contestID,
                    photoUrl: downloadURL,
                    userEmail: userInfo.Email,
                    userName: userInfo.UserName,
                    userProfilePic: userInfo.ProfilePicUrl,
                    userLocation: userInfo.ZipCode,
                    userEntryNo: userInfo.ContestEntries + 1
                });

                var updateEntry = "";
                firebase.database().ref().child("contests").child("1").child("entries").once("value", function(data) {
                    updateEntry = parseInt(data.val());
                    console.log(updateEntry)
                    firebase.database().ref().child("contests-entries-by-userid").once("child_changed", function(data) {
                        firebase.database().ref('/contests/' + contestID).push({
                            entryNo: updateEntry + 1,
                            entryURL: downloadURL,
                            entryUser: userInfo.UserName,
                            entryProfilePic: userInfo.ProfilePicUrl,
                            entryLoc: userInfo.ZipCode
                        })
                        firebase.database().ref('/contests/' + contestID).update({
                            entries: updateEntry + 1
                        });
                    });
                })


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