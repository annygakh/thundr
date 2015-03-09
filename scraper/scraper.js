var request = require('request')
	cheerio = require('cheerio')
	HashMap = require('hashmap').HashMap
	Parse   = require('parse').Parse

Parse.initialize('GPBcV6zGuJ2E6OD9nsBZ5q3XnLAkrybuA8RFC4HB', '0mfkZM9QM8Vnc5fMt3JrKpGwLQbKrfYCvohsNgBG');

// All classes
var root = '/cs/main?pname=subjarea&tname=subjareas&req=0'
//var root = '/cs/main?pname=subjarea&tname=subjareas&req=1&dept=LAW';
var base = 'https://courses.students.ubc.ca';
var urls = new HashMap();

var Section = Parse.Object.extend("Section");
var SubSection = Parse.Object.extend("SubSection");

function scrape() {
	urls.set(200, new Array());
	urls.set(404, new Array());
	urls.get(200).push(root);
	crawl();
}

function crawl() {
	var link;
	do {
		if (urls.get(200).length == 0) return;
		link = urls.get(200).pop();
	} while (link.indexOf('VANT') != -1);
		

	request(base + link, function (err, resp, body){
		if (!err) {
			var $ = cheerio.load(body);
			// url is section link
			if (link.indexOf('req=5') != -1) {
				parseSubSection(link);
			}
			// url is course link
			else if (link.indexOf('req=3') != -1) {
				parseSection(link);
			}
			// url is dept link or main page
			else if ((link.indexOf('req=0') != -1) || (link.indexOf('req=1') != -1))  {
				$('#mainTable a').each(function() {
					urls.get(resp.statusCode).push($(this).attr('href'));
				});
			}
			else
				console.log(base + link);
			crawl();
		}
	});
};

function parseSection(link) {
	// Relations: Pre-reqs, Post-reqs, Co-reqs
	request(base + link, function(err, resp, body){
		if (!err && resp.statusCode == 200) {
			var $ = cheerio.load(body);
			var section_id  = link.substring(link.indexOf("dept=") + 5, link.indexOf('&', link.indexOf("dept="))) +
							  link.substring(link.indexOf("course=") + 7, link.length);
			var title 		= $('h4').text();
			var desc 		= $('h4').next().text();
			var credits 	= $('h4').next().next().next().text();
			var index 		= credits.search(/[0-9]/);
			credits 		= parseInt(credits.substring(index, credits.length - 1));
			var req_obj 	= $('h4').next().next().next().next();
			var req_str		= req_obj.text().trim();
			// Turn into relation object and add course relations
			var prereqs 	= parseReqs(req_obj.html());
			var sscLink 	= base + link;
			var section 	= new Section();
			section.set("section_id", section_id);
			section.set("title", title);
			section.set("desc", desc);
			section.set("credits", credits);
			section.set("req_str", req_str);
			section.set("prereqs_str", prereqs);
			section.set("subsections", null);
			section.set("link", sscLink);
			section.save(null, {
				success: function(section) {
					console.log(section_id);
				},
				failure: function(section, error) {
					console.log("failed due to " + error.message);
				}
			});

			// retrieve subsection links
			$('tr td a').each(function() {
				urls.get(200).push($(this).attr('href'));
			});
		} else {
			console.log(resp.statusCode + " occured at " + base + link);
		};
		crawl();
	});
}

function parseReqs(html) {
	var reqs = [];
	var $ = cheerio.load(html);
	$('a').each(function() {
		req = $(this).text().replace(/ /g,'');
		reqs.push(req);
	});
	return reqs;
}

function getSubType(course_code) {
	if ((course_code.indexOf("T")) != -1) {
		return "tutorial";
	} else if (course_code.indexOf("L") != -1) {
		return "lab";
	} else if (course_code.indexOf("W") != -1) {
		return "waitlist";
	} else {
		return "lecture";
	}
}

function parseSubSection(link) {
	request(base + link, function(err, resp, body){
		if (!err && resp.statusCode == 200) {

			var $ = cheerio.load(body);
			var section_id 		= link.substring(link.indexOf("dept=") + 5, link.indexOf('&', link.indexOf("dept="))) + 
								  link.substring(link.indexOf("course=") + 7, link.indexOf('&', link.indexOf("course=")));
			var subsection_id	= link.substring(link.indexOf("section=") + 8, link.length);
			if (subsection_id.indexOf('W') != -1)
				return;
			var type = $('h4').text();
			type = type.substring(type.indexOf('(') + 1, type.indexOf(')'));
			var instructor;
			$('tr td').each(function(i, elm) {
				if (($(this).text().indexOf('Instructor: ') != -1) || 
					($(this).text().indexOf('TA: ') != -1)) {
					instructor = ($(this).next().text());
				}
			});
			var infoBox;
			$('table.table.table-striped tr th').each(function(i, elm) {
				if ($(this).text().indexOf('Term') != -1) {
					infoBox = $(this).parent().parent();
				}
			});
			var term = 0;
			if (infoBox != undefined) {
				var term_str 	= infoBox.next().text();
				var days     	= infoBox.next().next().text();
				var startTime 	= parseInt(infoBox.next().next().next().text().replace(':', ''));
				var endTime   	= parseInt(infoBox.next().next().next().next().text().replace(':', ''));
				var location  	= infoBox.next().next().next().next().next().text();
				var map        	= infoBox.next().next().next().next().next().next().find('a').attr('href');
				// Convert days to int
				var days_int = [];

				if (days.indexOf("Sun") != -1)
					days_int.push(0);
				if (days.indexOf("Mon") != -1)
					days_int.push(1);
				if (days.indexOf("Tue") != -1)
					days_int.push(2);
				if (days.indexOf("Wed") != -1)
					days_int.push(3);
				if (days.indexOf("Thu") != -1)
					days_int.push(4);
				if (days.indexOf("Fri") != -1)
					days_int.push(5);
				if (days.indexOf("Sat") != -1)
					days_int.push(6);

				if (term_str.indexOf('2') != -1)
					term += 2;
				if (term_str.indexOf('1') != -1)
					term++;
			}

			var sscLink 	= base + link;
			
			var subsection = new SubSection();
			subsection.set("subsection_id", subsection_id);
			subsection.set("instructor", instructor);
			subsection.set("map", map);
			subsection.set("location", location);
			subsection.set("startTime", startTime);
			subsection.set("endTime", endTime);
			subsection.set("days", days_int);
			subsection.set("term", term);
			subsection.set("link", sscLink);
			subsection.set("type", type);
			subsection.set("section_id", section_id);

			subsection.save(null, {
				success: function(subsection) {
					console.log(section_id + " " + subsection_id);
					var sec_query = new Parse.Query(Section);
					sec_query.equalTo('section_id', section_id);
					sec_query.first(function(section) {
						if (section != null) {
							section.relation('subsections').add(subsection);
							subsection.set('section', section);
							section.save();
							subsection.save();
						} else {
							console.log("MISSING SECTION FOR " + section_id + subsection_id);
						}
					});
				},
				failure: function(subsection, error) {
					console.log("failed due to " + error.message);
				}
			}).then(function(subsection) {
			});			
		} else {
			console.log(resp.statusCode + " occured at " + base + link);
		};
		crawl();
	});
}

scrape();

