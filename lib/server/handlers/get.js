var _ = require('underscore'),
	Hapi = require('hapi'),
	queryParser = require('./../query');

var orm, serializer;

module.exports = function (ormModule, serializerModule) {
	orm = ormModule;
	serializer = serializerModule;

	return handler;
};

function handler (request) {
	var path = request.params.path,
		rawParts = path.split('/'),
		parts = [],
		modelName, primaryKey;

	rawParts.forEach(function (value) {
		if (value)
			parts.push(value);
	});

	modelName = parts[0];
	primaryKey = parts[1];

	try {
		// Get the base model
		model = orm.factory(modelName);

		if (primaryKey !== undefined) {
			model.find(primaryKey).then(function (data) {
				if ( ! data)
					request.reply(Hapi.error.notFound(error.message));

				request.reply(prettyJson(serializer.serialize(data))).type(serializer.type());
			}, error).then(null, error);
		}
		else {
			// Parse the params
			queryParser(request.query, model);
			
			model.findAll().then(function (data) {
				var d = [];

				data.forEach(function(value) {
					d.push(serializer.serialize(value));
				});

				request.reply(prettyJson(d)).type(serializer.type());
			}, error).then(null, error);
		}
	}
	catch (err) {
		if (err.name === 'AssertionException')
			return request.reply(Hapi.error.notFound());
		error(err);
	}

	function error (err) {
		request.reply(Hapi.error.internal(err.message));
		console.error(err.message);
		console.error(err.stack);
	}
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}