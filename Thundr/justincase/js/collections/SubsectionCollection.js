var app = app || {};

app.SubsectionCollection = Parse.Collection.extend({
	model: app.SubsectionModel,

	initialize: function(){
		var self = this;
	},
});