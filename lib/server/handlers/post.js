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
				if ( ! data)
					return RSVP.Promise.cast(reply(Hapi.error.notFound(error.message)));

				return RSVP.Promise.cast(data.prePostHook(request)).then(function (data) {
					return data.set(request.payload).save();
				}).then(function (data) {
					return reply(prettyJson(serializer.serialize(data))).type(serializer.type());
				}).then(function () {
					data.postPostHook(request);
				});
			}).catch(error);
		}
		else {
			// We're creating something!
			RSVP.Promise.cast(model.create(request.payload).prePostHook(request)).then(function (data) {
				return data.save();
			}).then(function (data) {
				reply(prettyJson(serializer.serialize(data))).type(serializer.type());

				return data;
			}).then(function (data) {
				data.postPostHook(request);
			}).catch(function (err) {
				if (err.name === 'ValidationException')
					reply(Hapi.error.badRequest(err.message));
				throw err;
			});
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