var application_root = __dirname,
 express = require('express'),
 mysql = require('mysql'),
 bodyParser = require('body-parser'),
 methodOverride = require('method-override'),
 path = require('path');

var app = express();

//Connect to database
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'sakila'
});

connection.connect();

//Config
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(application_root, "public")));

//Get all users
app.get('/users',function(request,response){
	connection.query('SELECT * FROM users', function (error, rows, fields) { 
		if(error)
		{
			console.log(error);
			response.statusCode = 500;
			response.send({
				result : 'error',
				err : error.code
			});
		}
		response.send({
			result : 'success',
			err : '',
			json: rows,
			length : rows.length
		});
      }); 
});

//Get user by ID
app.get('/users/:id',function(request,response){
	connection.query('SELECT * FROM users WHERE id=?',[request.params.id],function (error,rows,fields){
		if(error)
		{
			console.log(error);
			response.statusCode = 500;
			response.send({
				result : 'error',
				err : error.code
			});
		}
		response.send({
			result : 'success',
			err : '',
			json: rows,
			length : rows.length
		});
      }); 
});

//Insert new user
app.post('/users/insert',function(request,response){
	var username = request.body.user;
	var password = request.body.pass;
	connection.query('INSERT INTO users(user_name,password) VALUES(?,?)',[username,password],function (error,rows,fields){
		if(error)
		{
			console.log(error);
			response.statusCode = 500;
			response.send({
				result : 'error',
				err : error.code
			});
		}
		response.send({
			result : '',
			err : '',
			json: rows,
			length : rows.length
		});
      }); 
});

app.listen(2000);
console.log("Server is listen on port 2000");