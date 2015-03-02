var app = app || {};

app.CourseCollection = Parse.Collection.extend({
	model: app.Course,
	// localStrage: new Backbone.LocalStorage("thundr"), // if the user is not logged in


});

var Courses = new CourseCollection();