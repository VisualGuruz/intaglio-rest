var _ = require('underscore'),
	Hapi = require('hapi');

var orm, serializer;

module.exports = function (ormModule, serializerModule) {
	orm = ormModule;
	serializer = serializerModule;

	return handler;
};

function handler (request) {
	var path = request.params.path,
		rawParts = path.split('/');
		parts = [];

	request.header
	rawParts.forEach(function (value) {
		if (value)
			parts.push(value);
	});

	if (parts.length === 1) {
		try {
			orm.factory(parts[0]).findAll().then(function (data) {
				var d = [];

				data.forEach(function(value) {
					d.push(serializer.serialize(value));
				});

				request.reply(prettyJson(d)).type(serializer.type());
			}, error).then(null, error);
		}
		catch (err) {
			request.reply(Hapi.error.notFound(error.message));
		}
	}
	else if (parts.length === 2) {
		try {
			orm.factory(parts[0]).find(parts[1]).then(function (data) {
				if ( ! data)
					request.reply(Hapi.error.notFound(error.message));

				request.reply(prettyJson(serializer.serialize(data))).type(serializer.type());
			}, error).then(null, error);
		}
		catch (err) {
			request.reply(Hapi.error.notFound(error.message));
		}
	}
	else
		request.reply(Hapi.error.notFound());

	function error (err) {
		request.reply(Hapi.error.internal(err.message));
		console.error(err.message);
		console.error(err.stack);
	}
}

function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}