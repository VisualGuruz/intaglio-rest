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
		return request.reply(prettyJson(parsedSchema));

	var links = {
		self: {
			href: request.server.info.uri+'/api'
		},
		_schema: {
			href: request.server.info.uri+'/schema'
		}
	};

	_.each(orm.getSchema().getJSON(), function (value, key) {
		links[key] = {
			href: request.server.info.uri+'/api/'+key
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