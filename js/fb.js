(function () {
	console.log("FUCK");
	if (Parse.User.current()) {
		showLogout();

		// render worklist
	} else {
		showLogin();
	}
})();

$(".fb-login").click(function() {
  Parse.FacebookUtils.logIn(null, {
	  success: function(user) {
	    if (!user.existed()) {
	    	// var firstName;
	    	// user.setUsername()
	    	FB.api('/me', function(response) {
					user.set("name", response["first_name"]);	
					user.save();
				});
	      alert("User signed up and logged in through Facebook!");
	    } else {
	      alert("User logged in through Facebook!");
	    }
	    

			showLogout();
	  },
	  error: function(user, error) {
	    alert("User cancelled the Facebook login or did not fully authorize.");
	  }
	});
});

function render() {
	var query = new Parse.Query
	var user = Parse.User.current();
	var relation = user.relation("Worklist");
	var subsections = relation.query().find({
		success: function(results) {
			$('#courses').append('<li>' + 
									'<div class="item">' +
									'<p class="worklist-title">' + course_id + '</p>' +
									'<i class="fa fa-trash-o worklist-delete"></i>' + 
									'</div>' +
								 '</li>');
		}
	})
	for ()
}

$(".fb-logout").click(function() {
	Parse.User.logOut();
	alert("User logged out!");
	showLogin();
});

function showLogin() {
	$(".fb-logout").css( "right", "-9999px");
	$(".fb-login").css( "right", "30px");
};

function showLogout() {
	$(".fb-login").css( "right", "-9999px");
	$(".fb-logout").css( "right", "30px");
};