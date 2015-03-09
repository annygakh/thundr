var app = app || {};
// var window.app = app;

app.AppView = Backbone.View.extend({
	el: 'body', 
	
	results_header_template: _.template($('#results-header-template').html()),
	events: {
		'click #search-button' : 'search',
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
			,'handle_sorting_by_credits', 'findCourse');

		/*---------------Declare and initialize some variables-----------------------*/
		app.results = new app.CourseCollection();
		app.prof_results = new app.SubsectionCollection();
		results.comparator = 'section_id';

		/*----------------Setting up listeners-----------------------*/
		this.listenTo(app.results, 'add', this.addCourse);
		// this.listenTo(app.prof_results, 'add', this.findCourse);
		// this.listenTo(app.results, 'reset', this.reset_all_courses);
		// $('#browserinput').on('input',function() {
		//     self.option_building = $('option[value="'+$(this).val()+'"]').val();
		//     console.log($.type(self.option_building) === 'string');
		//   });

		// $("input[name=browsers]").on('change', function(){
		//     alert($(this).val());
		// });

		/*---------------Initialized the rest of the variables------------------*/
		var looking_for_prof, looking_for_courses = 0;
		var prof_results_courses = [];
	},
	render: function(){
			// console.log("stuff");

	},
	search: function(){
		$('#results').html('');

		/*------------Getting values from input form-----------*/

		var code_input = this.$('#code').val().trim();
		var title_input, dept_input;
		// var title_input = this.$('.title').val().trim();
		// var dept_input = this.$('.dept').val().trim();
		var prof_input = this.$('#prof').val().trim();
		var time_input = this.$('#time').val().trim();
		var term1_is_checked = this.$('#term1').is(':checked');
		var term2_is_checked = this.$('#term2').is(':checked');

		/*------------Form appropriate queries---------------*/
		var	query = new Parse.Query(app.CourseModel);
		var	inner_query = new Parse.Query(app.SubsectionModel);
		var inner_query_needed = false;

		
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
		if (prof_input) {
			// inner_query_needed = true;
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
				inner_query_needed = true;
				var prof_names = [];
				var first_name = search_string_prof.slice(0, index_of_space);
				var last_name = search_string_prof.slice(index_of_space + 1);
				var search_string_prof =  last_name + ", " + first_name + " " ;
				prof_names.push(search_string_prof);
				inner_query.containedIn("instructor", prof_names);
			}

		}
		if (time_input) {
			inner_query_needed = true;
			var time_string = time_input;
			var format = "HHMM-HHMM";

			if (time_string.length == format.length) {
				var start_time = parseInt(time_string.slice(0, 4));
				var end_time = parseInt(time_string.slice(5));
				inner_query.greaterThanOrEqualTo("startTime", start_time);
				inner_query.lessThanOrEqualTo("endTime", end_time);
			}
		}

		if (term1_is_checked || term2_is_checked){
			inner_query_needed = true;

			if (term1_is_checked && term2_is_checked){
				inner_query.containedIn("term", [1,2]);
			} else if (term1_is_checked){
				inner_query.equals("term", 1);
			} else if (term2_is_checked){
				inner_query.equals("term", 2);
			}

		}
		if (self.option_building) {
			inner_query_needed = true;
			var building_search_string = self.option_building;
			console.log(building_search_string);
			inner_query.startsWith("location", building_search_string);
		}
		if (code_input || title_input || dept_input || prof_input || time_input){

			if (inner_query_needed)
				query.matchesQuery("subsections", inner_query);

			query.find({
				success: this.query_on_success,
				error: this.query_on_error
			});
		}

	},

	query_on_success: function(results){
		console.log('Results');
		app.results.reset(); 
		app.prof_results.reset();
		for (var i = 0; i < results.length; i++){
			var obj = results[i];
			if (obj instanceof(app.CourseModel)){
				self.looking_for_courses = 1;
				if (document.getElementById(obj.id) == null) {
					app.results.add(obj);
				}
			} else if (obj instanceof(app.SubsectionModel)) {
				self.looking_for_prof = 1;
				if (document.getElementById(obj.id) == null) {
					// console.log(obj.get("startTime"));
					app.prof_results.add(obj);
				}
			};
			
		}

		// if (looking_for_prof) {
		// 	// app.results.sortBy
		// } else if (looking_for_courses){

		// }

		// if (false){
		// 	self.prof_results_courses = app.prof_results.pluck("section_id");
		// 	console.log(app.prof_results_courses);
		// 	var courses_query = new Parse.Query(app.CourseModel);
		// 	courses_query.containedIn("section_id", self.prof_results_courses);
		// 	courses_query.find({
		// 		success: self.find_courses_from_prof,
		// 		error: self.find_courses_from_prof
		// 	});
		// }



	},	

	query_on_error: function(err){
		app.results.reset();
		// alert(err.message);
	},
	add_to_cart: function(event){
		var id_obj = event.target.className.split(" ")[0];
		var query = new Parse.Query(app.CourseModel);
		console.log(id_obj);
		console.log(query);
		query.get(id_obj, {
			success: this.add_to_cart_success,
			error: this.add_to_cart_error
		})
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
		self.$('#results').append(view.el);
	},

	findCourse: function(obj){
		// console.log(obj instanceof(app.SubsectionModel));
		// console.log(obj);
		var instr = obj.get("instructor");
		// console.log(instr);
		var sub_id = obj.get("section_id");
		// console.log(sub_id);
		self.$('#results').append("<p> instructor: " + instr + " " 
									+ sub_id +
								 "</p>");


	},

	reset_all_courses: function(){
		// $('#results').html('');
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
