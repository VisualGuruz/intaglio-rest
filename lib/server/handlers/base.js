var _ = require('underscore'),
	Hapi = require('hapi'),
	queryParser = require('./../query');

var orm, parsedSchema, baseUrl;

module.exports = function (ormModule) {
	orm = ormModule;

	return handler;
};

function handler (request, reply) {
	if (parsedSchema)
		return reply(prettyJson(parsedSchema)).type('application/json');

	// Build the base URL
	if (_.isEmpty(baseUrl))
		baseUrl = request.server.info.protocol+'://'+request.info.host;

	var links = {
		self: {
			href: baseUrl+'/api'
		},
		_schema: {
			href: baseUrl+'/schema'
		}
	};

	_.each(orm.getSchema().getModels(), function (value) {
		links[value.getPluralizedName()] = {
			href: baseUrl+'/api/'+value.getPluralizedName()
		};
	});

	parsedSchema = {
		_links: links
	};

	return reply(prettyJson(parsedSchema)).type('application/json');
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}