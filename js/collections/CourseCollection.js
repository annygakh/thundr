var app = app || {};

app.CourseCollection = Parse.Collection.extend({
    // will hold objects of CourseModel
	model: app.CourseModel,
<<<<<<< HEAD
        getChecked: function() {
            return this.where({checked: true});
        }
=======

	initialize: (function(){
		var self = this;	
	}),
	
	sort_by_credits: function(){
		app.results.sortBy(function(course){
			return course.get("credits");
		});	
	}


>>>>>>> 9cf04a58d8ead5e0c03ea54c928d80cb82a994ea
});

// app.results = new app.CourseCollection();
