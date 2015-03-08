var app = app || {};
// var window.app = app;

app.AppView = Backbone.View.extend({
	el: 'body', 
	

	// worklist_template: _.template($('#worklist-item-template').html()), // i will move this into a diff view class
	results_header_template: _.template($('#results-header-template').html()),
	events: {
		'click #search-button' : 'search',
		'keyup .code' : 'search',
		'keyup .title' : 'search',
		'keyup .dept' : 'search',
		'keyup .prof' : 'search',
		'keyup .time' : 'search',
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
		app.results = new app.CourseCollection();
		app.prof_results = new app.SubsectionCollection();


		this.listenTo(app.results, 'add', this.addCourse);
		this.listenTo(app.prof_results, 'add', this.findCourse);
		// this.listenTo(app.results, 'reset', this.addCourse);
		var looking_for_prof = 0;
		var prof_results_courses = [];
	},
	render: function(){
			console.log("stuff");

	},
	search: function(){
		/*
		this is a very rough search functionality
		still have to implement the following functionality
		1)---------- as a user if i am typing up results, and i suddenly erase some letters, 
					i want it to be reflected in the results
					- so if i was typing CP and all the CPSC courses showed up,
					if i was to erase the letter P, i want the results to contain
					all courses with title starting with C
		2)----------make our searches case insensitive
		3)----------make our search more efficient and allow users to search by 
					bits
		4)----------

		*/
		$('#results').html('');

		var code_input = this.$('.code').val().trim();
		var title_input, dept_input;
		// var title_input = this.$('.title').val().trim();
		// var dept_input = this.$('.dept').val().trim();
		var prof_input = this.$('.prof').val().trim();
		var time_input = this.$('.time').val().trim();

		var	query = new Parse.Query(app.CourseModel);

		if (code_input) {
		// query.limit(1000);

			var search_string_code = code_input.toUpperCase();
			var index_of_space = search_string_code.indexOf(' ');
			var contains_spaces = index_of_space > -1;

			if (contains_spaces){
				query.startsWith("title", search_string_code);
			} else {
				query.startsWith("section_id", search_string_code);
			}

		}
		// if (title_input) {
			
		// 	query.startsWith("title", title_input);
		// }
		// if (dept_input) {
		// 	query.startsWith("dept", dept_input);
		// }
		if (prof_input) {

			var search_string_prof = prof_input;

			var index_of_space = search_string_prof.indexOf(' ');
			var contains_spaces = index_of_space > -1;

			if (contains_spaces){
				var first_name = search_string_prof.slice(0, index_of_space);
				var last_name = search_string_prof.slice(index_of_space + 1);
				var search_string_prof = last_name + ", " + first_name;
				console.log(search_string_prof);
			}
				// just contains the last name;

			var prof_query = new Parse.Query(app.SubsectionModel);
			prof_query.startsWith("instructor", search_string_prof.toUpperCase());
			query = prof_query;

			// query.equalTo("subsections", prof_query);

		}
		if (time_input) {
			// TODO
		}
		if (false){
			query.find({
				success: this.query_on_success,
				error: this.query_on_error
			});
		}
		else if (code_input || title_input || dept_input || prof_input || time_input){

			query.find({
				success: this.query_on_success,
				error: this.query_on_error
			});
		}

	},

	handle_change_in_code_input: function(){
		// call to parse to return results
		var code_input = this.$('.code').val();
		self.$("#result-code").text(code_input);
		self.search();
	},

	query_on_success: function(results){
		app.results.reset(); 
		app.prof_results.reset();
		for (var i = 0; i < results.length; i++){
			var obj = results[i];
			if (obj instanceof(app.CourseModel)){
				looking_for_prof = 0;
				if (document.getElementById(obj.id) == null) {
					app.results.add(obj);
				}
			} else if (obj instanceof(app.SubsectionModel)) {
				looking_for_prof = 1;
				if (document.getElementById(obj.id) == null) {
					app.prof_results.add(obj);
				}
			};
			
			looking_for_prof = 0;
		}
		if (false){
			self.prof_results_courses = app.prof_results.pluck("section_id");
			console.log(app.prof_results_courses);
			var courses_query = new Parse.Query(app.CourseModel);
			courses_query.containedIn("section_id", self.prof_results_courses);
			courses_query.find({
				success: self.find_courses_from_prof,
				error: self.find_courses_from_prof
			});
		}



	},	

	query_on_error: function(err){
		app.results.reset();
		alert(err.message);
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

	addCourseByCredits: function(obj){
		console.log('stuff');
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
