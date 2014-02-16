var deviantart = require('../deviantart');
var config = require('../config');
/*
 * GET home page.
 */

exports.index = function(req, res){
	var d = new deviantart(config);
	d.list(function(list){
		res.render('index', {profile: config, images: list});
	});

};