firebase.auth();
$("#login-btn").on("click", function() {

	var email = $("#login-email").val().trim();
	var password = $("#login-pw").val().trim();

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
})