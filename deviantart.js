var fparser = require('feedparser'),
    request = require('request'),
    wash    = require('./wash'),
    config  =	require('./config');

var feed = function Feed() {
	
}

var deviantart = function Deviantart(config) {
	this.config = config || {username: "kellebass", name: "Simen Kjelsrud"};
}

deviantart.prototype.list = function(cb) {
	var req = request('http://backend.deviantart.com/rss.xml?type=deviation&q=by%3A' + this.config.username + '+sort%3Atime+meta%3Aall');
	var feedparser = new fparser();

	var list = [];
	var raw = [];

	req.on('error', function(err){
		if(err) throw err;
	});

	req.on('response', function(res){
		var stream = this;
		
		if(res.statusCode != 200) 
			return this.emit('error', new Error('Bad status code from requested feed'));

		stream.pipe(feedparser);
	});

	feedparser.on('error', function(err){
		if(err) throw err;
	});

	feedparser.on('readable', function(){

		var stream = this,
				meta   = this.meta,
				item;

		while(item = stream.read()) {
			list.push(wash(item));
			raw.push(item);
		}
	});

	feedparser.on('end', function(){
		cb(list, raw);
	});
}

exports = module.exports = deviantart;