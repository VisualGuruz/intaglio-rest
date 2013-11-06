var Hapi = require('hapi'),
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
				method: 'GET',
				handler: require('./handlers/get')(orm, serializer)
			},
			{
				path: '/schema',
				method: 'GET',
				handler: require('./handlers/schema')(orm)
			}
		];

	server.route(routes);

	return server;
};