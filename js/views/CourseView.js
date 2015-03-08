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
		"click .item" : "toggleCourse"
	},

	initialize: function(){
		this.template = this.reg_template;
		// this.render();
        // var self = this;
        this.listenTo(this.model, 'change', this.render);
	},
    
    toggleCourse: function (){
        
        this.get("description");
        
        var viewCourse = new self.app.SubSection({model: obj});
        self.$("#results').append(view.el);
        
        
    },
    
	render: function(){
		var obj = {
			"html_id" : this.model.id,
			"course_title" : this.model.get("title"),
			"num_credits" : this.model.get("credits")
		};
		console.log(obj.num_credits);
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