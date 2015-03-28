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
		
        _.bindAll(this, 'find_subsection_on_success');
	},
    toggle_status: function(){
        app.subsections = new app.SubSectionCollection();        
        this.listenTo(app.subsections, 'add', this.addSubSection);
    	var $tr = this.$el;
    	console.log($tr);
    	console.log( 'id of the element $tr: ' + $tr.attr('id'));
    	$tr.addClass("active-class");
        
        var query = new Parse.Query(app.SubSectionModel);
        query.equalTo("type", "Lecture");
        query.find({
            success: this.find_subsection_on_success,
            error: this.find_subsection_on_error
        });
        query = new Parse.Query(app.SubSectionModel);
        query.equalTo("type", "Laboratory");
        query.find({
            success: this.find_subsection_on_success,
            error: this.find_subsection_on_error
        });
        query = new Parse.Query(app.SubSectionModel);
        query.equalTo("type", "Tutorial");
        query.find({
            success: this.find_subsection_on_success,
            error: this.find_subsection_on_error
        });
        query = new Parse.Query(app.SubSectionModel);
        query.equalTo("type", "Discussion");
        query.find({
            success: this.find_subsection_on_success,
            error: this.find_subsection_on_error
        });
        query = new Parse.Query(app.SubSectionModel);
        query.notEqualTo("type", "Lecture");
        query.notEqualTo("type", "Laboratory");
        query.notEqualTo("type", "Tutorial");
        query.notEqualTo("type", "Discussion");
        query.find({
            success: this.find_subsection_on_success,
            error: this.find_subsection_on_error
        });
    },
    find_subsection_on_success: function(results){
        if (results[0].get("type") == "Lecture"){
            this.render_lecture_header;
        } else if (results[0].get("type") == "Laboratory"){
            this.render_lab_header;
        } else if (results[0].get("type") == "Tutorial"){
            this.render_tut_header;
        } else if (results[0].get("type") == "Discussion"){
            this.render_dis_header;
        } else {
            this.render_other_header;
        }
        
        for (var i = 0; i < results.length ; i++) {
            var result = results[i];
            app.subsections.add(result);
        }
    },
    // do we need an error?
    // find_subsection_on_error: function(results){
    // }
    render_subsection_header: function(){
        var obj = {
            "term" : this.model.get("term"),
            "code" : this.model.get("subsection_id"),
            "days" : this.model.get("days"),
            "start_time" : this.model.get("startTime"),
            "end_time" : this.model.get("endTime"),
            "instructor" : this.model.get("instructor")
            // "map" ： this.model.get("map")
            // not sure if i should place this here...
        };
        var subsection_header_result = this.detailed-view-details-template(obj);
        return subsection_header_result;
        
        // not too sure where to place these ><
        /* if (this.model.get("location") == "No Scheduled Meeting"){
            this.model.get("location") = "N/A";
        }
        if (this.model.get("startTime") == null) {
            this.model.get("startTime") = "N/A";
        }
        if (this.model.get("endTime") == null) {
            this.model.get("endTime") = "N/A";
        }
        if (this.model.get("map") == undefined) {
            this.model.get("map") = "N/A";
        } */
    },
    toggleCourse: function (){
        
        this.get("description");
        
        var viewCourse = new app.SubSection({model: obj});
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
    render_lecture_header: function(){
        var lecture_header_result = this.lecture_template;
        return lecture_header_result;
    },
    render_lab_header: function(){
        var lab_header_result = this.lab_template;
        return lab_header_result;
    },
    render_tut_header: function(){
        var tut_header_result = this.tutorial_template;
        return tut_header_result;
    },
    render_dis_header: function(){
        var dis_header_result = this.discussion_template;
        return dis_header_result;
    },
    render_other_header: function(){
        var other_other_result = this.other_template;
        return other_header_result;
    },
	render_header: function(){
        var obj = {
            "html_id" : this.model.id,
			"course_title" : this.model.get("title").trim(),
			"num_credits" : this.model.get("credits")
        };
        var header_result = this.detailed_view_template(obj);
        return header_result;
	},
	handle_click: function(){
		// reroute??

	},
	toggleButton: function(){
		this.$('.add-cart').addClass("hidden");
	},
    addSubSection: function(obj){
        var SubSectionView = new app.SubSectionView({model: obj});
        // app.subsections.append(SubSectionView.el);
    }
   

});