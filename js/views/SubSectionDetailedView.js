var app = app || {};
app.subsection-detailed-view = Backbone.View.extend({
	// className tagName el id?
	model: app.SubSectionModel,

	className: 'subsection', 
	tagName: 'div',
	id: function(){
		return this.model.get('section_id') + '-' + this.model.get('subsection_id'); //html id will be something like CPSC304-L1A
	}
	// template: TODO
	events: {

	},
	initialize: function(){

	}
	render: function(){
		
		
	}

	render_lab: function(){

	}
	render_tutorial: function(){

	}
	render_course_section: function(){

	}


});