(function () {	
	$('#courses').append('<li>' + 
									 '<div class="item">' +
									 '<p class="worklist-title">' + 'FUCK' + '</p>' +
									 '<i class="fa fa-trash-o worklist-delete"></i>' + 
									 '</div>' +
								 	 '</li>');


	if (Parse.User.current()) {
		showLogout();
		render();
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
	var user = Parse.User.current();
	var relation = user.relation("Worklist");
	relation.query().find({
		success: function(results) {
			console.log(results);
			for (var i = 0; i < results.length; i++) {
				$('#courses').append('<li>' + 
									 '<div class="item">' +
									 '<p class="worklist-title">' + results[i].get("section_id") + '</p>' +
									 '<i class="fa fa-trash-o worklist-delete"></i>' + 
									 '</div>' +
								 	 '</li>');
			}
		}
	});
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