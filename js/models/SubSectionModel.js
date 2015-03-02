var app = app || {};

app.SubSectionModel = Parse.Model.extend({

	className: 'SubSection',
    defaults: {
		type: "",
		term: "",
		course: "",
		code: "",
		start: "",
		end: "",
		days: "",
		location: "",
        // one or more instructors, hence an array of strings??
		instructor(s): [],
		labs: [],
		tutorials: [],
		sections = [];
	},
    
	initialize: function(){
		// OPTIONAL
	},
	validate: function(attributes){
		
	}





});
