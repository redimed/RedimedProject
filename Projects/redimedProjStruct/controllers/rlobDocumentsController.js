/**
 * Created by meditech on 10/14/2014.
 */

var db = require('../models');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
module.exports =
{
    rlobUploadFile:function(req, resp) {
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'redilegal\\'+req.body.company_id+"\\"+req.body.booking_id+"_"+req.body.worker_name;
        var targetFolderForSave='redilegal\\'+req.body.company_id+"\\"+req.body.booking_id+"_"+req.body.worker_name;
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
            var target_path =targetFolder+ "\\" + req.files.file.name;
            var target_path_for_save=targetFolderForSave+ "\\" + req.files.file.name
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
                            FILE_PATH:target_path_for_save
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


    },


    rlobDowloadFile:function(req, res, next){

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
                    var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                    var path=prefix+rows[0].FILE_PATH;
                    console.log(">>>>>>>>>>>>>downloadFile:"+path);
                    res.download(path);
                }
            })
        });
    }


}


//app.post('/api/rlob/rl_booking_files/upload',multipartMiddleware,  function(req, resp) {
//    var targetFolder='.\\redilegal\\'+req.body.company_id+"\\"+req.body.booking_id+"_"+req.body.worker_name;
//    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+targetFolder);
//    mkdirp(targetFolder, function(err) {
//        // path was created unless there was error
//        //console.log(req.body);
//        //console.log(req.files);
//        // don't forget to delete all req.files when done
//
//        // get the temporary location of the file
//        var tmp_path = req.files.file.path;
//        console.log('temp_path:'+tmp_path);
//        // set where the file should actually exists - in this case it is in the "images" directory
//        var target_path =targetFolder+"\\" + req.files.file.name;
//        console.log('target_path:'+target_path);
//        // move the file from the temporary location to the intended location
//        fs.rename(tmp_path, target_path, function(err) {
//            if (err) throw err;
//            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
//            fs.unlink(tmp_path, function() {
//                if (err) throw err;
//                console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes')
//                //res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
//            });
//        });
//
//        console.log("GGGGGGGGGGGGGGGGGGGGG>>>>:"+req.body.isClientDownLoad);
//        req.getConnection(function(err,connection) {
//            var key_result=connection.query("SELECT get_pk_value('RlBookingFiles')",function(err,rows){
//                if(err)
//                {
//
//                }
//                else
//                {
//                    var file_id=rows[0]["get_pk_value('RlBookingFiles')"]
//                    var fileInfo={
//                        FILE_ID:file_id,
//                        BOOKING_ID:req.body.booking_id,
//                        isClientDownLoad:req.body.isClientDownLoad,
//                        FILE_NAME:req.files.file.name,
//                        FILE_PATH:target_path
//                    }
//
//                    req.getConnection(function(err,connection){
//                        var query=connection.query('insert into rl_booking_files set ?',fileInfo,function(err,rows){
//                            if (err)
//                            {
//                                console.log("Error inserting : %s ",err );
//                                resp.json({status:"fail"});
//                            }
//                            else
//                            {
//                                console.log("success");
//                                resp.json({status:"success",fileInfo:fileInfo});
//                            }
//
//                        })
//                    });
//                }
//            });
//        });
//
//
//    });
//
//
//});



//app.get('/api/download/lob/document/:file(*)', function(req, res, next){
//app.get('/api/download/lob/document/:fileId(*)', function(req, res, next){
//    console.log("VVVVVVVVVVVVVVVVVVVVV:"+req.params.fileId);
//    req.getConnection(function(err,connection){
//        var lob_file_id=req.params.fileId;
//        var query=connection.query('select * from rl_booking_files where FILE_ID=?',lob_file_id,function(err,rows){
//            if (err)
//            {
//                console.log("Error inserting : %s ",err );
//                res.json({status:"fail"});
//            }
//            else
//            {
//                console.log("success");
//                var path=rows[0].FILE_PATH;
//                res.download(path);
//            }
//        })
//    });
//});
