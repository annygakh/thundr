var Parse = require('parse').Parse;

Parse.initialize('GPBcV6zGuJ2E6OD9nsBZ5q3XnLAkrybuA8RFC4HB', '0mfkZM9QM8Vnc5fMt3JrKpGwLQbKrfYCvohsNgBG');

var Section = Parse.Object.extend("SectionTest");
var SubSection = Parse.Object.extend("SubSectionTest");

var query = new Parse.Query(Section);
query.each(function(section) {
		addReqs(section);
		sleep(250);
	},{
		success: function(section) {
			if (section != undefined)
				console.log(section.get('section_id'));
			else
				console.log("section was undefined");
		},
		error: function(error) {
			console.log("Each loop failed: " + error.code + " " + error.message);
		}
	}
);

function addReqs(section) {
	var prereq_ids = section.get('prereqs_str');
	var req_query = new Parse.Query(Section);
	req_query.limit(1000);
	req_query.containedIn('section_id', prereq_ids);
	req_query.find({
		success: function(prereqs) {
			for (var i = 0; i < prereqs.length; i++) {
				var prereq = prereqs[i];
				section.relation('prereqs').add(prereq);
				prereq.relation('postreqs').add(section);
				prereq.save(null, {
					success: function(prereq) {
						var prereq_id = prereq.get('section_id');
						var section_id = section.get('section_id');
						console.log(section_id + " < POSTREQ FOR > " + prereq_id);
					},
					failure: function(prereq, error) {
						var prereq_id = prereq.get('section_id');
						console.log("failed due to set " + prereq_id + " postreq relation due to " + error.message);
					}
				});
			}
			if (prereqs.length > 0) {
				section.save(null, {
					success: function(section) {
						var section_id = section.get('section_id');
						console.log(section_id);
					},
					failure: function(section, error) {
						var section_id = section.get('section_id');
						console.log("failed to set " + section_id + " prereq relation due to " + error.message);
					}
				});
			}
		},
		error: function(error) {
			console.log("Failed to query reqs: " + error.code + " " + error.message);
		}
	});
}

function sleep(time) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
}