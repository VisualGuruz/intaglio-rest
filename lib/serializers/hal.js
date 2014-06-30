var _ = require('underscore');

module.exports = function (request) {
	var api = {
		serialize: function serialize(obj) {
			var baseUrl = request.server.info.uri,
				data = obj.getRawData(),
				links = {
					'_links': {
						'self': {
							'href': baseUrl+obj.getSelfLink()
						}
					}
				};

			return _.extend({}, data, links);
		},

		type: function type() {
			return 'application/json';
		}
	};

	return api;
};
