var _ = require('underscore');

var baseUrl, api = {};

module.exports = function (url) {
	baseUrl = url;

	return api;
};

api.serialize = function serialize(obj) {
	var data = obj.getRawData(),
		links = {
			'_links': {
				'self': {
					'href': baseUrl+obj.getSelfLink()
				}
			}
		};

	return _.extend({}, data, links);
};

api.type = function type() {
	return 'application/json';
};