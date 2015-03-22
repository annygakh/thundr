var Parse = require('parse').Parse;
var Assert = require('assert');

Parse.initialize('GPBcV6zGuJ2E6OD9nsBZ5q3XnLAkrybuA8RFC4HB', '0mfkZM9QM8Vnc5fMt3JrKpGwLQbKrfYCvohsNgBG');

var Section = Parse.Object.extend("SectionTest");
var SubSection = Parse.Object.extend("SubSectionTest");

var sec_query = new Parse.Query(Section);

testPrereqs();
// testSubsection();

function testPrereqs() {
	describe ('Reqs', function() {
		it ('all reqs in prereq_str must be realtions in prereqs', function(done) {
			sec_query.each(function(section) {
				var prereqs_str = section.get('prereqs_str');
				var prereqs_rel = section.relation('prereqs');
				prereqs_rel.query().find({
					success: function(prereqs) {
						Assert.equal(prereqs.length, prereqs_str.length, section.get('section_id'));
						for (var i = 0; i < prereqs_str.length; i++) {
							var testPrereq = prereqs_str[i];
							Assert.equal(prereqs.equalTo('section_id', testPrereq).first().get('section_id'), testPrereq);
						};
					}
				});
			}).then(function() { done() });
		})
	})
}



var sub_query = new Parse.Query(SubSection);

function testSubsection(subsection) {
	describe ('Subsections', function() {
		var query = new Parse.Query(Section);
		it ('all subsections must exist', function(done) {
			sub_query.each(function(subsection) {

				var section_id = subsection.get('section_id');
				var section_rel = subsection.get('section');

				Assert(section_id);

				query.get(section_rel, {
					success: function(section) {
						Assert.equal(section.get('section_id'), section_id);
						done();
					}
				});
			})
		})
	})
}