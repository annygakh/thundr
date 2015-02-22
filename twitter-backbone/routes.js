var home = require('./controllers/home_controller');

/*
 * GET home page
 */

module.exports = function(app) {
	app.get('/', home.index);
};
