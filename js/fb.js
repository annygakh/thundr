(function () {	
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
		    	FB.api('/me', function(response) {
		    		user.set("name", response["first_name"]);	
		    		user.save();
		    	});
	    		alert("User signed up and logged in through Facebook!");
		    } else {
		    	alert("User logged in through Facebook!");
		    }
	    showLogout();
	    render();
		},
		error: function(user, error) {
			alert("User cancelled the Facebook login or did not fully authorize.");
	}
	});
});

function render() {
	var user = Parse.User.current();
	if (user) {
		var relation = user.relation("Worklist");
		relation.query().find({
			success: function(results) {
				for (var i = 0; i < results.length; i++) {
					var subsection = results[i];
					var start = subsection.get("startTime");
					var end = subsection.get("endTime");
					var days = subsection.get("days");
					var course_color = 'green';
					// compare all courses in worklist
					for (var j = i; j < results.length; j++) {
						var comp = results[j];
						// check if days overlap
						for (var d = 0; d < days.length; d++) {
							if (comp.get("days").indexOf(days[d])) {
								// check if times overlap
								if (start >= comp.get("startTime") && start < comp.get("endTime")) {
					  				course_color = 'red'
					  			} else if (end > comp.get("startTime") && end <= comp.get("endTime")) {
					  				course_color = 'red'
					  			} else if (start < comp.get("startTime") && end > comp.get("endTime")) {
					  				course_color = 'red'
					  			} else if (start > comp.get("startTime") && end < comp.get("endTime")) {
					  				course_color = 'red'
					  			} else {
					  				course_color = 'none'
					  			}
							}
						}
			  		}

					$('#courses').append('<li>' + 
						'<div class="item" style="background-color:' + course_color + '">' +
						'<p class="worklist-title">' + subsection.get("section_id") + '</p>' +
						'<i class="fa fa-trash-o worklist-delete"></i>' + 
						'</div>' +
						'</li>');
				}
			}
		});
	} else {
		$('#courses').empty();
	}
}

$(".fb-logout").click(function() {
	Parse.User.logOut();
	alert("User logged out!");
	showLogin();
	render();
});

function showLogin() {
	$(".fb-logout").css( "right", "-9999px");
	$(".fb-login").css( "right", "30px");
};

function showLogout() {
	$(".fb-login").css( "right", "-9999px");
	$(".fb-logout").css( "right", "30px");
};