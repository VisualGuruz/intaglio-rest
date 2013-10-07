var Intaglio = require('intaglio'),
	rest = require('../index');

var mysqlRepository = new Intaglio.repositories.mysql({
		host: "192.168.33.10",
		user: "test",
		password: "",
		database: "test_orm"
	}),
	ORM = Intaglio.ORM;

ORM.create(mysqlRepository, rest.wrapper).then(function (orm) {
	rest.server(orm, 'localhost', 8000, rest.serializers.hal('http://localhost:8000')).start();
	console.info('Ready!');
});