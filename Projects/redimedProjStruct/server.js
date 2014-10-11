var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('config');
var db = require('./models');
//Create application management
var app = express();
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(cookieParser());
// example get from config
app.use(session({ secret: config.get('session.secret') }));
app.use(passport.initialize());
app.use(passport.session());

var clientDir = path.join(__dirname, 'client');

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(clientDir));

//Create sql connection

var mysql = require('mysql');
var connection = require('express-myconnection');
app.use(connection(mysql, config.get('mysql'), 'pool'));

//connect-multiparty FOR UPLOAD
process.env.TMPDIR =path.join(__dirname, 'temp');
var mkdirp = require('mkdirp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//Set request Handler
//-------------------------------------------


//SET URL AND ROUTER

var fs = require('fs');//Read js file for import into
//root
eval(fs.readFileSync('module-config.js')+'');

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    next();

});



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
    .authenticate()
    .complete(function(err) {
        if (err) {
            throw err[0];
        } else {
            var debug = require('debug')('redimedProjStruct');
            var server = app.listen(app.get('port'), function() {
                debug('App server listening on port ' + server.address().port);
            });
            console.log('Connection has been established successfully!');
            console.log('App server listening on port ' + server.address().port);
        }
    }
);

