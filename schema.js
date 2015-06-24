var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();

var zodiac [
	{ name: "Aries", info: "March 21 - April 19: Enthusiastic & Outgoing."},
	{ name: "Taurus", info: "April 20 - May 20: Determined & Sensual."},
	{ name: "Gemini", info: "May 21 - June 20: Intense & Explorative."},
	{ name: "Cancer", info: "June 21 - July 22: Compassionate & Contradictory."},
	{ name: "Leo", info: "July 23 - August 22: Radiant & Leader."},
	{ name: "Virgo", info: "August 23 - September 22: Caring & Confident."},
	{ name: "Libra", info: "September 23 - October 22: Charming & Harmonious"},
	{ name: "Scorpio", info: "October 23 - November 21: Resilient & Powerful"},
	{ name: "Sagittarius", info: "November 22 - December 21: Optimistic & Honest"},
	{ name: "Capricorn", info: "December 22 - January 19: Resilient & Patient"},
	{ name: "Aquarius", info: "January 20 - February 18: Trendsetters & Humanitarian"},
	{ name: "Pisces", info: "February 19 - March 20: Sensitive & Mysterious"}
}];

var password = require('password-hash-and-salt');

create_users_table ();
create_login_table();

var zodiacQuery = client.query('DROP TABLE IF EXISTS zodiac');
var starQuery = client.query('DROP TABLE IF EXISTS star');

//Loading in zodiacs into database with reference to name and info
for(var i = 0; i < zodiac.length; i++){
	query = client.query('INSERT INTO zodiac(name, info) VALUES ($1, $2)', [zodiac[i].name, zodiac[i].info]);
	query.on('end', function(result){
		console.log('inserted');
	});
	query.on('error', function(error){
		throw new Error('Insert failed on:' + i);
	});
}

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
		query = client.query('Insert into logins(username, password) values($1, $2)', ['mark', hash]);
		query.on('error', function(error){
			throw new Error('failed on inserting first val ->' + error);
		});
	});
}