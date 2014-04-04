var _ = require('underscore'),
	Hapi = require('hapi'),
	queryParser = require('./../query'),
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

	// Make sure the model exists, throw 404 if not
	if ( ! modelSchema)
		return reply(Hapi.error.notFound());

	try {
		// Get the base model
		model = orm.factory(modelSchema.getName());

		// Load the model
		if (primaryKey !== '') {
			model.find(primaryKey).then(function (data) {
				if ( ! data)
					return RSVP.Promise.cast(reply(Hapi.error.notFound(error.message)));

				return RSVP.Promise.cast(data.preGetHook(request)).then(function (data) {
					reply(prettyJson(serializer.serialize(data))).type(serializer.type());
				}).then(function () {
					data.postGetHook(request);
				});
			}).catch(error);
		}
		else {
			// Parse the params
			queryParser(request.query, model);
			
			model.findAll().then(function (data) {
				var d = [],
					wrapper = {
						_embedded: {}
					};

				return RSVP.Promise.cast(data.preGetHook(request)).then(function () {
					data.forEach(function(value) {
						d.push(serializer.serialize(value));
					});

					wrapper._embedded[modelSchema.getPluralizedName()] = d;

					reply(prettyJson(wrapper)).type(serializer.type());

					data.postGetHook(request);
				});



			}, error).then(null, error);
		}
	}
	catch (err) {
		if (err.name === 'AssertionException')
			return reply(Hapi.error.notFound());
		else
			error(err);
	}

	function error (err) {
		console.error(err.message);
		console.error(err.stack);
		reply(err);
	}
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}