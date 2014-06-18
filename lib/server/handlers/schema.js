var _ = require('underscore'),
	Hapi = require('hapi');

var orm;

module.exports = function (ormModule) {
	orm = ormModule;

	return handler;
};

function handler (request, reply) {
	var schema = {};

	_.each(orm.getSchema().getModels(), function (model) {
		schema[model.getPluralizedName()] = model.getPOJO();

		schema[model.getPluralizedName()].name = model.getPluralizedName();
	});

	return reply(prettyJson(schema)).type('application/json');
}

function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}