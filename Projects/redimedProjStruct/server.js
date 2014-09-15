var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var config = require('config');
var db = require('./models');
//Create application management
var app = express();
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
// example get from config
app.use(session({ secret: config.get('session.secret') }));
app.use(passport.initialize());
app.use(passport.session());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client')));

//Create sql connection

var mysql = require('mysql');
var connection = require('express-myconnection');
app.use(connection(mysql, config.get('mysql'), 'pool'));


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

db.sequelize
    // sync để tự động tạo các bảng trong database
    //.sync({ force: true })
    .complete(function(err) {
        if (err) {
            throw err[0];
        } else {
            var debug = require('debug')('redimedProjStruct');
            var server = app.listen(app.get('port'), function() {
                debug('App server listening on port ' + server.address().port);
            });
        }
    }
);