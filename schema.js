var pg = require('pg').native
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();

var zodiac = [
	{ name: "Aries", info: "March 21 - April 19: Enthusiastic & Outgoing.\nElement: Fire.\nThis is the very first zodiac sign. The glyph of Aries is a Ram where its symbol appeared first in Acient Egypt. Aries personalities are enthusiastic and sociable in nature."},
	{ name: "Taurus", info: "April 20 - May 20: Determined & Sensual.\nElement: Earth.\nThis is the second zodiac sign. The glyph of Taurus is a Bull where it symbolizes love and peace. Taurus' are dedicated, patient and practical."},
	{ name: "Gemini", info: "May 21 - June 20: Intense & Explorative.\nElement: Air.\nThis is the third zodiac sign. The glyph of Gemini is twins Pollux and Castor, heroic brothers in Greek mythology. Gemini symbolizes intelligence, innocence and a generably sociable."},
	{ name: "Cancer", info: "June 21 - July 22: Compassionate & Contradictory.\nElement: Water.\nThis is the fourth zodiac sign. The glyph of Cancer is a crab. People associated with cancer are highly emotional and enjoy their personal space."},
	{ name: "Leo", info: "July 23 - August 22: Radiant & Leader.\nElement: Fire.\nThis is the fifth zodiac sign. The glyph of Leo is a lion, the king of the jungle. Leo personalities are born leaders."},
	{ name: "Virgo", info: "August 23 - September 22: Caring & Confident.\nElement: Earth.\nThis is the sixth zodiac sign. The glyph of Virgo is a virgin, a symbol of justice and purity. They are caring and very meticulous in whatever they do."},
	{ name: "Libra", info: "September 23 - October 22: Charming & Harmonious.\nElement: Air.\nThis is the seventh zodiac sign. The glyph of Libra is balance scales. Librans are romantic and generous people. They will never comprise anyone even if they disklike them."},
	{ name: "Scorpio", info: "October 23 - November 21: Resilient & Powerful.\nElement: Water.\nThis is the eighth zodiac sign. The glyph of Scorpio is a scorpion. Scorpios like to be in control of themselves and others, they symbolize power and fertility."},
	{ name: "Sagittarius", info: "November 22 - December 21: Optimistic & Honest.\nElement: Fire.\nThis is the ninth zodiac sign. The glyph of Sagittarius is a Centaur, half man, half horse equipped with a bown and arrow. They are honest people and represent wisdom as well as intellect."},
	{ name: "Capricorn", info: "December 22 - January 19: Resilient & Patient.\nElement: Earth.\nThis is the tenth zodiac sign. The glyph of Capricorn is a mystical creature, half goat, half fish derived from Greek mythology. People under this sign are workaholics but are also patient and sensitive."},
	{ name: "Aquarius", info: "January 20 - February 18: Trendsetters & Humanitarian.\nElement: Air.\nThis is the eleventh zodiac sign. The glyph of Aquarius is a young boy pouring water. Aquarians are humanitarian by nature but are also independent people."},
	{ name: "Pisces", info: "February 19 - March 20: Sensitive & Mysterious.\nElement: Water.\nThis is the twelfth and final zodiac sign. The glyph of Pisces is two fish facing opposite directions. People of this sign are creative but extremely sensitive and emotional."}
];

var password = require('password-hash-and-salt');

create_users_table ();
create_login_table();

query = client.query('DROP TABLE IF EXISTS zodiac; CREATE TABLE zodiac (id serial PRIMARY KEY, name varchar(80) UNIQUE NOT NULL, info varchar(800) NOT NULL)');

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
	var queryString = ("Drop table if exists users cascade; create table users (id serial primary key, name varchar(80) NOT NULL,username varchar(80) UNIQUE NOT NULL)");
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