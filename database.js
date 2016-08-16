var config 	   = require('./config');
var mysql 		 = require('mysql');

console.log(config);

var pool = mysql.createPool({
	connectionLimit : 100, //important
	host     : config.database.host,
	user     : config.database.username,
	password : config.database.password,
	database : config.database.database,
	debug    : false
});

pool.getConnection(function(err,connection){
	if (err) {
		console.log(err);
	 connection.release();
	 res.json({"code" : 100, "status" : "Error in connection database"});
	 return;
	}

	console.log('connected as id ' + connection.threadId);

	pool.on('connection', function (connection) {
		console.log("connection done");
	});

	pool.on('enqueue', function () {
	  console.log('Waiting for available connection slot');
	});

});



module.exports = pool;