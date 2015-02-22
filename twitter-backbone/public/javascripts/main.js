(function($) {

	_.templateSettings = {
		interpolate: /\{\{(.+?)\}\}/g
	};

	// Tweet Model
	var Tweet = Backbone.Model.extend({
		defaults: function() {
			return {
				author: '',
				status: ''
			}
		}
	});

	// Collection = Group of Models
	var TweetList = Backbone.Collection.extend({
		model: Tweet
	});

	var tweets = new TweetList();

	var TweetView = Backbone.View.extend({
		model: new Tweet(),
		tagName: 'div',
		events: {
			'click .edit'	: 'edit',
			'click .delete'	: 'delete',
			'blur .status'	: 'close',
			'keypress .status' : 'onEnterUpdate'
		},

		initialize: function() {
			this.template = _.template($('#tweet-template').html());
		},

		edit: function(ev) {
			ev.preventDefault();
			this.$('.status').attr('contenteditable', true).focus();
		},

		close: function(ev) {
			var status = this.$('.status').text();
			this.model.set('status', status);
			this.$('.status').removeAttr('contenteditable');
		},

		onEnterUpdate: function(ev) {
			if (ev.keyCode === 13) {
				this.close();
				_.delay(function() {self.$('.status').blur()}, 100);
			}
		},

		delete: function(ev) {
			ev.preventDefault();
			tweets.remove(this.model);
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	var TweetsView = Backbone.View.extend({
		model: tweets,
		el: $('#tweets-container'),
		initialize: function() {
			this.model.on('add', this.render, this);
			this.model.on('remove', this.render, this);
		},
		render: function() {
			var self = this;
			self.$el.html('');
			_.each(this.model.toArray(), function(tweet, i) {
				self.$el.append((new TweetView({ model: tweet })).render().$el);
			});
			return this;
		}
	});

	$(document).ready(function() {
		$('#new-tweet').submit(function(ev) {
			var tweet = new Tweet({ author: $('#author-name').val(), status: $('#status-update').val() });
			tweets.add(tweet);
			console.log(tweets.toJSON());
			return false;
		});
		var appView = new TweetsView();
	});

})(jQuery);