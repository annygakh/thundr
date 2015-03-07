var app = app || {};

app.CourseCollection = Parse.Collection.extend({
	model: app.CourseModel,

	initialize: (function(){
		var self = this;	
	}),
	
	sort_by_credits: function(){
		app.results.sortBy(function(course){
			return course.get("credits");
		});	
	}


});

// app.results = new app.CourseCollection();