var handleLikes = {
    init: function() {

        this.handleClicks();


    },
    handleClicks: function() {

        //likes
        $(document).on("click", "#like-entry-no", function(e) {
            var contestID = $("#contest-photo-entries").data("id");
            var specID = $(this).data("id");
            var goHere = "";
            goHere = contestID + "/" + specID;
            var specDataID = contestID + "-" + specID;
            specDataID = "[data-id='"+specDataID+"']";
            console.log(specDataID)

            var ref = firebase.database().ref('contests/' + contestID + '/' + specID);
            ref.once("value").then(function(snapshot) {
                console.log("working")
                var currentLikes = snapshot.val().entryLikes;
                currentLikes = currentLikes + 1;

                ref.update({
                  entryLikes: currentLikes
                })
                $(specDataID).text(snapshot.val().entryLikes + " Likes")
            })

            


        }); //close onclick
    }//close handleClicks
}//close object


handleLikes.init();