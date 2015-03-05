var app = app || {};

app.CourseCollection = Parse.Collection.extend({
	model: app.CourseModel,
	



});

app.results = new app.CourseCollection();