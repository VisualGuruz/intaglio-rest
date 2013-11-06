var _ = require('underscore');

module.exports = function queryParser (queryParams, model) {
	var cleanParams = {};

	// Clean out the empty params
	_.each(queryParams, function (value, key) {
		if (value !== '') {
			if (_.isArray(value))
				cleanParams[key] = value[0];
			else
				cleanParams[key] = value;
		}
	});
	
	console.info('Query Params:', cleanParams);

	parseParams(model, cleanParams);
};

function parseParams(model, params) {
	// Go through each param and match up it's where statement
	_.each(params, function (value, key) {
		// Handle limit/offset/order
		if (key === '_limit')
			return model.limit(value);
		if (key === '_offset')
			return model.offset(value);
		if (key === '_order') {
			var parts = value.split(':');
			return model.orderBy(parts[0], parts[1]);
		}


		// Figure out which 'where' to call
		switch (true) {
			// isNotNull
			case /^<>:NULL:/.test(value):
				model.where(key).isNotNull();
				break;

			// isNull
			case /^:NULL:/.test(value):
				model.where(key).isNull();
				break;

			// isLessThanOrEqual
			case /^<\=.*/.test(value):
				model.where(key).isLessThanOrEqual(value.replace(/<=/, ''));
				break;

			// isLessThan
			case /^<(?!=|>).*/.test(value):
				model.where(key).isLessThan(value.replace(/</, ''));
				break;

			// isGreaterThanOrEqual
			case /^>\=.*/.test(value):
				model.where(key).isGreaterThanOrEqual(value.replace(/>=/, ''));
				break;

			// isGreaterthan
			case /^>(?!=).*/.test(value):
				model.where(key).isGreaterThan(value.replace(/>/, ''));
				break;

			// isBetween
			case /^(?!\\).*(?!\\)\|.*/.test(value):
				var vals = value.split(/(?!\\)\|/);
				model.where(key).isBetween(vals[0], vals[1]);
				break;

			// isNotEqual
			case /^<>.*/.test(value):
				model.where(key).isNotEqual(value.replace(/<>/, ''));
				break;

			// Basic isEqual
			default:
				model.where(key).isEqual(value);
				break;
		}
	});
}