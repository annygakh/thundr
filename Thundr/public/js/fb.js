var fb = {};
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

function render () {
	var user = Parse.User.current();
	if (user) {
		var relation = user.relation("Worklist");
		relation.query().find({
			success: function(results) {
				fb.reload_worklist(results);
			}
		});
	} else {
		$('#courses').empty();
	}
}

fb.reload_worklist = function (results) {
	$('#courses').empty();
	for (var i = 0; i < results.length; i++) {
		var subsection = results[i];
		var start = subsection.get("startTime");
		var end = subsection.get("endTime");
		var days = subsection.get("days");
		var conflict = false;
		// compare all courses in worklist
		// console.log("course:")
		// console.log(subsection.get("section_id"));
		for (var j = i+1; j < results.length; j++) {
			var comp = results[j];
			// check if days overlap
			// console.log("comparing:")
			// console.log(comp.get("section_id"));
			for (var d = 0; d < days.length; d++) {
				if (comp.get("days").indexOf(days[d]) != -1) {

					// check if times overlap
					if (start >= comp.get("startTime") && start < comp.get("endTime")) {
		  				conflict = true;
		  			} else if (end > comp.get("startTime") && end <= comp.get("endTime")) {
		  				conflict = true;
		  			} else if (start < comp.get("startTime") && end > comp.get("endTime")) {
		  				conflict = true;
		  			} else if (start > comp.get("startTime") && end < comp.get("endTime")) {
		  				conflict = true;
		  			}
				}
			}
			var course_color;
			if (conflict)
				course_color = 'red'
			else
				course_color = 'none'
  		}

  		console.log("section: " + subsection.get("section_id"));
  		console.log("subsection: " + subsection.get("subsection_id"));

		$('#courses').append('<li>' + 
			'<div class="item" style="background-color:' + course_color +  '" id="' + subsection.id  + '">' +
			'<p class="worklist-title">' + subsection.get("section_id") + ' - ' + subsection.get("subsection_id") + '</p>' +
			'<i class="fa fa-trash-o worklist-delete"></i>' + 
			'</div>' +
			'</li>');
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