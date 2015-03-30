var app = app || {};
var fb = fb || {};

app.AppView = Backbone.View.extend({
	el: 'body', 
	
	results_header_template: _.template($('#results-header-template').html()),
    detailed_results_header_template: _.template($('#detailed-results-header-template').html()),
	events: {
		'click #search-button' : 'search_router',
		'click .add-button' : 'add_to_cart',
		'click .worklist-delete' : 'remove_from_cart',
		'click .course-result' : 'prepare_for_detailed_view',
	},
	initialize: function(){
		this.$('#search-button').click(function(event){
			event.preventDefault(); // deals with error and race condition
		});
		var self = this;
		_.bindAll(this, 'query_on_success', 'query_on_error', 
			'add_to_cart_success', 'add_to_cart_error', 'addCourse', 
			'subsections_query_on_success', 'subsections_query_on_error',
			'prereqs_query_on_success', 'prereqs_query_on_error',
			'find_prereqs_for_each_course_on_success', 'find_prereqs_for_each_course_on_error',
			'reset_results_html',
			'find_postreqs_from_course_code_on_success', 'find_postreqs_from_course_code_on_error',
			'prepare_for_detailed_view');

		/*---------------Declare and initialize some variables-----------------------*/
		app.results = new app.CourseCollection();
		app.sub_results = new app.SubsectionCollection();
		app.selected_course_id = '';
		app.queries = [];
		app.option_building;

		app.reqs_results = new app.CourseCollection();
		app.worklist = new app.CourseCollection();
		app.worklist_ids = [];
		app.prereqs = []; // i think we can delete this
		app.departments = [];
		app.contains_depts = false;
		app.DEFAULT_PREREQS_SEARCH_LEVEL = 3;
		app.prereqs_search_level = app.DEFAULT_PREREQS_SEARCH_LEVEL;

		app.post_req_results = new app.CourseCollection();
		app.courses_of_interest = [];
		app.post_departments = [];
		app.contains_post_departments = false;
		app.DEFAULT_POSTREQS_SEARCH_LEVEL = 3;
		app.postreqs_search_level = app.DEFAULT_POSTREQS_SEARCH_LEVEL;

		app.views = [];

		app.clicked = false;



		/*----------------Setting up listeners-----------------------*/
		this.listenTo(app.results, 'add', this.addCourse);
		this.listenTo(app.sub_results, 'add', this.addSubsection);
		this.listenTo(app.results, 'reset', this.reset_all_courses);
		this.listenTo(app.sub_results, 'reset', this.reset_all_courses);
		this.listenTo(app.reqs_results, 'add', this.addCourse);
		this.listenTo(app.post_req_results, 'add', this.addCourse);

		$("input[name=buildings]").focusout(function () {
            app.option_building = ($(this).val());
		    console.log(app.option_building);
        });


		/*---------------Initialized the rest of the variables------------------*/
		var looking_for_prof // = 0,
			 looking_for_courses = 0;
		var looking_for_precoreqs = 0;
	},
	render: function(){
			// console.log("stuff");

	},
	search_router: function(){
		
		this.reset_all_collections();
		this.reset_results_html(); // new
		/*------------Are we searching for sections/prereqs&coreqs/postreqs?-------*/
		var searching_for_sections = this.$('.search-for-sections').hasClass('active') && 
									!this.$('.search-for-sections').hasClass('hide-totally');

		var searching_for_precoreqs = this.$('.search-for-pre-co-reqs').hasClass('active') &&
									!this.$('.search-for-pre-co-reqs').hasClass('hide-totally');

		var searching_for_postreqs = this.$('.search-for-post-reqs').hasClass('active') &&
									!this.$('.search-for-post-reqs').hasClass('hide-totally');

		/*-----------Lets decide what we are searching for ----------------*/
		if (searching_for_sections){
			/*----------- Checking if the user has filled out textboxes -----------*/
			var code_input = this.$('#code').val().trim();
			var prof_input = this.$('#prof').val().trim();
			var time_input = this.$('#time').val().trim();
			/*------------Are we searching for courses or subsections?-----*/

			if (prof_input || time_input || app.option_building){
				this.find_courses_from_subsections();
			} else if (code_input) {
				this.find_courses_from_course_code();
			} else {
				this.reset_results_html();
			}
		} else if (searching_for_precoreqs) {
			/*------------ Checking if the user has filled out textboxes -----------*/
			var code_input = this.$('#code-reqs').val().trim();

			if (code_input) {
				this.find_precoreqs_from_course_code();
			} else {
				this.reset_results_html();
			}
 
		} else if (searching_for_postreqs){
			/*------------ Checking if the user has filled out textboxes -----------*/
			var courses_input = this.$('#code-post-reqs').val().trim();

			if (courses_input) {
				this.find_postreqs_from_course_code();
			} else {
				this.reset_results_html();
			}
		}

	},

	show_precoreqs_search: function(){
		// handles in app.js, maybe move it here
	},
	show_post_reqs_search: function(){
		// handled in app.js, maybe move it here
	},

	find_courses_from_subsections: function(){
		/*------------Getting values from input form-----------*/

		var code_input = this.$('#code').val().trim();

		var prof_input = this.$('#prof').val().trim();
		var time_input = this.$('#time').val().trim();
		var term1_is_checked = this.$('#term1').is(':checked');
		var term2_is_checked = this.$('#term2').is(':checked');
		var building_input = app.option_building;

		/*------------Form appropriate queries---------------*/
		var query = new Parse.Query(app.SubsectionModel);

		if (code_input){
			var search_string_code = code_input.toUpperCase();
			var index_of_space = search_string_code.indexOf(' ');
			var contains_spaces = index_of_space > -1;

			if (contains_spaces){
				var dept = search_string_code.slice(0, index_of_space);
				var no = search_string_code.slice(index_of_space + 1);
				search_string_code = dept + no;
			}
				query.startsWith("section_id", search_string_code);
		}
		if (prof_input) {
			var search_string_prof = prof_input.toUpperCase();

			var index_of_space = search_string_prof.indexOf(' ');
			var contains_spaces = index_of_space > -1;
			var regex_pattern, regex_object;

			if (contains_spaces){
				var first_word = search_string_prof.slice(0, index_of_space);
				var second_word = search_string_prof.slice(index_of_space + 1);

				var first_second = first_word + "\.\\s" + second_word;
				var second_first = second_word + "\.\\s" + first_word;

				regex_pattern = "(" + first_second +  "|" + second_first + ")";

			} else {
				regex_pattern =  search_string_prof;
			}

				regex_object = new RegExp(regex_pattern);
				query.matches("instructor", regex_object, 'i');
		}
		if (time_input) {
			var time_string = time_input;
			var format = "HHMM-HHMM";
			var user_time_input_matches_specified_format =( time_string.length == format.length);

			if (user_time_input_matches_specified_format) {
				var start_time = parseInt(time_string.slice(0, 4));
				var end_time = parseInt(time_string.slice(5));
				query.greaterThanOrEqualTo("startTime", start_time);
				query.lessThanOrEqualTo("endTime", end_time);
			}
		}
		if (term1_is_checked || term2_is_checked){

			if (term1_is_checked && !term2_is_checked){
				query.equalTo("term", 1);

			} else if (!term1_is_checked && term2_is_checked){
				query.equalTo("term", 2);
			}  // THE TERM 3 THING DOESNT WORK MAN, IM JUST GONNA IGNORE IT

		}
		if (building_input) {
			var building_search_string = building_input;
			console.log(building_search_string);
			query.startsWith("location", building_search_string);
		}

		if (code_input || prof_input || time_input || building_input ) {
			query.addAscending("section_id");
			query.find({
				success: this.subsections_query_on_success,
				error: this.subsections_query_on_error
			});
		}


	},
	subsections_query_on_success: function(results){

		if (results.length == 0){
			this.no_results_found();
		}
		for (var i = 0; i < results.length; i++){
			var obj = results[i];
			if (obj instanceof(app.SubsectionModel)) {
				if (document.getElementById(obj.id) == null) {
					app.sub_results.add(obj);
					self.looking_for_courses = 1;
				}
			};
		}
		if (self.looking_for_courses)
			this.find_courses_from_course_code();
		self.looking_for_courses = 0;
	}, 
	subsections_query_on_error: function(err){
		this.reset_all_collections();
		this.reset_results_html(); 
		console.log('Error finding subsections: ' + err.message());
	},

	find_courses_from_course_code: function(){
		/*------------Getting values from input form-----------*/

		var code_input = this.$('#code').val().trim();

		var prof_input = this.$('#prof').val().trim();
		var time_input = this.$('#time').val().trim();
		var term1_is_checked = this.$('#term1').is(':checked');
		var term2_is_checked = this.$('#term2').is(':checked');
		var building_input = app.option_building;

		/*------------Form appropriate queries---------------*/
		var	query = new Parse.Query(app.CourseModel);
		query.limit(500);

		if (self.looking_for_courses){
			query.containedIn("section_id", app.queries);

		} else {

			if (code_input) {

				var search_string_code = code_input.toUpperCase();
				var index_of_space = search_string_code.indexOf(' ');
				var contains_spaces = index_of_space > -1;

				if (contains_spaces){
					query.startsWith("title", search_string_code);
				} else {
					query.startsWith("section_id", search_string_code);
				}
			}
		}
		if (code_input || prof_input || time_input || building_input
				|| term_input ){
			query.addAscending("section_id");
			query.find({
				success: this.query_on_success,
				error: this.query_on_error
			});
		}
	
	},

	query_on_success: function(results){
		app.queries = [];
		if (results.length == 0){
			this.no_results_found();
		}
		for (var i = 0; i < results.length; i++){
			var obj = results[i];
			if (obj instanceof(app.CourseModel)){
				if (document.getElementById(obj.id) == null) {
					app.results.add(obj);
				}
			} 
			
		}

	},	

	

	query_on_error: function(err){
		this.reset_all_collections();
		this.reset_results_html();
		console.log('find_courses_from_course_code error: ' + err.message);

	},

	find_precoreqs_from_course_code: function() {

		/*------------ (Re) initialize everything-------------*/
		app.departments = [];
		app.results.reset(); // new
		app.contains_depts = false;
		app.each_prereq = [];
		/*------------- Getting user input ------------*/
		var code_input = this.$('#code-reqs').val().trim();
		var department_input = this.$('#department-reqs').val().trim();
		var num_results_input = this.$('#num-results-reqs').val().trim();
		/*------------- Filtering out user input  --------------*/

		/*------------ filtering code input -----------------*/
		var search_string_code = code_input.toUpperCase();
		var index_of_space = search_string_code.indexOf(' ');
		var format = "CODE123x"; // for reference
		var contains_spaces = index_of_space > -1;

		if (contains_spaces){
			var last_index_of_space = search_string_code.lastIndexOf(" ");
			search_string_code = search_string_code.slice(0, 4) + search_string_code.slice(last_index_of_space+1);
			console.log(search_string_code);
		} 
		/*-----------filtering the departments -----------------*/



		if (department_input) {
			var department_string = department_input.toUpperCase();

			var d_index_of_comma = department_string.indexOf(',');
			var d_index_of_space = department_string.indexOf(' ');

			var d_contains_commas = d_index_of_space > -1;

			if (d_contains_commas) {
				app.departments = department_string.split(",");
			} else { // we assume its separated by spaces
				app.departments = department_string.split(" ");
			} 
			app.contains_depts = true;
		} 

		/*------------------ dealing with prereq level ----------------*/
		if (num_results_input)
			app.prereqs_search_level = num_results_input;
		else
			app.prereqs_search_level = app.DEFAULT_PREREQS_SEARCH_LEVEL;


		/*------------Form appropriate queries---------------*/
		app.results.reset(); // new
		var	query = new Parse.Query(app.CourseModel);
		query.startsWith('section_id', search_string_code);
		var PREREQ = 'Pre-reqs';
		query.startsWith("req_str", PREREQ);
		query.addAscending("section_id");
		query.find({
			success: this.prereqs_query_on_success,
			error: this.prereqs_query_on_error
		});

	},
	prereqs_query_on_success: function(results) {
		if (results.length == 0){

			this.no_results_found();
		} else {
			var result = results[0]; // results.length should be one, always
			if (result instanceof(app.CourseModel)){ // should always be true
				var course_codes = result.get("prereqs_str");
				if (course_codes.length > 0 ){
					this.find_prereqs_from_list_of_course_codes(course_codes);
				} else {
					this.no_prereqs_message();
				}
			}

		}
	},
	no_prereqs_message: function() {
		this.display_message('No prerequisite courses were found.');
	},
	prereqs_query_on_error: function(err) {
		this.reset_all_collections();
		this.reset_results_html();
		console.log("couldn't find pre/co-reqs, error: " + err.message);
	},
	find_prereqs_from_list_of_course_codes: function(course_codes){
		if (app.prereqs_search_level > 0) {
			var	query = new Parse.Query(app.CourseModel);
			query.containedIn("section_id", course_codes);
			app.each_prereq = [];
			query.addAscending("section_id");
			query.find({
				success: this.find_prereqs_for_each_course_on_success,
				error: this.find_prereqs_for_each_course_on_error
			});
		}

	},

	find_prereqs_for_each_course_on_success: function(results){
		for (var i = 0; i < results.length; i++){
			var obj_course = results[i];
			var obj_id = obj_course.id;
			var obj_dept = obj_course.get("section_id").slice(0, 4);
			var contains_the_prereq = app.results.get(obj_id) instanceof(app.CourseModel);
			var matches_one_of_the_depts = false;
			
			if (!contains_the_prereq) {
				if (app.contains_depts) {
					for (var n = 0; n < app.departments.length; n++){
						var dept = app.departments[n];
						if (dept == obj_dept){
							matches_one_of_the_depts = true;
						}
					}
				} else {
					// the user didn't input any requirements for the department, 
					// so we want to display all departments
					matches_one_of_the_depts = true;
				}

				if (matches_one_of_the_depts){
					app.results.add(obj_course); //new
				}

			}
			var prereqs_of_each_course = obj_course.get("prereqs_str");
			for (var k = 0; k < prereqs_of_each_course.length; k++){
				var individual_req = prereqs_of_each_course[k]; // changed to k
				app.each_prereq.push(individual_req);
			}
		}
		app.prereqs_search_level--;
		var array_reqs = app.each_prereq;
		this.find_prereqs_from_list_of_course_codes(array_reqs);
	},
	find_prereqs_for_each_course_on_error: function(err){
		this.reset_all_collections();
		this.reset_results_html();
		console.log("Error upon finding subsequent prerequisites: " + err.message);
			
	},

	find_postreqs_from_course_code: function() {
		/*-------- (Re)Initialize everything ------------ */
		app.courses_of_interest = [];
		app.post_departments = [];
		app.results.reset(); // new

		app.contains_post_departments = false;

		
		/*------------- Getting user input ------------*/
		var courses_input = this.$('#code-post-reqs').val().trim();
		var dept_input = this.$('#dept-postreqs').val().trim();
		var num_results_input = this.$('#num-results-postreqs').val().trim();
		
		/*------------- Filtering user input ------------*/

		/*------------- Filtering courses input ------------*/
		var courses_input_string = courses_input.toUpperCase();

		var index_of_comma = courses_input_string.indexOf(","); 
		var contains_comma = index_of_comma > -1;

		if (contains_comma){
			app.courses_of_interest = courses_input_string.split(",");
		} else {
			app.courses_of_interest = courses_input_string.split(" ");
		}
		/* -------------- Filtering dept input-------------- */

		if (dept_input){
			var dept_input_string = dept_input.toUpperCase();

			var index_of_comma = dept_input_string.indexOf(","); 
			var contains_comma = index_of_comma > -1;

			if (contains_comma){
				app.courses_of_interest = dept_input_string.split(",");
			} else {
				app.courses_of_interest = dept_input_string.split(" ");
			}
			app.contains_post_departments = true;
		}
		/* -------------- Filtering num results input -------------- */

		if (num_results_input)
			app.postreqs_search_level = num_results_input;
		else
			app.postreqs_search_level = app.DEFAULT_POSTREQS_SEARCH_LEVEL;
		/* --------------Creation of the query -------------------- */

		var query = new Parse.Query(app.CourseModel);
		query.containedIn("prereqs_str", app.courses_of_interest);
		query.addAscending("section_id");
		query.find({
			success: this.find_postreqs_from_course_code_on_success,
			error: this.find_postreqs_from_course_code_on_error
		});
		// check for the department match later on




	},
	find_postreqs_from_course_code_on_success: function(results){
		if (results.length == 0 ){
			this.no_post_reqs_found();
		} else {
			var i = 0;
			while (i < results.length && app.postreqs_search_level > 0){
				var course = results[i];
				var course_id = course.id;
				var course_dept = course.get("section_id").slice(0, 4);

				var contains_the_postreq = app.results.get(course_id) instanceof(app.CourseModel); // new
				var matches_one_of_the_depts = false;
				
				if (!contains_the_postreq) {
					if (app.contains_post_departments) {
						for (var n = 0; n < app.post_departments.length; n++){
							var dept = app.post_departments[n];
							if (dept == course_dept){
								matches_one_of_the_depts = true;
							}
						}
					} else {
						// the user didn't input any requirements for the department, 
						// so we want to display all departments
						matches_one_of_the_depts = true;
					}

					if (matches_one_of_the_depts){
						app.postreqs_search_level--;
						app.results.add(course); // new
					}

				}
				i++;
			} 
		}
	},
	no_post_reqs_found: function(){
		this.display_message('This course is not a prerequisite for any courses');
	},

	find_postreqs_from_course_code_on_error: function(err){
		console.log("Error finding post reqs from course code: " + err.message);
	},

	add_to_cart: function(event){
<<<<<<< HEAD
		consloe.log("ADEDED");
=======
>>>>>>> 6c4e72e568272e46e28ad67925bb817757c10125
		var SubSection = Parse.Object.extend("SubSection");
		var user = Parse.User.current();
		if (user) {
			var subsection_id = $(event.target).closest('tr').attr('id');
			var query = new Parse.Query(SubSection);
			query.get(subsection_id, {
				success: function(subsection) {
					var relation = user.relation("Worklist");
					relation.add(subsection);
					user.save();
					var relation = user.relation("Worklist");

					relation.query().find({
						success: function(results) {
							fb.reload_worklist(results);
						}
					});
				}
			});
		} else {
			alert("Please log in");
		}
	},
	add_to_cart_success: function(obj){

		var view = new self.app.CourseView({model: obj});
		view.$('.add-cart').addClass("hidden");
		view.$('.credits').addClass("hidden");
		self.$('#worklist-container').append(view.el);
	},
	add_to_cart_error: function(obj, err){
		alert("couldnt add the item to the worklist, err msg: " + err.message); // idea: add error msges to faq, idk
	},

	remove_from_cart: function(event){
		console.log("remove course");
		var SubSection = Parse.Object.extend("SubSection");
		var subsection_id = $(event.target).closest('div').attr('id');
		var query = new Parse.Query(SubSection);
		user = Parse.User.current();
		console.log(subsection_id);
		query.get(subsection_id, {
			success: function(subsection) {
				var relation = user.relation("Worklist");
				relation.remove(subsection);
				user.save();
				relation.query().find({
					success: function(results) {
						fb.reload_worklist(results);
						console.log("rerenders");
					}
				});
			}
		});
	},

	addCourse: function(obj){
		var view = new self.app.CourseView({model: obj});
		app.views.push(view);
		self.$('#results').append(view.el);
	},

	addSubsection: function(obj){
		self.app.queries.push(obj.get("section_id"));
	},

	reset_results_html: function(){
		this.$('#results').html('');
		for (var k = 0; k < app.views; k++){
			app.views[k].remove();
		}
	},
	reset_all_collections: function(){
		app.results.reset(); 
		app.sub_results.reset();
		app.views = [];
	},
	no_results_found: function(){
		this.display_message('No results were found, please check your spelling.');
	},

	prepare_for_detailed_view: function(){
		console.log('hey');

		var $selected_course = $('#results .active-class');
		var selected_course_id = $selected_course.attr('id');

		$selected_course.nextAll().remove();
		$selected_course.prevAll().remove();
		
		var models_to_remove = new app.CourseCollection();
		for (var i = 0; i < app.results.length; i++){
			var current_model = app.results.at(i);
			var current_model_id = current_model.id;
			if (current_model_id != selected_course_id){
				models_to_remove.add(current_model);
			} 
		}
		for (var k = 0; k < models_to_remove.length; k++){
			var current_model_to_remove = models_to_remove.at(k);
			app.results.remove(current_model_to_remove);
		}

		if (app.results.length != 1){
			console.log("Error, should only be 1 course remaining ");
		}
		var id_of_the_remaining_course_model = app.results.at(0).id;

		var remaining_views = [];
		for (var j = 0; j < app.views.length; j++){
			var current_view = app.views[j];
			var current_id_of_views_model = current_view.model.id ;
			if (current_id_of_views_model == id_of_the_remaining_course_model) {
				remaining_views.push(current_view);
			} else {
				current_view.remove();
			}
		}
		
		app.views = remaining_views;
		var remaining_view = app.views[0];

	},
	display_message: function(msg) {
		var message = '<p>' + msg +  '</p>';
		self.$('#results').prepend(message);
	},

});
