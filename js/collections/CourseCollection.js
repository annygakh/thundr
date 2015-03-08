var app = app || {};

app.CourseCollection = Parse.Collection.extend({
    // will hold objects of CourseModel
	model: app.CourseModel,
        getChecked: function() {
            return this.where({checked: true});
        }
});

app.results = new app.CourseCollection();