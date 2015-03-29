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
    detailed_view_template: _.template($('#detailed-view-template').html()),
    lecture_template:  _.template($('#lecture-template').html()),
    lab_template:  _.template($('#lab-template').html()),
    tutorial_template:  _.template($('#tutorial-template').html()),
    discussion_template:  _.template($('#discussion-template').html()),
    other_template:  _.template($('#other-template').html()),

	events: {
		"click .item" : "toggleItem",
		'click td' : 'toggle_status',
	},

	initialize: function(){
		this.template = this.reg_template;
		this.render();
		_.bindAll(this, 'toggle_status');
		/* -------------- Initialize listeners -------------- */
<<<<<<< HEAD
=======
		var click = false;
>>>>>>> 01477f293a0179b3c05e4fd3d1f2621112c33e89
		

	},
    toggle_status: function(){
    	var $tr = this.$el;
    	console.log($tr);
    	console.log( 'id of the element $tr: ' + $tr.attr('id'));
    	$tr.addClass("active-class");

    	
    },
    toggleCourse: function (){
        
        this.get("description");
        
        var viewCourse = new app.SubSection({model: obj});
        // self.$("#results").append(view.el); // u need to define your own html element with its own id to write results to
        
        
    },
    
	render: function(){
<<<<<<< HEAD
		var obj = {
			"html_id" : this.model.id,
			"course_title" : this.model.get("title").trim(),
			"num_credits" : this.model.get("credits")
		};
		// console.log(typeof obj.num_credits === 'number' );
		$(this.el).html(this.template(obj));
		return this; // to allow chained calls
=======
			var obj = {
				"html_id" : this.model.id,
				"course_title" : this.model.get("title").trim(),
				"num_credits" : this.model.get("credits")
			};
			$(this.el).html(this.template(obj));
			return this; // to allow chained calls

>>>>>>> 01477f293a0179b3c05e4fd3d1f2621112c33e89
	},

	render_sections: function(){

	},
	render_header: function(){
        var obj = {
<<<<<<< HEAD
            "html_id" : this.model.id,
			"course_title" : this.model.get("title").trim(),
			"num_credits" : this.model.get("credits")
        };
        $(this.el).html(this.detailed_view_template(obj));
        return this;
=======
            	"html_id" : this.model.id,
				"course_title" : this.model.get("title").trim(),
				"num_credits" : this.model.get("credits")
	        };
	        var templ = this.detailed_view_template(obj);
	        return templ;
>>>>>>> 01477f293a0179b3c05e4fd3d1f2621112c33e89
	},
	handle_click: function(){
		// reroute??

	},
	toggleButton: function(){
		this.$('.add-cart').addClass("hidden");
	}

});