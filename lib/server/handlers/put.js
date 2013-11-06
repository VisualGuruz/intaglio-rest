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
			// We're updating something!
			model.find(primaryKey).then(function (data) {
				if ( ! data)
					return request.reply(Hapi.error.notFound(error.message));

				// Make sure they're doing full resource puts
				var keys = _.keys(data.getRawData()),
					valid = true;

				_.each(keys, function (key) {
					if (valid)
						valid = _.has(request.payload, key);
				});

				// If it's missing a key, kill it
				if ( ! valid)
					return request.reply(Hapi.error.badRequest("PUTs must have the entire object as the payload."));

				data.set(request.payload).save().then(function (data) {
					request.reply(prettyJson(serializer.serialize(data))).type(serializer.type());
				}, error);
			}, error).then(null, error);
		}
		else {
			// No PUTting on a collection
			request.reply(Hapi.error.methodNotAllowed());
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