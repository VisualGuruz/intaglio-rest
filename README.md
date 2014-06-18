intaglio-rest
=============

A RESTful interface built on top of Intaglio

## Example Implementation

```javascript
var Intaglio = require('intaglio'),
    rest = require('intaglio-rest'),
    Hapi = require('hapi');

// Initialize the repository
var mysqlRepository = new Intaglio.repositories.mysql({
        host: "192.168.33.10",
        user: "dba",
        password: "somepass",
        database: "db",
        "connectionLimit": 50
    });

// Initialize the ORM
Intaglio.ORM.create(mysqlRepository).then(function (orm) {
    var plugin = rest(orm),
        server = Hapi.createServer('localhost', 8080);

    // Register the plugin
    server.pack.register(plugin, function (err) {
        console.error(err);
    });

    // Add some custom things to the models
    orm.extend('model', {
        preGetHook: function () {
            console.info('GET STUFF');
        },
        postGetHook: function () {
            console.info('GOT STUFF');
        },
        prePostHook: function () {
            console.info('POST STUFF');
        },
        postPostHook: function () {
            console.info('POSTED STUFF');
        },
        prePutHook: function () {
            console.info('PUT STUFF');
        },
        postPutHook: function () {
            console.info('PUTTED STUFF');
        },
        preDeleteHook: function () {
            console.info('DELETE STUFF');
        },
        postDeleteHook: function () {
            console.info('DELETED STUFF');
        }
    });

    // Start the server
    server.start();
    console.info('Server Ready!');
}).catch( function (err) {
    console.info(err.message);
});
```