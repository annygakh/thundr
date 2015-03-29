var app = app || {};
app.SubsectionView = Backbone.View.extend({
	// className tagName el id?
	model: app.SubsectionModel,

	tagName: 'tr',
    detailed_view_template: _.template($('#detailed-view-details-template').html()),
	id: function(){
		return this.model.get('section_id') + '-' + this.model.get('subsection_id'); //html id will be something like CPSC304-L1A
	},
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
            map = "";
        }
        var location = this.model.get("location");
        if (location == "No Scheduled Meeting"){
            location = "N/A";
        }
        var days_string;
        var days = this.model.get("days");
	        if (days == undefined){
	        	days_string = 'N/A';
        	} else {
		        days_string = "";
		        for (var j = 0; j < days.length; j++){
		        	if (days[j] == 1) 
		        		days_string += 'M';
		        	else if (days[j] == 2)
		        		days_string += 'Tu';
		        	else if (days[j] == 3)
		        		days_string += 'W';
		        	else if (days[j] == 4)
		        		days_string += 'Th';
		        	else if (days[j] == 5)
		        		days_string += 'F';
		        		
	        	}
	        }
        

		var obj = {
            "term" : this.model.get("term"),
            "code" : this.model.get("subsection_id"),
            "days" : days_string,
            "start_time" : startTime,
            "end_time" : endTime,
            "instructor" : this.model.get("instructor"),
            "map" : this.model.get("map"),
            "location" : location,
        };
        var subsection_header_result = this.detailed_view_template(obj);
        $(this.el).html(subsection_header_result);
        return subsection_header_result;
		
	},

	render_lab: function(){

	},
	render_tutorial: function(){

	},
	render_course_section: function(){

	},


});