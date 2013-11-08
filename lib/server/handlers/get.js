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
	var modelSchema = orm.getSchema().getModel(request.params.model),
		primaryKey = request.params.id,
		model;

	if ( ! modelSchema)
		return request.reply(Hapi.error.notFound());

	try {
		// Get the base model
		model = orm.factory(modelSchema.getName());

		if (primaryKey !== '') {
			model.find(primaryKey).then(function (data) {
				if ( ! data)
					return request.reply(Hapi.error.notFound(error.message));

				request.reply(prettyJson(serializer.serialize(data))).type(serializer.type());
			}, error).then(null, error);
		}
		else {
			// Parse the params
			queryParser(request.query, model);
			
			model.findAll().then(function (data) {
				var d = [],
					wrapper = {
						_embedded: {}
					};

				data.forEach(function(value) {
					d.push(serializer.serialize(value));
				});

				wrapper._embedded[modelSchema.getPluralizedName()] = d;

				request.reply(prettyJson(wrapper)).type(serializer.type());
			}, error).then(null, error);
		}
	}
	catch (err) {
		if (err.name === 'AssertionException')
			return request.reply(Hapi.error.notFound());
		error(err);
	}

	function error (err) {
		console.error(err.message);
		console.error(err.stack);
		request.reply(Hapi.error.internal(err.message));
	}
}



function prettyJson(obj) {
	return JSON.stringify(obj, null, 4);
}