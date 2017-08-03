
$("#login-btn").on("click", function() {

	var email = $("#login-email").val().trim();
	var password = $("#login-pw").val().trim();

	database.ref(data);
	$("#user-first-name").text(data.FirstName);

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });


})