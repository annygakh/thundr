var app = app || {};

app.CourseCollection = Parse.Collection.extend({
    // will hold objects of CourseModel
	model: app.CourseModel,
    
    getChecked: function() {
        return this.where({checked: true});
    }

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
