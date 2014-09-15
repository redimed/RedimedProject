var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
//var routes = require('./routes/');
var users = require('./routes/users');
var mysql = require('mysql');
var connection = require('express-myconnection');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

var clientDir = path.join(__dirname, 'client');
app.get('/', function(req, res) {
   res.sendfile(path.join(clientDir, 'index.html'))
});


//app.use('/', routes);


app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'sakila'

    },'pool')

);

app.post('/users', users.login);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;


app.set('port', process.env.PORT || 3000);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
