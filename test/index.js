var Intaglio = require('intaglio'),
	rest = require('../index');

var mysqlRepository = new Intaglio.repositories.mysql({
		host: "192.168.33.10",
		user: "kumo",
		password: "qN2aUPJRLnN6McY9",
		database: "kumo_db",
		"connectionLimit": 50
	}),
	ORM = Intaglio.ORM;


ORM.create(mysqlRepository).then(function (orm) {
	var server;
	// Decorate the orm
	orm.decorate(rest.decorator);

	server = rest.server(orm, 'localhost', 8080, rest.serializers.hal('http://localhost:8080'));

	server.route({
		method: '*',
		path: '/{path*}',
		handler: {
			directory: {
				path: 'public', listing: false, index: true
			}
		}
	});

	server.start();

	console.info('Ready!');
}, function (err) {
	console.info(err.message);
});