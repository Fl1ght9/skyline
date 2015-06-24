var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();

var password = require('password-hash-and-salt');

create_users_table ();
create_login_table();

var constellationQuery = client.query('DROP TABLE IF EXISTS constellation');
var starQuery = client.query('DROP TABLE IF EXISTS star');

// query = client.query('CREATE TABLE visits (date date)');
// query.on('end', function(result) { client.end(); });

//Creates users table
function create_users_table () {
	var queryString = ("Drop table if exists users cascade; create table users (id serial primary key, name varchar(80) NOT NULL,username varchar(80) UNIQUE NOT NULL");
	query = client.query(queryString);
	//if successfull
	query.on('end', function(result){
		console.log('Created Table users ' + result);
	});
	//error checking
	query.on('error', function(error){
		throw new Error('user table not created-> ' + error);
	});

	queryString.on
}

//Creates the user login table
function create_login_table(){
	//table for login query
	query = client.query('Drop table if exists logins; CREATE TABLE logins (id serial PRIMARY KEY, username varchar(80) UNIQUE NOT NULL, password varchar(500) NOT NULL)');
	//if table creation is successful
	query.on('end', function(result){
		console.log('Created Table login succesfully');
	});
	//error checking
	query.on('error', function(error){
	throw new Error('Table not created -> ' + error);
	});

	password('password1').hash(function(error, hash) {
		if(error){
			throw new Error('Something went wrong!');
		}
		console.log('in password1');
		// Store hash (incl. algorithm, iterations, and salt)
		query = client.query('Insert into logins(username, password) values($1, $2)', ['sam', hash]);
		query.on('error', function(error){
			throw new Error('failed on inserting first val ->' + error);
		});
	});
}