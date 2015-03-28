var app = app || {};
app.SubsectionView = Backbone.View.extend({
	// className tagName el id?
	model: app.SubsectionModel,

	tagName: 'tr',
    detailed_view_template: _.template($('#detailed-view-template').html()),
	id: function(){
		return this.model.get('section_id') + '-' + this.model.get('subsection_id'); //html id will be something like CPSC304-L1A
	},
	// template: TODO
	events: {

	},
	initialize: function(){

	},
	render: function(){
        var startTime = this.model.get("startTime");
        if (startTime == null) {
            startTime = "N/A";
        }
        var endTime = this.model.get("endTime");
        if (endTime == null) {
            endTime = "N/A";
        }
        var map = this.model.get("map");
        if (map == undefined) {
            map = "N/A";
        }
        var location = this.model.get("location");
        if (location == "No Scheduled Meeting"){
            location = "N/A";
        }
        var map = this.model.get("map");
		var obj = {
            "term" : this.model.get("term"),
            "code" : this.model.get("subsection_id"),
            "days" : this.model.get("days"),
            "start_time" : startTime,
            "end_time" : endTime,
            "instructor" : this.model.get("instructor"),
            "map" : this.model.get("map"),
            "location" : location,
        };
        var subsection_header_result = this.detailed_view_template(obj);
        return subsection_header_result;
		
	},

	render_lab: function(){

	},
	render_tutorial: function(){

	},
	render_course_section: function(){

	},


});