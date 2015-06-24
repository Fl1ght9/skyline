// use the express middleware
var express = require('express');
var password = require('password-hash-and-salt');
var authen = require('./authentication.js');


var pg = require('pg').native
	, connectionString = process.env.DATABASE_URL
	, start = new Date()
	, port = process.env.PORT
	, client
	, query;
client = new pg.Client(connectionString);
client.connect();

// make express handle JSON and other requests
var bodyParser = require('body-parser');

// use cross origin resource sharing
var cors = require('cors');

// instantiate app
var app = express();

// make sure we can parse JSON passed in the body or encoded into url
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// serve up files from this directory 
app.use(express.static(__dirname));
// make sure we use CORS to avoid cross domain problems
app.use(cors());

app.get('/', function(req, res){
	res.sendfile('index.html');
});

//Get zodiac information from database
app.get('/zodiac/:id', function(req, res){
	query = client.query('SELECT name, info FROM zodiac WHERE id = $1', [req.params.id]);
	query.on('row', function(result){
		res.send(result);
	});
	 //perform check on end
  	query.on('end', function(result){
    if(result.rowCount === 0){
      res.statusCode = 400;
      res.send('ERROR 400: no data found');
    }
  });
});

//Login function on post
app.post('/login', function(req, res){
	console.log(req.body);
	if(!req.body.hasOwnProperty('user') || !req.body.hasOwnProperty('password')){
		res.statusCode = 400;
	return res.send('Error 400: Post syntax incorrect.')
}

//User verification
// var existingUser = client.query('SELECT COUNT(*) as count FROM logins WHERE username = $1', [req.body.user]);
// existingUser.on('end', function(result){
// 	if(result.rows[0].count > 0){
// 		res.statusCode = 409;
// 		return res.send('Error 400: Username already exists');
// 	}
// });

//login credentials, encrypted pw
query = client.query('SELECT * FROM logins WHERE username = $1', [req.body.user]);
console.log(req.body.user);
query.on('row', function(result){
	//hash verification
	password(req.body.password).verifyAgainst(result.password, function(error, verified) {
	console.log('in row');
	//error checking
	if(error)
	throw new Error('Something went wrong! ->' + error);
	//if wrong pw
	if(!verified) {
		res.statusCode = 401;
		res.send('Error 401: wrong user or password');
	} 
	//else pw is correct
	else {
		//confirmation token added
		console.log('adding token');
		res.send(authen.addToken(result));
	}
});
});

//username validation, part of error checking
query.on('end', function(result){
	console.log(result);
	if(result.rowCount === 0){
		// res.statusCode = 401;
		console.log('inside end 0 rowCount');
		res.send('Error 401: wrong username or password');
	}
});
});

//On post using login, perform logout afterwards
app.post('/logout',authen.removeToken);

// use PORT set as an environment variable
var server = app.listen(50000, function() {
	console.log('Listening on port %d', server.address().port);
});