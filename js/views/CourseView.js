var app = app || {};

app.CourseView = Backbone.View.extend({

	id: function(){
		return this.model.id;
	}, 
	tagName: 'tr',
	// template: //TODO
	num_tmpl: 1,
	reg_template:  _.template($('#course-template').html()),
	worklist_template: _.template($('#worklist-item-template').html()),

	events: {
		"click .item" : "toggleItem",
		'click td' : 'toggle_status',
	},

	initialize: function(){
		this.template = this.reg_template;
		this.render();
		_.bindAll(this, 'toggle_status');
		/* -------------- Initialize listeners -------------- */
		

	},
    toggle_status: function(){
    	var $tr = this.$el;
    	console.log($tr);
    	console.log( 'id of the element $tr: ' + $tr.attr('id'));
    	$tr.addClass("active-class");
    	console.log()

    	
    },
    toggleCourse: function (){
        
        this.get("description");
        
        var viewCourse = new self.app.SubSection({model: obj});
        // self.$("#results").append(view.el); // u need to define your own html element with its own id to write results to
        
        
    },
    
	render: function(){
		var obj = {
			"html_id" : this.model.id,
			"course_title" : this.model.get("title").trim(),
			"num_credits" : this.model.get("credits")
		};
		// console.log(typeof obj.num_credits === 'number' );
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