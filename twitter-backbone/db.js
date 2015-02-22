var Mongolian = require('mongolian');

var server = new Mongolian();

var db = server.db('backbone_tutorial');

module.exports.collections = {
	tweets: db.collection('tweets')
};