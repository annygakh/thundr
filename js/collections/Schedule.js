 var app = app || {};
var LocalStorageSchedule = Backbone.Collection.extend({
	model: app.CourseModel,
    localStorage: new Backbone.LocalStorage('thundr'),


});

app.LocalCourses = new LocalStorageSchedule();