var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//Implement Router
var routes = require('./routes/index');
var users = require('./routes/users');

//Create application management
var app = express();
app.set('port', process.env.PORT || 4300);
var clientDir = path.join(__dirname, 'client');

// view engine setup
/*NvTan Comment
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(clientDir));

//Create sql connection
var connection  = require('express-myconnection');
var mysql = require('mysql');
app.use(
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : 'root',
        port : 3306, //port mysql
        database:'nodejs'
    },'pool')
);


//Set request Handler
//-------------------------------------------

//SET URL AND ROUTER

var fs = require('fs');//Read js file for import into
//root
eval(fs.readFileSync('module-config.js')+'');


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//module.exports = app;

var debug = require('debug')('redimedProjStruct');
var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
});


