﻿var express = require('express');
var path = require('path');
var fs = require('fs');//Read js file for import into
var favicon = require('static-favicon');
var logger = require('morgan');
var log = require('./log')(module);
var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');
var config = require('config');
var compress = require('compression');
var db = require('./models');
var restful = require('sequelize-restful');
var useragent = require('express-useragent');
var forceSSL = require('express-force-ssl');
var _ = require('lodash-node');


var ssl_options = {
    key: fs.readFileSync('key/key.pem'),
    cert: fs.readFileSync('key/cert.pem'),
    requestCert: true,
    rejectUnauthorized: false
};
var app = express();

var server = require('https').createServer(ssl_options,app);

var io = require('socket.io')(server);


require('./socket')(io,cookie,cookieParser);

var myIceServers = [
    {url: "stun:stun.l.google.com:19302"},
    {url: "stun:stun1.l.google.com:19302"},
    {url: "stun:stun2.l.google.com:19302"},
    {url: "stun:stun3.l.google.com:19302"},
    {url: "stun:stun4.l.google.com:19302"},
    {url: "turn:172.17.19.101:3478", "username":"redimed", "credential":"redimed123"}
];

var clientDir = path.join(__dirname, 'client');
var uploadedFile = path.join(__dirname, 'uploadFile/PatientPicture/');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(useragent.express());
app.use(restful(db.sequelize, { endpoint: '/api/restful'}));
app.use(favicon());
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(forceSSL);
app.use(methodOverride());
app.use(cookieParser('secret'));
app.use(session({
    name: 'express.sid',
    secret: config.get('session.secret'),
    saveUninitialized: true,
    resave: true,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(clientDir));
app.get('/',function(req, res) {
    res.sendfile(path.join(clientDir, 'login.html'))
});

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/img/patient/avt', express.static(uploadedFile));
/**
 * K Library
 */
var k_sql = require('./helper/k_sql.js');
var k_route = require('./helper/k_route.js');

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

app.use(function (req, res, next) {
	req.k_sql = k_sql(req, res);
	req.k_sql.isLog = 1;
    res.locals.k_sql = req.k_sql;
    next();
});
//SET URL AND ROUTER


//root
eval(fs.readFileSync('module-config.js')+'');

app.post('/api/booking/upload',multipartMiddleware, function(req,resp){

    var targetFolder='.\\download\\online_booking\\'+'BookingID-'+req.body.Booking_id+"\\"+'CandidateID-'+req.body.Candidate_id;
    mkdirp(targetFolder, function(err) {

        var tmp_path = req.files.file.path;
        var target_path =targetFolder+"\\" + req.files.file.name;
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            fs.unlink(tmp_path, function() {
                if (err) throw err;
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

/// error handlers
app.use(function(req, res, next) {
    res.status(404);
    log.debug('NOT FOUND URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('INTERNAL ERROR (%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

db.sequelize
    .authenticate()
    .complete(function(err) {
        if (err) {
            throw err[0];
        } else {
            server.listen(3000);
            log.info('Connection has been established successfully!');
            log.info('App server listening on port ' + server.address().port);
        }
    }
);

module.exports = app;

