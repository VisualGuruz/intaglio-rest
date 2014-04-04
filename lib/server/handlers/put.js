var _ = require('underscore'),
	Hapi = require('hapi'),
	RSVP = require('rsvp');

var orm, serializer;

module.exports = function (ormModule, serializerModule) {
	orm = ormModule;
	serializer = serializerModule;

	return handler;
};

function handler (request, reply) {
	var modelSchema = orm.getSchema().getModel(request.params.model),
		primaryKey = request.params.id,
		model;

	if ( ! modelSchema)
		return reply(Hapi.error.notFound());

	try {
		// Get the base model
		model = orm.factory(modelSchema.getName());

		if (primaryKey !==  '') {
			// We're updating something!
			model.find(primaryKey).then(function (data) {
				var ret;

				if ( ! data)
					return RSVP.Promise.cast(reply(Hapi.error.notFound(error.message)));

				return RSVP.Promise.cast(data.prePutHook(request)).then(function (data) {
					// Make sure they're doing full resource puts
					var keys = _.keys(data.getRawData()),
						valid = true;

					_.each(keys, function (key) {
						if (valid)
							valid = _.has(request.payload, key);
					});

					// If it's missing a key, kill it
					if ( ! valid)
						throw Hapi.error.badRequest("PUTs must have the entire object as the payload.");

					return data.set(request.payload).save();
				}).then(function (data) {
					reply(prettyJson(serializer.serialize(data))).type(serializer.type());
				}).then(function () {
					data.postPutHook(request);
				});
			}).catch(error);
		}
		else {
			// No PUTting on a collection
			reply(Hapi.error.methodNotAllowed());
		}
	}
	catch (err) {
		if (err.name === 'AssertionException')
			return reply(Hapi.error.notFound());
		else
			error(err);
	}

	function error (err) {
		reply(err);
		console.error(err.message);
		console.error(err.stack);
	}
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}