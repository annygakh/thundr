var app = app || {};

 app.CourseModel = Parse.Object.extend({
 	className: 'Section',
    defaults: {
		department: "",
		code: "",
		credit: "",
		description: "",
		pre_reqs: [],
		co_reqs: [],
		post_reqs: [],
		labs: [],
		tutorials: [],
		sections: [],
	},

	/* initialize: function(){
        if (!this.get("department")) {
                this.set({"department": this.defaults.content});
        }
        if (!this.get("code")) {
                this.set({"code": this.defaults.content});
        }
        if (!this.get("credit")) {
                this.set({"credit": this.defaults.content});
        }
        if (!this.get("description")) {
                this.set({"description": this.defaults.content});
        }
        if (!this.get("pre_reqs")) {
                this.set({"pre_reqs": this.defaults.content});
        }
        if (!this.get("co_reqs")) {
                this.set({"co_reqs": this.defaults.content});
        }
        if (!this.get("post_reqs")) {
                this.set({"post_reqs": this.defaults.content});
        }
        if (!this.get("labs")) {
                this.set({"labs": this.defaults.content});
        }
        if (!this.get("tutorials")) {
                this.set({"tutorials": this.defaults.content});
        }
        if (!this.get("sections")) {
                this.set({"sections": this.defaults.content});
        }
    }, */
    
	/* validate: function(attributes){
		
	} */
	// more additional functions below


});