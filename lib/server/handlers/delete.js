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
				// Found nothing! Bail!
				if ( ! data)
					return RSVP.Promise.cast(reply(Hapi.error.notFound(error.message)));

				return  RSVP.Promise.cast(data.preDeleteHook()).then(function (data) {
					return data.delete();
				}).then(function (data) {
					reply().code(204);
				}).then(function () {
					data.postDeleteHook();
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