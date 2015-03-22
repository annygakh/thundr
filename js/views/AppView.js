var app = app || {};
// var window.app = app;

app.AppView = Backbone.View.extend({
	el: 'body', 
	
	results_header_template: _.template($('#results-header-template').html()),
	events: {
		'click #search-button' : 'search_router',
		'click .add-button' : 'add_to_cart'
		// 'keyup .code' : 'search',
		// 'keyup .title' : 'search',
		// 'keyup .dept' : 'search',
		// 'keyup .prof' : 'search',
		// 'keyup .time' : 'search',
		// 'click #table-header-credits': 'handle_sorting_by_credits',

	},
	initialize: function(){
		this.$('#search-button').click(function(event){
			event.preventDefault(); // deals with error and race condition
		});
		var self = this;
		_.bindAll(this, 'query_on_success', 'query_on_error', 
			'add_to_cart_success', 'add_to_cart_error', 'addCourse', 'sort_by_credits'
			,'handle_sorting_by_credits', 
			'subsections_query_on_success', 'subsections_query_on_error');

		/*---------------Declare and initialize some variables-----------------------*/
		app.results = new app.CourseCollection();
		app.sub_results = new app.SubsectionCollection();
		app.queries = [];
		app.option_building;
		/*----------------Setting up listeners-----------------------*/
		this.listenTo(app.results, 'add', this.addCourse);
		this.listenTo(app.sub_results, 'add', this.addSubsection);
		this.listenTo(app.results, 'reset', this.reset_all_courses);
		this.listenTo(app.sub_results, 'reset', this.reset_all_courses);

		$("input[name=buildings]").focusout(function () {
            app.option_building = ($(this).val());
		    console.log(app.option_building);
        });


		/*---------------Initialized the rest of the variables------------------*/
		var looking_for_prof, looking_for_courses = 0;
	},
	render: function(){
			// console.log("stuff");

	},
	search_router: function(){
		/*------------Getting values from input form-----------*/

		var code_input = this.$('#code').val().trim();
		var prof_input = this.$('#prof').val().trim();
		var time_input = this.$('#time').val().trim();
		/*------------Are we searching for courses or subsections?-----*/

		if (prof_input || time_input || app.option_building){
			this.find_courses_from_subsections();
		} else if (code_input) {
			this.find_courses_from_course_code();
		} else {
			self.$('#results').html('');
		}

	},

	find_courses_from_subsections: function(){
		$('#results').html('');
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

			// if (contains_spaces){
			// 	var first_name = search_string_prof.slice(0, index_of_space);
			// 	var last_name = search_string_prof.slice(index_of_space + 1);
			// 	var search_string_prof = '["' + last_name + ", " + first_name + '"]';
			// 	console.log(search_string_prof);
			// }
			// 	// just contains the last name;

			if (contains_spaces){
				// var prof_names = [];
				var first_name = search_string_prof.slice(0, index_of_space);
				var last_name = search_string_prof.slice(index_of_space + 1);
				search_string_prof =  last_name + ", " + first_name + " " ;
				// prof_names.push(search_string_prof);
			}
				console.log(search_string_prof);
				query.startsWith("instructor", search_string_prof);

		}
		if (time_input) {
			var time_string = time_input;
			var format = "HHMM-HHMM";

			if (time_string.length == format.length) {
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
			}

		}
		if (building_input) {
			var building_search_string = building_input;
			console.log(building_search_string);
			query.startsWith("location", building_search_string);
		}

		if (code_input || prof_input || time_input || building_input ) {
			query.find({
				success: this.subsections_query_on_success,
				error: this.subsections_query_on_error
			});
		}


	},
	subsections_query_on_success: function(results){
		app.results.reset(); 
		app.sub_results.reset();
		$('#results').html(''); 
		if (results.length == 0){
			var error_msg = '<p>No results were found. Please check your spelling.</p>';
			self.$('#results').prepend(error_msg);
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
		app.results.reset(); 
		app.sub_results.reset();
		console.log(err.message());
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
		var	inner_query = new Parse.Query(app.SubsectionModel);
		var inner_query_needed = false;

		$('#results').html(''); 

		if (self.looking_for_courses){
			// var extra_queries = [];
			// for (var k =0; k< app.queries.length; k++){
			// 	var c = new Parse.Query(app.CourseModel);
			// 	c.equalTo("section_id", app.queries[k]);
			// 	extra_queries.push(c);
			// }
			// var q = new Parse.Query.or.apply(, extra_queries);
			// var q = new Parse.Query("Section");
			// q._orQuery(extra_queries);
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
			// if (prof_input) {
			// 	// inner_query_needed = true;
			// 	var search_string_prof = prof_input.toUpperCase();

			// 	var index_of_space = search_string_prof.indexOf(' ');
			// 	var contains_spaces = index_of_space > -1;

				// if (contains_spaces){
				// 	var first_name = search_string_prof.slice(0, index_of_space);
				// 	var last_name = search_string_prof.slice(index_of_space + 1);
				// 	var search_string_prof = '["' + last_name + ", " + first_name + '"]';
				// 	console.log(search_string_prof);
				// }
				// 	// just contains the last name;



				// if (contains_spaces){
				// 	inner_query_needed = true;
				// 	var prof_names = [];
				// 	var first_name = search_string_prof.slice(0, index_of_space);
				// 	var last_name = search_string_prof.slice(index_of_space + 1);
				// 	search_string_prof =  last_name + ", " + first_name + " " ;
				// 	console.log(search_string_prof);
				// 	prof_names.push(search_string_prof);
				// 	inner_query.containedIn("instructor", prof_names);
				// } else {
				// 	prof_names.push(search_string_prof);
				// 	inner_query.containedIn("instructor", prof_names);
				// }

			
			// if (time_input) {
			// 	inner_query_needed = true;
			// 	var time_string = time_input;
			// 	var format = "HHMM-HHMM";

			// 	if (time_string.length == format.length) {
			// 		var start_time = parseInt(time_string.slice(0, 4));
			// 		var end_time = parseInt(time_string.slice(5));
			// 		inner_query.greaterThanOrEqualTo("startTime", start_time);
			// 		inner_query.lessThanOrEqualTo("endTime", end_time);
			// 	}
			// }
			// will implement later when we display actual sections
			// if (term1_is_checked || term2_is_checked){

			// 	if (term1_is_checked && !term2_is_checked){
			// 		inner_query_needed = true;
			// 		inner_query.lessThan("term", 2);

			// 	} else if (!term1_is_checked && term2_is_checked){
			// 		inner_query_needed = true;
			// 		inner_query.greaterThan("term", 1);
			// 	}

			// }
			// if (building_input) {
			// 	inner_query_needed = true;
			// 	var building_search_string = building_input;
			// 	console.log(building_search_string);
			// 	inner_query.startsWith("location", building_search_string);
			// }
		}
		if (code_input || prof_input || time_input || building_input
				|| term_input ){

			query.find({
				success: this.query_on_success,
				error: this.query_on_error
			});
		}
	

	},

	query_on_success: function(results){
		console.log('Results');
		app.queries = [];
		app.results.reset(); 
		app.sub_results.reset();
		if (results.length == 0){
			var error_msg = '<p>No results were found. Please check your spelling.</p>';
			self.$('#results').prepend(error_msg);
		}
		for (var i = 0; i < results.length; i++){
			var obj = results[i];
			if (obj instanceof(app.CourseModel)){
				if (document.getElementById(obj.id) == null) {
					app.results.add(obj);
				}
			} 
			// else if (obj instanceof(app.SubsectionModel)) {
			// 	if (document.getElementById(obj.id) == null) {
			// 		app.sub_results.add(obj);
			// 	}
			// };
			
		}

	},	

	query_on_error: function(err){
		app.results.reset();
		// alert(err.message);
		self.$('#results').html('');
		var error_msg = '<p>Error message: ' + err.message + '</p>';
		self.$('#results').prepend(error_msg);

	},
	add_to_cart: function(event){
		var id_obj = event.target.className;
		var course_id = $(event.target).closest('.course-result').children('p').text();
		console.log(course_id);
		$('#courses').append('<li>' + 
								'<div class="item">' +
								'<p class="worklist-title">' + course_id + '</p>' +
								'<i class="fa fa-trash-o worklist-delete"></i>' + 
								'</div>' +
							 '</li>');
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
	logOut: function(){

	},
	logIn: function(){

	},
	sort_by_department: function(){

	},
	sort_by_level: function(){

	},


	addCourse: function(obj){
		var view = new self.app.CourseView({model: obj});
		self.$('#results').prepend(view.el);
	},

	addSubsection: function(obj){
		self.app.queries.push(obj.get("section_id"));
	},

	reset_all_courses: function(){
		$('#results').html('');
	},

	addCourseByCredits: function(obj){
		var view = new self.app.CourseView({model: obj});
		self.$('#results').append(view.el);
	},
	sort_by_credits: function(){
		app.results.sortBy(function(course){
			return course.get("credits");
		});		
	},
	handle_sorting_by_credits: function(){
		function sort_by_credits(){
			app.results.sortBy(function(course){
			return course.get("credits");
		});	}

		$('#results').html('');
		sort_by_credits.forEach(function(course){
			console.log("adding the views");
			console.log(course);
			console.log(course instanceof(app.CourseModel)); // returns true 
			this.app.appp.addCourse(course);
		});
	}
});
