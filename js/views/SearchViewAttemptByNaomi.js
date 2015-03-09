var app = app || {};
app.search-view = Backbone.View.extend({
	// tagName ? id ?
	className: 'searchbox', //TODO
    el: '#search',
    model: null,
	// template:
	events: {
        'click #searchbutton': 'search'
	},
	initialize: function(options){
        // this.render();
        var self = this;
        self.model = options.model;
	},
	// render: function(){
		// var template = ._template($('#search_template").html(), {});
        // this.el.html(template);
	// }

	search: function(e){
		// when the search button has been pressed?
        //console.log(this);
        var self = this;
        query = $('#searchbox').val();
        e.preventDefault();
        console.log('Run search against ' + query);
        
        self.model.set('query', '', {silent: true});
        self.model.set('query', query);
	}

});