var fparser = require('feedparser'),
    request = require('request'),
    wash    = require('../wash'),
    config  =	require('../config');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.writeHead(200, {'Content-Type': 'application/json'});
	
	res.write('{"profile": ');
	res.write(JSON.stringify(config));
	res.write(',"art":');
    
	var req = request('http://backend.deviantart.com/rss.xml?type=deviation&q=by%3A' + config.username + '+sort%3Atime+meta%3Aall');
	var feedparser = new fparser();

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

	var firstItem = true;
	feedparser.on('readable', function(){

		var stream = this,
				meta   = this.meta,
				item;

		while(item = stream.read()) {

			res.write(firstItem ? (firstItem=false,'[') : ',');
			
			var image = wash(item);

			if(image) {
				res.write(JSON.stringify(image));
				firstItem = false;
			}
		}
	});

	feedparser.on('end', function(){
		res.end(']}');
	});
};