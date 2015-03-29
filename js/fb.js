(function () {
	if (Parse.User.current()) {
		showLogout();
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