var _ = require('underscore'),
	Hapi = require('hapi'),
	queryParser = require('./../query');

var orm, serializer, parsedSchema;

module.exports = function (ormModule, serializerModule) {
	orm = ormModule;
	serializer = serializerModule;

	return handler;
};

function handler (request) {
	if (parsedSchema)
		return request.reply(prettyJson(parsedSchema)).type('application/json');

	var links = {
		self: {
			href: request.server.info.uri+'/api'
		},
		_schema: {
			href: request.server.info.uri+'/schema'
		}
	};

	_.each(orm.getSchema().getModels(), function (value) {
		console.info(value)
		links[value.getPluralizedName()] = {
			href: request.server.info.uri+'/api/'+value.getPluralizedName()
		};
	});

	parsedSchema = {
		_links: links
	};

	return request.reply(prettyJson(parsedSchema)).type('application/json');
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}