// **Server.js:**
// **Description: Main file for configuring and running server instance on specific host and port.**
// **Usage: Redirect to server.js folder. Open command-line and enter 'node server.js' and server will run.**

// **Some common method of NodeJS:**
// **require(module name or file name): call specific module or file for using
// **module.exports: exports function, variable or object for global use

// **Import all required modules or files**
var express = require('express'); //**ExpressJS: NodeJS Web Application Framework**
var path = require('path'); //**path: Utilities for handling and transforming file paths**
var fs = require('fs'); //**fs: Handle file system**
var favicon = require('static-favicon');
var logger = require('morgan'); //**morgan: HTTP request logger middleware **
var log = require('./log')(module);
var cookie = require('cookie'); //**cookie: Cookie parsing and serialization**
var cookieParser = require('cookie-parser'); //**cookie-parser: Cookie parsing with signatures**
var bodyParser = require('body-parser'); //**body-parser: Node.js body parsing middleware**
var methodOverride = require('method-override'); //**method-override: Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.**
var passport = require('passport'); //**passport: Passport is Express-compatible authentication middleware for Node.js.**
var session = require('express-session'); //**express-session: Simple session middleware for Express**
var config = require('config'); //**Include config.js file into this.**
var compress = require('compression'); //**compression: Node.js compression middleware (deflate, gzip)**
var db = require('./models'); //**Include models folder into this.**
var restful = require('sequelize-restful'); //**sequelize-restful: A connect module based on a fork of sequelize-restful that adds a one level of associative capability to a restful API.**
var useragent = require('express-useragent'); //**express-useragent: This is a simple NodeJS/ExpressJS user-agent middleware exposing user-agent details to your application and views.**
var _ = require('lodash-node'); //**lodash-node: Lodash module bundles for Node.js
var http = require('http'); //**NodeJS API to support many features of the protocol which have been traditionally difficult to use.**
var https = require('https'); 
var mysql = require('mysql'); //**mysql: A node.js driver for mysql.**
var connection = require('express-myconnection');
var k_sql = require('./helper/k_sql.js'); //**Include k_sql.js file into this.**
var k_route = require('./helper/k_route.js'); //**Include k_route.js file into this.**
var mkdirp = require('mkdirp'); //**mkdirp: Create a new directory and any necessary subdirectories at dir.**
var multipart = require('connect-multiparty'); //**connect-multiparty: Multipart parsing middleware for connect using multiparty.**
var multipartMiddleware = multipart(); //**Create new multipart instance**
var flash = require('connect-flash'); //**connect-flash: Flash messages

// **Start declare TEMP directory**
process.env.TMPDIR =path.join(__dirname, 'temp'); 
process.env.TEMP =path.join(__dirname, 'temp');
process.env.TMP =path.join(__dirname, 'temp');
// **End declare TEMP directory**

//==========Start configuring for server===============
var ssl_options = {
    pfx: fs.readFileSync('key/star_redimed_com_au.pfx'),
    passphrase: '1234'
}; //**SSL file and passphrase use for server
var app = express(); //**Create new ExpressJS instance for HTTPS.
var httpApp = express(); //**Create new ExpressJS instance for HTTP.
var httpsServer = https.createServer(ssl_options,app); //**Create server for HTTPS
var httpServer = http.Server(httpApp);

var io = require('socket.io')(httpsServer,{
    'transports':  ['websocket', 
                  'flashsocket', 
                  'htmlfile', 
                  'xhr-polling', 
                  'jsonp-polling', 
                  'polling']
}); //**socket.io: Socket.IO enables real-time bidirectional event-based communication.
require('./socket')(io,cookie,cookieParser); //**Incluce socket.js file with params

var clientDir = path.join(__dirname, 'client'); //**Declare variable for client directory
var uploadedFile = path.join(__dirname, 'uploadFile/PatientPicture/'); //**Declare variable for upload directory
var documentImage = path.join(__dirname, 'download/documentImage/'); //**Declare variable for document image directory

httpApp.set('port', process.env.PORT || 3000); //**Set listening port for httpApp
//**Redirect http to https
httpApp.get("*", function (req, res, next) {
    res.redirect("https://" + req.headers.host + req.path);
}); 
app.set('port', process.env.PORT || 3000); //**Set listening port for app.
app.enable('trust proxy'); //**Enable 'trust proxy' option for Express
app.use(useragent.express()); //**Use useragent middleware for Express
app.use(restful(db.sequelize, { endpoint: '/api/restful'})); //**Use sequelize-restful middleware for Express
app.use(favicon());
app.use(compress()); //**Use compression middleware for Express
app.use(logger('dev')); //**Use morgan middleware for Express
app.use(bodyParser.json({limit: '100mb'})); //**Config body-parser middleware for Express
app.use(bodyParser.urlencoded({limit: '100mb', extended: true})); //**Config body-parser middleware for Express
app.use(methodOverride()); //**Use method-override middleware for Express
app.use(cookieParser()); //**Config cookie-parser middleware for Express
//**Config session for Express
app.use(session({
    name: 'express.sid', 
    secret: 'v3Tt79M91x8sJ63K',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize()); //**Config passport middleware for Express
app.use(passport.session()); //**Config passport middleware for Express
app.use(express.static(clientDir)); 
app.get('/',function(req, res) {
    res.sendfile(path.join(clientDir, 'login.html'))
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img/patient/avt', express.static(uploadedFile));
app.use('/document/fa/images', express.static(documentImage));
app.use(connection(mysql, config.get('mysql'), 'pool')); //**Config mysql middleware

app.use(function (req, res, next) {
	req.k_sql = k_sql(req, res);
	req.k_sql.isLog = 1;
    res.locals.k_sql = req.k_sql;
    next();
});
//=====================End configure for server==================

eval(fs.readFileSync('module-config.js')+''); //**Read all file module-config.js synchronously

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

//**Config request header
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
    next();

});

//**404 Error Handlers
app.use(function(req, res, next) {
    res.status(404);
    log.debug('NOT FOUND URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

//**500 Error Handlers
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('INTERNAL ERROR (%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

//**================Run Server Instance================
db.sequelize
    .authenticate()
    .complete(function(err) {
        if (err) {
            throw err[0];
        } else {
            // httpServer.listen(httpApp.get('port'), function() {
            //     console.log('Express HTTP server listening on port ' + httpApp.get('port'));
            // });
             
            httpsServer.listen(app.get('port'), function() {
                console.log('Express HTTPS server listening on port ' + app.get('port'));
            });
            log.info('Connection has been established successfully!');
        }
    }
);

module.exports = app;

