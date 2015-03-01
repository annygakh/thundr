var app = app || {};

app.CourseView = Backbone.View.extend({
	// model: app.CourseModel,
	// tagName: 'li', //even though it is so by default, i'll make it explicit
	// className: 'course-result',
	// el: '.search_results',
	id: function(){
		return this.model.id;
	}, 

	// template: //TODO
	num_tmpl: 1,
	reg_template:  _.template($('#course-template').html()),
	worklist_template: _.template($('#worklist-item-template').html()),

	events: {
		'click .add-cart' : 'toggleButton'
		// var events = {};
		// // amounts to 'click #<id of this view>'' : 'handle_click'
		// // events['click '+ '#' + this.id] = 'handle_click' ;//not sure if this is necessary yet
		// events['click .add-cart'] = 'toggleButton';
		// return events; 
	},

	initialize: function(){
		this.template = this.reg_template;
		this.render();
	},
	render: function(){
		var obj = {
			"html_id" : this.model.id,
			"course_title" : this.model.get("title"),
			"num_credits" : this.model.get("credits")
		};
		$(this.el).html(this.template(obj));
		return this; // to allow chained calls
	},

	render_sections: function(){

	},
	render_header: function(){

	},
	handle_click: function(){
		// reroute??
	},
	toggleButton: function(){
		this.$('.add-cart').addClass("hidden");
	}

});