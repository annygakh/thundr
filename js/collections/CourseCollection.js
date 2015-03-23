var app = app || {};

app.CourseCollection = Parse.Collection.extend({
	model: app.CourseModel,
	// comparator: 'section_id',

	initialize: function(){
		var self = this;
		// self.comparator = 'section_id';	
	},
	
	sort_by_credits: function(){
		app.results.sortBy(function(course1, course2){
			return course.get("credits");
		});	
	},
	comparator: function(course){
		return course.get("section_id");
	}
	// },



});

