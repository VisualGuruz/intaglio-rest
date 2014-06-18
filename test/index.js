var Intaglio = require('intaglio'),
	rest = require('../index'),
	Hapi = require('hapi');

var mysqlRepository = new Intaglio.repositories.mysql({
		host: "192.168.33.10",
		user: "kumo",
		password: "qN2aUPJRLnN6McY9",
		database: "kumo_db",
		"connectionLimit": 50
	}),
	ORM = Intaglio.ORM;


ORM.create(mysqlRepository).then(function (orm) {
	var plugin = rest(orm),
		server = Hapi.createServer('localhost', 8080);

	server.pack.register(plugin, function (err) {
		console.error(err);
	});

	orm.extend('deployLocation', {
		preGetHook: function () {
			console.info('GET SHIT');
		},
		postGetHook: function () {
			console.info('GOT SHIT');
		},
		prePostHook: function () {
			console.info('POST SHIT');
		},
		postPostHook: function () {
			console.info('POSTED SHIT');
		},
		prePutHook: function () {
			console.info('PUT SHIT');
		},
		postPutHook: function () {
			console.info('PUTTED SHIT');
		},
		preDeleteHook: function () {
			console.info('DELETE SHIT');
		},
		postDeleteHook: function () {
			console.info('DELETED SHIT');
		}
	});

	server.start();

	console.info('Ready!');
}, function (err) {
	console.info(err.message);
});