﻿var express = require('express');
var path = require('path');
var fs = require('fs');//Read js file for import into
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var config = require('config');
var oauthserver = require('oauth2-server');
var db = require('./models');


//Create application management
var app = express();
app.set('port', process.env.PORT || 3000);
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
/**
 * K Library
 */
var k_sql = require('./helper/k_sql.js');
var k_route = require('./helper/k_route.js');

//Create sql connection

var mysql = require('mysql');
var connection = require('express-myconnection');
app.use(connection(mysql, config.get('mysql'), 'pool'));

app.oauth = oauthserver({
    model: require('./models'),
    grants: ['auth_code', 'password'],
    debug: true
});

//connect-multiparty FOR UPLOAD
process.env.TMPDIR =path.join(__dirname, 'temp');
var mkdirp = require('mkdirp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//Set request Handler
//-------------------------------------------

app.use(function (req, res, next) {
    //console.log(squel);
    res.locals.k_sql = k_sql(req, res);
    next();
});

//SET URL AND ROUTER


//OAuth2
app.all('/oauth/token', app.oauth.grant());

// Show them the "do you authorise xyz app to access your content?" page
app.get('/oauth/authorise', function (req, res, next) {
    if (!req.session.user) {
        // If they aren't logged in, send them to your own login implementation
        return res.redirect('/login?redirect=' + req.path + '&client_id=' +
        req.query.client_id + '&redirect_uri=' + req.query.redirect_uri);
    }

    res.render('authorise', {
        client_id: req.query.client_id,
        redirect_uri: req.query.redirect_uri
    });
});

// Handle authorise
app.post('/oauth/authorise', function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login?client_id=' + req.query.client_id +
        '&redirect_uri=' + req.query.redirect_uri);
    }

    next();
}, app.oauth.authCodeGrant(function (req, next) {
    // The first param should to indicate an error
    // The second param should a bool to indicate if the user did authorise the app
    // The third param should for the user/uid (only used for passing to saveAuthCode)
    next(null, req.body.allow === 'yes', req.session.user.id, req.session.user);
}));



//root
eval(fs.readFileSync('module-config.js')+'');

app.post('/api/booking/upload',multipartMiddleware, function(req,resp){
    console.log(__dirname);
    var targetFolder='.\\download\\online_booking\\'+'BookingID-'+req.body.Booking_id+"\\"+'CandidateID-'+req.body.Candidate_id;
    console.log('----------------------------------------'+targetFolder);
    mkdirp(targetFolder, function(err) {

        var tmp_path = req.files.file.path;
        console.log('temp_path:'+tmp_path);
        // set where the file should actually exists - in this case it is in the "images" directory
        var target_path =targetFolder+"\\" + req.files.file.name;
        console.log('target_path:'+target_path);
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes')
                //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
            });
        });

        db.BookingCandidate.update({
            resultFileName: req.files.file.name,
            resultFilePath: target_path

        },{Booking_id: req.body.Booking_id, Candidate_id: req.body.Candidate_id})
            .success(function(){
                resp.json({status:"success"});
            })
            .error(function(err){
                resp.json({status:"fail"});
            });
    });
});

app.get('/api/booking/download/:bookingId/:candidateId', function(req, res, next){
    var bookingId = req.params.bookingId;
    var candidateId = req.params.candidateId;

    db.BookingCandidate.find({where:{Booking_id: bookingId, Candidate_id: candidateId}},{raw:true})
        .success(function(data){
            console.log("success");
            var path=data.resultFilePath;
            res.download(path);
        })
        .error(function(err){
            console.log(err);
        })

});

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
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







