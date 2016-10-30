// var settings = require('../settings');
// var Db = require('mongodb').Db;
// var connection = require('mongodb').Connection;
// var Server = require('mongodb').Server;

// module.exports = new Db(settings.db,new Server(settings.host,settings.port),{safe: true});
var settings = require('../settings'),
        Db = require('mongodb').Db,
        Connection = require('mongodb').Connection,
        Server = require('mongodb').Server;
    	module.exports = new Db(settings.db, new Server(settings.host, settings.port),
 {safe: true});

