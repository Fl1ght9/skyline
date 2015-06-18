// use the express middleware
var express = require('express');
var password = require('password-hash-and-salt');


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

//Login function on post
app.post('/login', function(req, res){
	console.log(req.body);
	if(!req.body.hasOwnProperty('user') || !req.body.hasOwnProperty('password')){
		res.statusCode = 400;
	return res.send('Error 400: Post syntax incorrect.')
}

//login credentials, encrypted pw
query = client.query('SELECT * from logins where username = $1', [req.body.user]);
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
		res.send(auth.addToken(result));
	}
});
});

//username validation, part of error checking
query.on('end', function(result){
	console.log(result);
	if(result.rowCount === 0){
		res.statusCode = 401;
		console.log('inside end 0 rowCount');
		res.send('Error 401: wrong username or password');
	}
});
});

// use PORT set as an environment variable
var server = app.listen(50000, function() {
	console.log('Listening on port %d', server.address().port);
});