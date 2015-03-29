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
    detailed_results_header_template: _.template($('#detailed-results-header-template').html()),

	events: {
        "click .add-button" : 'toggleButton'
	},

	initialize: function(){
		this.template = this.reg_template;
		this.render();
		_.bindAll(this, 'toggle_status');
		/* -------------- Initialize listeners -------------- */
		
        _.bindAll(this, 'find_tutorial_on_success', 'find_labs_on_success',
            'find_lectures_on_success', 'find_discussion_on_success',
            'find_others_on_success',
            'render_lab_header', 
            'render_lecture_header', 'render_dis_header',
            'render_tut_header');

        this.$el.on('click', 'td', this.toggle_status);
        var click = false;
        var html_el;
        var self = this;

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
    toggle_status: function(){

        this.$el.off('click', this.toggle_status);

        app.subsections = new app.SubsectionCollection();        
        this.listenTo(app.subsections, 'add', this.addSubSection);
        var $tr = this.$el;
        $tr.addClass("active-class");

        this.render_header();
        

        /*------------create queries ------------*/

       
        
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Lecture");
        query.equalTo("section_id", section);
        query.addAscending("subsection_id");
        query.find({
            success: this.find_lectures_on_success,
            error: this.find_lectures_on_error
        });
    },
    find_lectures_on_success: function(results) {
        this.render_lecture_header();
        if (results.length > 0) {
            this.render_table_header();
            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }

        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Laboratory");
        query.equalTo("section_id", section);
        query.addAscending("subsection_id");
        query.find({
            success: this.find_labs_on_success,
            error: this.find_labs_on_error
        });

    },
    find_lectures_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
    find_labs_on_success: function(results){
        this.render_lab_header();
        if (results.length > 0) {
            this.render_table_header();

            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Tutorial");
        query.equalTo("section_id", section);
        query.addAscending("subsection_id");
        query.find({
            success: this.find_tutorial_on_success,
            error: this.find_tutorial_on_error
        });
    },
    find_labs_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
    find_tutorial_on_success: function(results) {
        this.render_tut_header();
        if (results.length > 0) {
            this.render_table_header();

            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
        var query = new Parse.Query(app.SubsectionModel);
        var section = this.model.get("section_id");
        query.equalTo("type", "Discussion");
        query.equalTo("section_id", section);
        query.addAscending("subsection_id");
        query.find({
            success: this.find_discussion_on_success,
            error: this.find_discussion_on_error
        });
    },
    find_tutorial_on_error: function(err) {
        console.log("Error retrieving subsections: " + err.message);
    },
    find_discussion_on_success: function(results){
        this.render_dis_header();
        if (results.length > 0) {
            this.render_table_header();
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
        query.addAscending("subsection_id");
        query.find({
            success: this.find_others_on_success,
            error: this.find_others_on_error
        });
    },
    find_discussion_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
    find_others_on_success: function(results){
        this.render_other_header();
         if (results.length > 0) {
            this.render_table_header();
            for (var i = 0; i < results.length ; i++) {
                var result = results[i];
                app.subsections.add(result);
            }
        }
    },
    find_others_on_error: function(err){
        console.log("Error retrieving subsections: " + err.message);
    },
   
    render_lecture_header: function(){
        var lecture_header_result = this.lecture_template();
        return this.render_all_header(lecture_header_result);
    },
    render_lab_header: function(){
        var lab_header_result = this.lab_template();
        return this.render_all_header(lab_header_result);
    },
     
    render_tut_header: function(){
        var tut_header_result = this.tutorial_template();
        return this.render_all_header(tut_header_result);
    },
    render_dis_header: function(){

        var dis_header_result = this.discussion_template();
        return this.render_all_header(dis_header_result);
    },
    render_other_header: function(){
        var other_other_result = this.other_template();
        return this.render_all_header(other_other_result);
    },
    render_all_header: function(result_header){
        $(this.el).append(result_header);
        return this;
    },
	render_header: function(){
        var obj = {

            	"html_id" : this.model.id,
				"course_title" : this.model.get("title").trim(),
				"num_credits" : this.model.get("credits"),
                "description" : this.model.get("desc"),

                "req_str" : this.model.get("req_str"),
                "link" : this.model.get("link")
	        };
	        var templ = this.detailed_view_template(obj);
            $('.course-result').remove();
            $('.credits.course-result-credits').remove();
            $(this.el).html(templ);
	        return this;
	},
    render_table_header: function(){
        var header = this.detailed_results_header_template();
        $(this.el).append(header);
        return this;
    },
	
    addSubSection: function(obj){
        var subview = new app.SubsectionView({model: obj});
        var view_el_to_add = subview.render();
        $(this.el).append(view_el_to_add);
        return this;
    }, 
    toggleButton: function(){
        // this.$('.add-button').addClass("hidden");
    },
   

});