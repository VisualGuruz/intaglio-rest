var _ = require('underscore'),
	Hapi = require('hapi');

var orm, serializer;

module.exports = function (ormModule) {
	orm = ormModule;

	return handler;
};

function handler (request) {
	request.reply('COMING SOON!');

	function error (err) {
		request.reply(Hapi.error.internal(err.message));
		console.error(err.message);
		console.error(err.stack);
	}
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}