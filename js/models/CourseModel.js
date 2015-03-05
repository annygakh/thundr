var app = app || {};

 app.CourseModel = Parse.Object.extend({
 	className: 'TestObject',
    defaults: {
		department: "",
		code: "",
		credit: "",
		description: "",
		pre-reqs: [],
		co-reqs: [],
		post-reqs: [],
		labs: [],
		tutorials: [],
		sections = [];
	},

	initialize: function(){
	},
	validate: function(attributes){
		
	}
	// more additional functions below


});