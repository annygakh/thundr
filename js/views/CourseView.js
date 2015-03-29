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
		var click = false;
        var html_el;
		var self = this;
        _.bindAll(this, 'find_tutorial_on_success', 'find_labs_on_success',
            'find_lectures_on_success', 'find_discussion_on_success',
            'find_others_on_success',
            'render_lab_header', 
            'render_lecture_header', 'render_dis_header',
            'render_tut_header');
	},
    toggle_status: function(){
        this.click  = true;
        app.subsections = new app.SubsectionCollection();        
        this.listenTo(app.subsections, 'add', this.addSubSection);
    	var $tr = this.$el;
    	// console.log($tr);
    	// console.log( 'id of the element $tr: ' + $tr.attr('id'));
    	$tr.addClass("active-class");
        /*------------create queries ------------*/

        $('.add-button').addClass("hide-totally");
       
        
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Lecture");
        query.equalTo("section_id", section);
        query.find({
            success: this.find_lectures_on_success,
            error: this.find_lectures_on_error
        });
    },
    find_lectures_on_success: function(results) {
        if (results.length > 0) {
            this.render_lecture_header();
            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }

        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Laboratory");
        query.equalTo("section_id", section);
        query.find({
            success: this.find_labs_on_success,
            error: this.find_labs_on_error
        });

    },
    find_lectures_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
    find_labs_on_success: function(){
        if (results.length > 0) {
            this.render_lab_header();

            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Tutorial");
        query.equalTo("section_id", section);
        query.find({
            success: this.find_tutorial_on_success,
            error: this.find_tutorial_on_error
        });
    },
    find_labs_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
    find_tutorial_on_success: function(results) {
        if (results.length > 0) {
            this.render_tut_header();

            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Discussion");
        query.equalTo("section_id", section);
        query.find({
            success: this.find_discussion_on_success,
            error: this.find_discussion_on_error
        });
    },
    find_tutorial_on_error: function(err) {
        console.log("Error retrieving subsections: " + err.message);
    },
    find_discussion_on_success: function(results){
        if (results.length > 0) {
            this.render_dis_header();
            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("section_id", section);
        var prev_types = ["Lecture", "Laboratory", 
                        "Tutorial", "Discussion"];
        query.notContainedIn("type", prev_types);
        query.find({
            success: this.find_others_on_success,
            error: this.find_others_on_error
        });
    },
    find_discussion_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
    find_others_on_success: function(results){
         if (results.length > 0) {
            this.render_dis_header();
            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
    },
    find_others_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
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
            $(this.el).html(this.reg_template(obj));
            return this; // to allow chained calls

    },
    render_lecture_header: function(){
        console.log("render_lecture_header");
        var lecture_header_result = this.lecture_template();
        return this.render_all_header(lecture_header_result);
    },
    render_lab_header: function(){
        console.log("render_lab_header");
        this.$el.html(this.html_el);
        var lab_header_result = this.lab_template();
        return this.render_all_header(lab_header_result);
    },
     
    render_tut_header: function(){
        console.log("render_tut_header");
        this.$el.html(this.html_el);
        var tut_header_result = this.tutorial_template();
        return this.render_all_header(tut_header_result);
    },
    render_dis_header: function(){

        console.log("render_dis_header");
        this.$el.html(this.html_el);
        var dis_header_result = this.discussion_template();
        return this.render_all_header(dis_header_result);
    },
    render_other_header: function(){
        console.log("render_other_header");
        this.$el.html(this.html_el);
        var other_other_result = this.other_template();
        return this.render_all_header(other_other_result);
    },
    render_all_header: function(result_header){
        var thing = "<tr>" + this.$el.html() + "</tr>";
        var thing = this.$el.html();
        thing+=result_header;
        this.$el.html(thing);
        this.html_el = thing;
        return this;
    },
	render_header: function(){
        var obj = {
            	"html_id" : this.model.id,
				"course_title" : this.model.get("title").trim(),
				"num_credits" : this.model.get("credits")
	        };
	        var templ = this.detailed_view_template(obj);
	        return templ;
	},
	handle_click: function(){
		// reroute??

	},
	toggleButton: function(){
		this.$('.add-cart').addClass("hidden");
	},
    addSubSection: function(obj){
        var subview = new app.SubsectionView({model: obj});
        var view_el_to_add = subview.render();
        var thing = this.$el.html();
        thing += view_el_to_add;
        this.$el.html(thing);
        this.html_el = thing;
        this.html_el = this.$el.html();
        return this;
    }
   

});