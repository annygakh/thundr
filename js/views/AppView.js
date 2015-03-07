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
		'click #table-header-credits': 'handle_sorting_by_credits',

	},
	initialize: function(){
		this.$('#search-button').click(function(event){
			event.preventDefault(); // deals with error and race condition
		});
		var self = this;
		_.bindAll(this, 'query_on_success', 'query_on_error', 
			'add_to_cart_success', 'add_to_cart_error', 'addCourse', 'sort_by_credits'
			,'handle_sorting_by_credits');
		app.results = new app.CourseCollection();
		this.listenTo(app.results, 'add', this.addCourse);
		// this.listenTo(app.results, 'reset', this.addCourse);
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
		var title_input = this.$('.title').val().trim();
		var dept_input = this.$('.dept').val().trim();
		var prof_input = this.$('.prof').val().trim();
		var time_input = this.$('.time').val().trim();

		var	query = new Parse.Query(app.CourseModel);

		if (code_input) {
			
			if (code_input.indexOf(' ') > -1 ){

			}
			query.startsWith("title", code_input.toUpperCase());
		}
		if (title_input) {
			
			query.startsWith("title", title_input);
		}
		if (dept_input) {
			query.startsWith("dept", dept_input);
		}
		if (prof_input) {
			query.startsWith("prof", prof_input);
		}
		if (time_input) {
			// TODO
		}
		if (code_input || title_input || dept_input || prof_input || time_input){
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
		for (var i = 0; i < results.length; i++){
			var obj = results[i];
			
			if (document.getElementById(obj.id) == null) {
				app.results.add(obj);
				// console.log(obj);
				// console.log(obj instanceof(app.CourseModel)); // returns true 
				// var view = new self.app.CourseView({model: obj});
				// self.$('#results').append(view.el);
			}
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
