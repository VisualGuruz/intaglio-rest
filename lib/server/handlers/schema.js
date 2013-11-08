var _ = require('underscore'),
	Hapi = require('hapi');

var orm, serializer;

module.exports = function (ormModule) {
	orm = ormModule;

	return handler;
};

function handler (request) {
	var schema = {};

	_.each(orm.getSchema().getModels(), function (model) {
		schema[model.getPluralizedName()] = model.getJSON();

		schema[model.getPluralizedName()].name = model.getPluralizedName();
	});

	return request.reply(prettyJson(schema)).type('application/json');
}

function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}