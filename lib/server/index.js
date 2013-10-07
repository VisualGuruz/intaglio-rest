var Hapi = require('hapi'),
	handler = require('./handler'),
	Intaglio = require('intaglio');

module.exports = function (orm, host, port, serializer, options) {
	Intaglio.utils.assert('`orm` is required!', orm !== undefined);
	Intaglio.utils.assert('`host` is required!', host !== undefined);
	Intaglio.utils.assert('`port` is required!', port !== undefined);
	Intaglio.utils.assert('`serializer` is required!', serializer !== undefined);

	var server = Hapi.createServer(host, port, options),
		routes = [
			{
				path: '/api/{path*}',
				method: '*',
				handler: handler(orm, serializer)
			}
		];

	server.route(routes);

	return server;
};