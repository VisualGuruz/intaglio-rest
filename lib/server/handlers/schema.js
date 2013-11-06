var _ = require('underscore'),
	Hapi = require('hapi');

var orm, serializer;

module.exports = function (ormModule) {
	orm = ormModule;

	return handler;
};

function handler (request) {
	return request.reply(prettyJson(orm.getSchema().getJSON())).type('application/json');
}

function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}