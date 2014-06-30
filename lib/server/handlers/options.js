var _ = require('underscore'),
	Hapi = require('hapi');

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

		if ( ! _.isEmpty(primaryKey)) {
			// We're updating something!
			model.find(primaryKey).then(function (data) {
				if ( ! data)
					return RSVP.Promise.cast(reply(Hapi.error.notFound(error.message)));
			}).catch(error);
		}
		else {
			// No PUTting on a collection
			reply().header('Allow', 'GET, POST, OPTIONS, HEAD');
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
	}
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}