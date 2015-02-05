var request = require('request')
	cheerio = require('cheerio')
	urls = []
	courses = []
	// All classes
	//root = '/cs/main?pname=subjarea&tname=subjareas&req=0'
	// Only CPSC classes
	root = '/cs/main?pname=subjarea&tname=subjareas&req=1&dept=CPSC'
	base = 'https://courses.students.ubc.ca';

scrape();

function scrape() {
	urls.push(root);
	crawl();
}

function crawl() {
	console.log(urls.length);
	if (urls.length == 0) {
		console.log(courses);
		console.log(courses.length);
		return;
	}
	var link = urls.pop();
	request(base + link, function(err, resp, body){
		if (!err && resp.statusCode == 200) {
			var $ = cheerio.load(body);
			// if url contains 'req=5' then url is section link
			if (link.indexOf('req=5') != -1) {
				parse(link);
			}
			// if url contains 'req=3' then url is course link
			else if (link.indexOf('req=3') != -1) {
				$('tr td a').each(function() {
					urls.push($(this).attr('href'));
				});
			}
			// if url contains 'req=0' or 'req=0' then url is dept link or main page
			else if ((link.indexOf('req=0') != -1) || (link.indexOf('req=1') != -1))  {
				$('#mainTable a').each(function() {
					urls.push($(this).attr('href'));
				});
			}
			else
				console.log(base + link);
			crawl();
		} else {
			console.log(resp.statusCode + " occured at " + base + link);
		};
	});
};

function parse(link) {
	request(base + link, function(err, resp, body){
		if (!err && resp.statusCode == 200) {
			var $ = cheerio.load(body);
			if (link.indexOf('section') != -1) {
				// Add course title courses
				var course = $('h4').text();
				courses.push(course);
			}
		} else {
			console.log(resp.statusCode + " occured at " + base + link);
		};
	});
}
