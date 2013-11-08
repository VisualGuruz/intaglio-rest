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
				path: '/api/{model}/{id?}',
				method: 'GET',
				handler: require('./handlers/get')(orm, serializer)
			},
			{
				path: '/api/{model}/{id}/{path*}',
				method: 'GET',
				handler: require('./handlers/get')(orm, serializer)
			},
			{
				path: '/api/{model}/{id?}',
				method: 'POST',
				handler: require('./handlers/post')(orm, serializer)
			},
			{
				path: '/api/{model}/{id}/{path*}',
				method: 'POST',
				handler: require('./handlers/post')(orm, serializer)
			},
			{
				path: '/api/{model}/{id?}',
				method: 'PUT',
				handler: require('./handlers/put')(orm, serializer)
			},
			{
				path: '/api/{model}/{id}/{path*}',
				method: 'PUT',
				handler: require('./handlers/put')(orm, serializer)
			},
			{
				path: '/api/{model}/{id?}',
				method: 'DELETE',
				handler: require('./handlers/delete')(orm, serializer)
			},
			{
				path: '/api/{model}/{id}/{path*}',
				method: 'DELETE',
				handler: require('./handlers/delete')(orm, serializer)
			},
			{
				path: '/api/{model}/{id?}',
				method: 'OPTIONS',
				handler: require('./handlers/options')(orm, serializer)
			},
			{
				path: '/api/{model}/{id}/{path*}',
				method: 'OPTIONS',
				handler: require('./handlers/options')(orm, serializer)
			},
			{
				path: '/api',
				method: 'GET',
				handler: require('./handlers/base')(orm, serializer)
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