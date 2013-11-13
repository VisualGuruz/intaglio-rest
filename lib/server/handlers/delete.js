var _ = require('underscore'),
	Hapi = require('hapi');

var orm, serializer;

module.exports = function (ormModule, serializerModule) {
	orm = ormModule;
	serializer = serializerModule;

	return handler;
};

function handler (request) {
	var modelSchema = orm.getSchema().getModel(request.params.model),
		primaryKey = request.params.id,
		model;

	if ( ! modelSchema)
		return request.reply(Hapi.error.notFound());

	try {
		// Get the base model
		model = orm.factory(modelSchema.getName());

		if (primaryKey !==  '') {
			// We're updating something!
			model.find(primaryKey).then(function (data) {
				if ( ! data)
					return request.reply(Hapi.error.notFound(error.message));

				data.delete().then(function () {
					request.reply().code(204);
				}, error).then(null, error);
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