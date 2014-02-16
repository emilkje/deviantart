var _ = require('lodash');
var S = require('string');
var config = require('./config');

var exports = module.exports = function wash(article) {
	
	if(!article['media:content'])
		return false;

	obj = {};
	obj.title = article.title;
	obj.description = article.description ? S(article.description).stripTags().s : "";
	obj.summary = article.summary ? S(article.summary).stripTags().s : "";
	obj.thumbnail = {};
	obj.thumbnail.url = article['media:thumbnail'][config.thumbnail.type]['@'].url;
	obj.thumbnail.height = article['media:thumbnail'][config.thumbnail.type]['@'].height;
	obj.thumbnail.width = article['media:thumbnail'][config.thumbnail.type]['@'].width;
	obj.media = {};
	obj.media.url = article['media:content']['@'].url;
	obj.media.height = article['media:content']['@'].height;
	obj.media.width = article['media:content']['@'].width;
	obj.media.type = article['media:content']['@'].medium;
	obj.category = {label: article['media:category']['@'].label, key: article['media:category']['#']};

	return obj;
}
