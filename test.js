var Parse = require('parse').Parse;
var Assert = require('assert');

Parse.initialize('GPBcV6zGuJ2E6OD9nsBZ5q3XnLAkrybuA8RFC4HB', '0mfkZM9QM8Vnc5fMt3JrKpGwLQbKrfYCvohsNgBG');

var Section = Parse.Object.extend("Section");
var SubSection = Parse.Object.extend("SubSection");

var sec_query = new Parse.Query(Section);
sec_query.each(function(section) {
	testReqs(section);
});

var sub_query = new Parse.Query(SubSection);
sub_query.each(function(subsection) {
	testSubsection(subsection);
});


function testReqs(section) {
	var prereqs_str = section.get('prereqs_str');
	var prereqs_rel = section.relation('prereqs');
	prereqs_rel.query().find().then(function(prereqs) {
		var prereqs_rel_str = [];
		for (var i = 0; i < prereqs.length; i++)
			prereqs_rel_str.push(prereqs[i].get('section_id'));

		for (var i = 0; i < prereqs_str.length; i++) {
			var exists_id = prereqs_str[i];
			var exists_query = new Parse.Query(Section);
			exists_query.equalTo('section_id', exists_id);
			exists_query.first().then(function(existing_section) {
				if (existing_section != null) {
					// All items from prereqs_str are in prereqs_rel unless they are not in the db
					Assert(prereqs_rel_str.indexOf(existing_section.get('section_id')) != -1, section.get('section_id') + " should contain prereqs: " + prereqs_rel_str + 'but does not contain:' + existing_section.get('section_id'));
				}
			});
		}
	});
}

function testSubsection(subsection) {
	var section_id = subsection.get('section_id');
	Assert(section_id);
	var section_rel = subsection.get('section');
	var query = new Parse.Query(Section);
	query.get(section_rel, {
		success: function(section) {
			Assert.equal(section.get('section_id'), section_id, section_id + " is missing subsection " + subsection_id);
		}
	});
}