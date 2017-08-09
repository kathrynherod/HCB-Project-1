var manageUsers = {

    init: function() {
        firebase.initializeApp(config);
        var database = firebase.database();
        var email = "";
        var password = "";
        var contestCount = 1;
        this.userState(database);
        this.handleClicks();
        this.displayContestPhotos();
        this.writeContests();
        this.writeBrowseContests();
        this.facebookAPI();
    },
    displayContestPhotos: function() {
        var contestID = $("#contest-photo-entries").data("id");

        firebase.database().ref('contests/' + contestID).orderByChild("entryLikes").on("child_added" || "child_changed", function(data) {
            if (data.val().entryNo % 2 === 0) {
                //don't show even children in db bc they are duplicates
            } else {
                console.log(data.val().entryNo)
                var conIdPlusEntId = contestID + "-" + data.val().entryNo;
                var beforeUserImage = "<li class='list-group-item submissions' id='submissionNumber'><div class='panel panel-default'><div class='panel-heading white'><div class='row'><div class='col-md-3 col-sm-3 col-xs-3'><img class='img-responsive img-rounded usr-photo' id='user-photo' src='";
                var beforeUserName = "'></div><div class='col-md-4 col-sm-4 col-xs-4' id='user-name'><strong>";
                var beforeUserLoc = "</strong></div><div class='col-md-5 col-sm-5 col-xs-5' id='user-location'><i class='fa fa-map-marker' aria-hidden='true'></i><strong>";
                var beforeUserPhoto = "</strong></div></div><div class='panel-body'><div class='row'><img class='img-responsive contest-photo' src='";
                var afterPhoto = "'></div><div class='row'><div class='col-md-12 col-sm-12 col-xs-12'><div class='row' id='social-row'><div class='like-button center-this col-md-6 col-sm-6 col-xs-6'><div id='like-entry-no' data-id='";
                var afterLikeBtn = "'><i class='fa fa-thumbs-o-up' aria-hidden='true' id='entry-likes-btn'></i>Like This</div></div><div class='col-md-6 col-sm-6 col-xs-6'><p class='center-this' id='entry-likes' data-id='" + conIdPlusEntId + "'>";
                var closeIt = "</p></div></div></div></div></div></div></div></li>";
                var contestUserImage = data.val().entryProfilePic;
                var contestUserName = data.val().entryUser;
                var contestUserLocation = data.val().entryLoc;
                var contestUserPhoto = data.val().entryURL;
                var contestLikeButton = data.val().entryNo;
                var contestLikes = data.val().entryLikes + " Likes";

                $("#contest-photo-entries").append(beforeUserImage + contestUserImage + beforeUserName + contestUserName + beforeUserLoc + contestUserLocation + beforeUserPhoto + contestUserPhoto + afterPhoto + contestLikeButton + afterLikeBtn + contestLikes + closeIt);
            }
        })
    },
    writeBrowseContests: function() {
        var pathname = window.location.pathname;

        var pathSplit = pathname.split("/");
        var pathLength = pathSplit.length - 1;
        var pathEnd = pathSplit[pathLength];
        console.log(pathEnd)

        if (pathEnd === "browse_contest.html" || pathEnd === "index.html") {
            firebase.database().ref('contest-info/').on("value", function(snapshot) {
                var getNumContests = snapshot.numChildren();
                for (i = getNumContests; i > 0; i--) {

                    firebase.database().ref('contest-info/' + i + "/").once("value", function(data) {
                        var startFig = "<figure class='effect-oscar  wowload fadeInUp' id='figure-'" + i + ">";
                        var figLog = "<img src='" + data.val().companyLogoUrl + "' alt='company-logo' /><figcaption>";
                        var conName = "<h2 id='company-name-'" + i + ">" + data.val().companyName + "</h2>";
                        var conDesc = "<p class='center-this' id='company-desc-'" + i + ">" + data.val().contestDesc + "</p>";
                        var conEnt = "<br><p class='center-this' id='company-entries-'" + i + ">Entries: " + data.val().contestEntries + "</p>";
                        var conPrize = "<p class='center-this' id='company-prize-'" + i + ">Prize: " + data.val().contestPrize + "</p>";
                        var conLink = "<br><p class='center-this'><a href='contests/" + i + ".html' id='" + i + "'>View contest page</a></p></figcaption></figure>"

                        $("#trending-contests").after(startFig + figLog + conDesc + conEnt + conPrize + conLink);
                    })
                }
            })
        } else {}
    },
    writeContests: function() {
        var pathname = window.location.pathname;

        var pathSplit = pathname.split("/");
        var pathLength = pathSplit.length - 1;
        var pathEnd = pathSplit[pathLength];
        var currentContest = pathEnd[0];

        if (pathEnd === "index.html" || pathEnd === "login.html" || pathEnd === "register.html" || pathEnd === "profile.html" || pathEnd === "browse_contest.html" || pathEnd === "create_contest.html") {
            console.log("")
        } else {
            firebase.database().ref('contest-info/' + currentContest + "/").on("value", function(data) {
                $('#company-name-' + currentContest).text(data.val().companyName);
                $('#company-image-' + currentContest).attr("src", data.val().companyLogoUrl).addClass("co-photo-logo center-block");
                $('#contest-description-' + currentContest).text(data.val().contestDesc).after("<div id='fb-root'></div>");
                $('#fb-like').attr("data-href", "https://kathrynherod.github.io/HCB-Project-1/contests/" + currentContest + ".html");
                $('#co-prize-' + currentContest).text(data.val().contestPrize);
                $('#co-end-date-' + currentContest).text(data.val().contestEndDate);
                $('#co-entries-' + currentContest).text(data.val().contestEntries);
                $('#co-location-' + currentContest).text(data.val().companyLocation);
                $('#co-website-' + currentContest).attr("href", data.val().companyWebsiteUrl);
            })
            firebase.database().ref('contests/' + currentContest + "/").on("value", function(snapshot) {
                var getEntries = parseInt(snapshot.numChildren()) / 2;
                firebase.database().ref('contest-info/' + currentContest + "/").update({
                    contestEntries: getEntries,
                });
            });
        }
    },
    facebookAPI: function() {

        $("body").append("<script>window.fbAsyncInit=function(){FB.init({appId:'330846097371920',autoLogAppEvents:!0,xfbml:!0,version:'v2.10'}),FB.AppEvents.logPageView()},function(e,n,t){var o,s=e.getElementsByTagName(n)[0];e.getElementById(t)||((o=e.createElement(n)).id=t,o.src='https://connect.facebook.net/en_US/sdk.js',s.parentNode.insertBefore(o,s))}(document,'script','facebook-jssdk');</script><div id='fb-root'></div><script>!function(e,n,t){var o,c=e.getElementsByTagName(n)[0];e.getElementById(t)||((o=e.createElement(n)).id=t,o.src='//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10&appId=330846097371920',c.parentNode.insertBefore(o,c))}(document,'script','facebook-jssdk');</script>")
    },
    displayUserEntries: function(uid) {


        firebase.database().ref('contests-entries-by-userid/' + uid).on("child_added" || "child_changed", function(data) {
            if (data.val().entryNo % 2 === 0) {
                //don't show even children in db bc they are duplicates
            } else {
                console.log(data.val().userEntryNo)
                var conIdPlusEntId = data.val().contestNo + "-" + data.val().entryNo;
                var beforeUserImage = "<li class='list-group-item submissions' id='submissionNumber'><div class='panel panel-default'><div class='panel-heading white'><div class='row'><div class='col-md-3 col-sm-3 col-xs-3'><img class='img-responsive img-rounded usr-photo' id='user-photo' src='";
                var beforeUserName = "'></div><div class='col-md-4 col-sm-4 col-xs-4' id='user-name'><strong>";
                var beforeUserLoc = "</strong></div><div class='col-md-5 col-sm-5 col-xs-5' id='user-location'><i class='fa fa-map-marker' aria-hidden='true'></i><strong>";
                var beforeUserPhoto = "</strong></div></div><div class='panel-body'><div class='row'><img class='img-responsive contest-photo' src='";
                var afterPhoto = "'></div></div></div></div></li>";

                var contestUserImage = data.val().userProfilePic;
                var contestUserName = data.val().userName;
                var contestUserLocation = data.val().userLocation;
                var contestUserPhoto = data.val().photoUrl;
                var contestLikeButton = data.val().userEntryNo;
                var contestLikes = data.val().userEntryLikes + " Likes";

                $("#user-photo-entries").append(beforeUserImage + contestUserImage + beforeUserName + contestUserName + beforeUserLoc + contestUserLocation + beforeUserPhoto + contestUserPhoto + afterPhoto);
            }
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
    userState: function(database, ) {
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                console.log("logged in ");
                console.log("Firebase Auth User ")
                console.log(firebaseUser.uid);
                var myUser = firebaseUser.uid;
                manageUsers.displayUserEntries(myUser);
                manageUsers.handleClicks(database, firebaseUser, );
                manageUsers.userProfile(database, firebaseUser);
                $("#act-login-toggle-contest").attr("href", "../profile.html").text("My Account");
                $("#act-login-toggle").attr("href", "profile.html").text("My Account");


            } else {
                console.log("not logged in");
                $("#toggle-upload-cpic").html("<strong>Please login or register to enter this contest</strong>");
                $("#pic-upload-prog").hide();
                $("#act-login-toggle-contest").attr("href", "../login.html").text("Login");
                $("#act-login-toggle").attr("href", "login.html").text("Login");
            }
        })
    },
    handleClicks: function(database, firebaseUser) {

        //register user
        $("#register-btn").on("click", function(e) {
            e.preventDefault();
            managerUsers.registerUser();
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
        });

        //logout
        $("#logout-btn").on("click", function() {
            firebase.auth().signOut();
            window.location.href = "index.html";
        });

        //update info
        $("#submit-changes-btn").on("click", function(e, database) {
            e.preventDefault();
            var userName = $("#user-name-input").val().trim();
            var firstName = $("#user-first-input").val().trim();
            var lastName = $("#user-last-input").val().trim();
            var age = $("#user-age-input").val().trim();
            var zipCode = $("#user-zip-input").val().trim();
            var currentUser = firebase.auth().currentUser;
            firebase.database().ref('/users/' + currentUser.uid).update({

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
            $("#edit-prof-info").text("Thanks for updating your profile.")

        });

        //upload profile pic
        $("#upload-profile-pic").on("change", function(e, database) {
            e.preventDefault();
            manageUsers.uploadProfilePic(e);
        });

        //upload contest pic
        $("#upload-contest-photo").on("change", function(e) {
            e.preventDefault();
            var contestID = $("#upload-contest-photo").data("id");
            var currentUser = firebase.auth().currentUser;
            firebase.database().ref('/users/' + currentUser.uid).on('value', function(user) {
                userInfo = user.toJSON();
            })
            manageUsers.uploadContestPic(e, userInfo, contestID);
        });
        //create contest
        $("#create-contest-btn").on("click", function(e) {
            e.preventDefault();

            var coName = $("#company-name").val().trim();
            var coLogo = $("#company-logo").val().trim();
            var coDesc = $("#company-contest-description").val().trim();
            var coPrize = $("#company-prize").val().trim();
            var coExp = $("#company-expiration-date").val().trim();
            var coLoc = $("#company-location").val().trim();
            var coURL = $("#company-website").val().trim();

            var contestCount = "";
            firebase.database().ref('contest-info/').once("value", function(snapshot) {
                contestCount = snapshot.numChildren();
                contestCount = parseInt(contestCount);
                console.log("current contest count " + contestCount)
                var updatedCount = contestCount + 1;

                firebase.database().ref('contest-info/' + updatedCount + "/").set({
                    companyName: coName,
                    companyLogoUrl: coLogo,
                    contestDesc: coDesc,
                    contestPrize: coPrize,
                    contestEndDate: coExp,
                    contestEntries: 0,
                    companyLocation: coLoc,
                    companyWebsiteUrl: coURL
                });
                window.location.href = "contests/" + updatedCount + ".html";

            })
        });
    },
    registerUser: function() {
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

        manageUsers.userPromise(email, password);

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
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
                window.location.href = "profile.html";
            } else {}
        })
        $("#register-btn").hide();

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

            if (userInfo.ProfilePicUrl === "") {
                $("#profileimageContainer").attr("src", "images/placeholder.png");
                console.log(userInfo.ProfilePicUrl)
            } else {
                $("#profileimageContainer").attr("src", userInfo.ProfilePicUrl);

            }
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
                var uploadStatus = "Upload is " + progress + " % done";
                $("#photo-upload-progress").text(uploadStatus);
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
        var uploadTask = storageRef.child('/contestpics/' + contestID + '/' + file.name).put(file, metadata);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                var uploadStatus = 'Upload is ' + progress + '% done';
                $("#photo-upload-progress").text(uploadStatus);
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        //console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        //console.log('Upload is running');
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
                } //close switch
            }, //close error func
            //close on
            function() {
                // Upload completed successfully, now we can get the download URL
                var timestamp = Date();
                downloadURL = uploadTask.snapshot.downloadURL;
                var currentUser = firebase.auth().currentUser;

                console.log(timestamp);

                firebase.database().ref('/users/' + currentUser.uid).update({
                    ContestEntries: userInfo.ContestEntries + 1
                });
                firebase.database().ref('contests-entries-by-userid/' + currentUser.uid + "/" + parseInt(userInfo.ContestEntries + 1)).set({
                    userID: userInfo.uID,
                    contestNo: contestID,
                    photoUrl: downloadURL,
                    userEmail: userInfo.Email,
                    userName: userInfo.UserName,
                    userProfilePic: userInfo.ProfilePicUrl,
                    userLocation: userInfo.ZipCode,
                    userEntryNo: userInfo.ContestEntries + 1,
                    userEntryLikes: 0,
                    userEntryComments: 0
                });
                var updateEntry = "";
                firebase.database().ref('contests/' + contestID).once("value", function(snapshot) {
                    updateEntry = snapshot.numChildren();
                    console.log(parseInt(updateEntry))
                })

                firebase.database().ref().child("contests-entries-by-userid").once("child_added", function(data) {
                    firebase.database().ref('contests/' + contestID + "/" + updateEntry).set({
                        entryNo: updateEntry,
                        entryURL: downloadURL,
                        entryUser: userInfo.UserName,
                        entryProfilePic: userInfo.ProfilePicUrl,
                        entryLoc: userInfo.ZipCode,
                        entryTimestamp: timestamp,
                        entryLikes: 0,
                        entryComments: 0
                    })
                });
            }); //close then function
    } //close uploadContestPic

} //close object

var config = {
    apiKey: "AIzaSyDJJ5pLdp4yBK2xAildqSFsKNWY5FsVaJo",
    authDomain: "groupproject1-4b4d1.firebaseapp.com",
    databaseURL: "https://groupproject1-4b4d1.firebaseio.com",
    projectId: "groupproject1-4b4d1",
    storageBucket: "groupproject1-4b4d1.appspot.com",
    messagingSenderId: "345420353976"
}

manageUsers.init();