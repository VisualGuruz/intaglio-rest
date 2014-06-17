var pkg = require('./package.json'),
	server = require('./lib/server');

module.exports = function (orm) {
	var register = function register (plugin, options, next) {
		// Setup the server
		server(orm, plugin);

		next();
	};

	// Add the attributes to the plugin
	register.attributes = {pkg: pkg}

	// Return the plugin
	return register;
};