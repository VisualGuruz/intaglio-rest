var Intaglio = require('intaglio'),
	rest = require('../index');

var mysqlRepository = new Intaglio.repositories.mysql({
		host: "192.168.33.10",
		user: "test",
		password: "",
		database: "test_employees"
	}),
	ORM = Intaglio.ORM;


ORM.create(mysqlRepository, rest.wrapper).then(function (orm) {
	var server = rest.server(orm, 'localhost', 8000, rest.serializers.hal('http://localhost:8000'));

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