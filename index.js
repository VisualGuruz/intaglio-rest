var pkg = require('./package.json'),
	server = require('./lib/server'),
	decorator = require('./lib/decorator');

module.exports = function (orm) {
	var plugin = {
		register: function register (plugin, options, next) {

			console.info(plugin);

			// Setup the server
			server(orm, plugin);

			next();
		}
	};

	// Decorate the ORM
	orm.decorate(decorator);

	// Add the attributes to the plugin
	plugin.register.attributes = {pkg: pkg}

	// Return the plugin
	return plugin;
};