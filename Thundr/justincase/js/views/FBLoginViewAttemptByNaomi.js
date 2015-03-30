// Naomi: my beginning attempt on fb login

var app = app || {};

var FBLoginView = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(fb.templateLoader.get('login'));
        this.model.on("change", this.render, this);
        this.render();
    },
    
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        'click .login': 'login'
        'click .logout': 'logout'
    },

    login: function(e){
        $(document).trigger('login');
        return false;
    },

    logout: function (e) {
        $(document).trigger('logout');
        return false;
    }
});