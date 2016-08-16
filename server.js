var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan');
// var Sequelize  = require('sequelize');
var config 	   = require('./config');
var path 	   	 = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests ?????
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
/*
var sequelize = new Sequelize(config.database);
sequelize.authenticate().complete(function(err){
	if (err){
		console.log("Database connection error: " + err);
	}
	else{
		console.log("Database connection successful!")
	}
});
*/

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

app.get('/historic', function (req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/historic.html'));
});
app.get('/about', function (req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/about.html'));
});
app.get('/tancaments', function (req, res){
	res.sendFile(path.join(__dirname + '/public/app/views/tancaments.html'));
});
// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Server started on http://localhost:' + config.port);