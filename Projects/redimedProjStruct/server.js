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




app.post('/api/rlob/rl_booking_files/upload',multipartMiddleware,  function(req, resp) {
    var targetFolder='.\\redilegal\\'+req.body.company_id+"\\"+req.body.booking_id+"_"+req.body.worker_name;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+targetFolder);
    mkdirp(targetFolder, function(err) {
        // path was created unless there was error
        //console.log(req.body);
        //console.log(req.files);
        // don't forget to delete all req.files when done

        // get the temporary location of the file
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

        console.log("GGGGGGGGGGGGGGGGGGGGG>>>>:"+req.body.isClientDownLoad);
        req.getConnection(function(err,connection) {
            var key_result=connection.query("SELECT get_pk_value('RlBookingFiles')",function(err,rows){
                if(err)
                {

                }
                else
                {
                    var file_id=rows[0]["get_pk_value('RlBookingFiles')"]
                    var fileInfo={
                        FILE_ID:file_id,
                        BOOKING_ID:req.body.booking_id,
                        isClientDownLoad:req.body.isClientDownLoad,
                        FILE_NAME:req.files.file.name,
                        FILE_PATH:target_path
                    }

                    req.getConnection(function(err,connection){
                        var query=connection.query('insert into rl_booking_files set ?',fileInfo,function(err,rows){
                            if (err)
                            {
                                console.log("Error inserting : %s ",err );
                                resp.json({status:"fail"});
                            }
                            else
                            {
                                console.log("success");
                                resp.json({status:"success",fileInfo:fileInfo});
                            }

                        })
                    });
                }
            });
        });


    });


});

//app.get('/api/download/lob/document/:file(*)', function(req, res, next){
app.get('/api/download/lob/document/:fileId(*)', function(req, res, next){
    console.log("VVVVVVVVVVVVVVVVVVVVV:"+req.params.fileId);
    req.getConnection(function(err,connection){
        var lob_file_id=req.params.fileId;
        var query=connection.query('select * from rl_booking_files where FILE_ID=?',lob_file_id,function(err,rows){
            if (err)
            {
                console.log("Error inserting : %s ",err );
                res.json({status:"fail"});
            }
            else
            {
                console.log("success");
                var path=rows[0].FILE_PATH;
                res.download(path);
            }

        })
    });
});
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







