/**
 * Created by meditech on 10/14/2014.
 */

var db = require('../models');
var mkdirp = require('mkdirp');
// var fs = require('fs');//Read js file for import into
var fs = require('fs-extra');//Read js file for import into
var kiss=require('./kissUtilsController');
var Archiver = require('Archiver');
var rimraf = require('rimraf');
var rlobUtil=require('./rlobUtilsController');
module.exports =
{
    rlobUploadFile:function(req, res) {
        var userInfo=kiss.checkData(req.cookies.userInfo)?JSON.parse(req.cookies.userInfo):{};
        var userId=kiss.checkData(userInfo.id)?userInfo.id:null;
        var bookingId=kiss.checkData(req.body.booking_id)?req.body.booking_id:'';
        var companyId=kiss.checkData(req.body.company_id)?req.body.company_id:'';
        var workerName=kiss.checkData(req.body.worker_name)?req.body.worker_name:'';
        var isClientDownLoad=kiss.checkData(req.body.isClientDownLoad)?req.body.isClientDownLoad:0;
        if(!kiss.checkListData(userId,bookingId,companyId,workerName,isClientDownLoad))
        {
            kiss.exlog("rlobUploadFile","Loi truyen data den");
            res.json({status:'fail'});
            return;
        }
        var currentTime=kiss.getCurrentTimeStr();
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'redilegal\\'+companyId+"\\"+bookingId+"_"+workerName;
        var targetFolderForSave='redilegal\\'+companyId+"\\"+bookingId+"_"+workerName;
        mkdirp(targetFolder, function(err) 
        {
            if(err)
            {
                kiss.exlog("rlobUploadFile","Loi tao thu muc",err);
                res.json({status:'fail'});
                return;
            }
            else
            {
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
                    if (err) 
                    {
                        kiss.exlog("rlobUploadFile","Loi di chuyen file tu thu muc tam sang target",err);
                        res.json({status:"fail"});
                        return;
                    }
                    else
                    {
                        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                        fs.unlink(tmp_path, function() {
                            if (err) 
                            {
                                kiss.exlog("rlobUploadFile","Loi xoa file tam");
                                res.json({status:'fail'});
                                return;
                            }
                        });
                    }
                });
                kiss.beginTransaction(req,function(){
                    //Insert thong tin file vao database
                    var sql="insert into rl_booking_files set ?";
                    var fileInfo={
                        BOOKING_ID:bookingId,
                        isClientDownLoad:isClientDownLoad,
                        FILE_NAME:req.files.file.name,
                        FILE_PATH:target_path_for_save,
                        CREATED_BY:userId,
                        CREATION_DATE:currentTime
                    }
                    kiss.executeQuery(req,sql,[fileInfo],function(result){
                        fileInfo.FILE_ID=result.insertId;
                        var sql="UPDATE `rl_bookings` booking SET ? WHERE booking.`BOOKING_ID` = ?";
                        var updateInfo={
                            DOCUMENT_STATUS:rlobUtil.documentStatus.checked,
                            Last_updated_by:userId,
                            Last_update_date:currentTime
                        }
                        kiss.executeQuery(req,sql,[updateInfo,bookingId],function(result){
                            kiss.commit(req,function(){
                                res.json({status:"success",fileInfo:fileInfo});
                            },function(err){
                                kiss.exlog("rlobUploadFile","Loi commit",err);
                                res.json({status:'fail'});
                            })
                        },function(err){
                            kiss.exlog("rlobUploadFile","Loi cap nhat document status",err);
                            kiss.rollback(req,function(){
                                res.json({status:'fail'});
                            })
                        });
                    },function(err){
                        kiss.exlog("rlobUploadFile","Loi insert thong tin file",err);
                        kiss.rollback(req,function(){
                            res.json({status:'fail'});
                        })
                    });
                },function(err){
                    kiss.exlog("rlobUploadFile","Khong the mo transaction");
                    res.json({status:'fail'});
                })
                

                // req.getConnection(function(err,connection) {
                //     var key_result=connection.query("SELECT get_pk_value('RlBookingFiles')",function(err,rows){
                //         if(err)
                //         {
                //             res.json({status:'fail'});
                //         }
                //         else
                //         {
                //             var file_id=rows[0]["get_pk_value('RlBookingFiles')"]
                //             var fileInfo={
                //                 FILE_ID:file_id,
                //                 BOOKING_ID:req.body.booking_id,
                //                 isClientDownLoad:req.body.isClientDownLoad,
                //                 FILE_NAME:req.files.file.name,
                //                 FILE_PATH:target_path_for_save
                //             }

                //             req.getConnection(function(err,connection){
                //                 var query=connection.query('insert into rl_booking_files set ?',fileInfo,function(err,result){
                //                     if (err)
                //                     {
                //                         console.log("Error inserting : %s ",err );
                //                         res.json({status:"fail"});
                //                     }
                //                     else
                //                     {
                //                         var sql=
                //                             " UPDATE `rl_booking_files` files                      "+
                //                             " SET files.`isClientDownLoad`=0                       "+
                //                             " WHERE files.`BOOKING_ID`=? AND files.`FILE_ID`<>?    ";
                //                         req.getConnection(function(err,connection){
                //                             var query=connection.query(sql,[fileInfo.BOOKING_ID,file_id],function(err,result){
                //                                 if (err)
                //                                 {
                //                                     res.json({status:"fail"});
                //                                 }
                //                                 else
                //                                 {
                //                                     res.json({status:"success",fileInfo:fileInfo});
                //                                 }

                //                             })
                //                         });
                //                         res.json({status:"success",fileInfo:fileInfo});
                //                     }

                //                 })
                //             });
                //         }
                //     });
                // });
            }
            
        });


    },


    rlobDowloadFile:function(req, res, next){
        req.getConnection(function(err,connection){
            var lob_file_id=req.params.fileId;
            var query=connection.query('select * from rl_booking_files where FILE_ID=?',lob_file_id,function(err,rows){
                if (err)
                {
                    res.json({status:"fail"});
                }
                else
                {
                    var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
                    var path=prefix+rows[0].FILE_PATH;
                    console.log(">>>>>>>>>>>>>downloadFile:"+path);
                    res.download(path,function(err){
                        if(err)
                            res.json({status:'fail',message:'no file exist!'});
                        else
                            res.json({status:'success',message:'download success!'});
                    });
                }
            })
        });
    },

    rlobDownloadListResultFiles:function(req,res)
    {
        var bookingId=kiss.checkData(req.query.bookingId)?req.query.bookingId:'';
        if(!kiss.checkListData(bookingId))
        {
            kiss.exlog("rlobDownloadListResultFiles","Loi data truyen den");
            res.json({status:'fail'});
            return;
        }

        var sql=
            " SELECT files.* ,booking.`WRK_SURNAME`,booking.`CLAIM_NO`                        "+
            " FROM `rl_booking_files` files                                                   "+
            " INNER JOIN `rl_bookings` booking ON files.`BOOKING_ID`=booking.`BOOKING_ID`     "+
            " WHERE files.`isClientDownLoad`=1 AND files.`BOOKING_ID`=?                       ";
        kiss.executeQuery(req,sql,[bookingId],function(rows){
            if(rows.length>0)
            {
                var packName=rows[0].CLAIM_NO+"_"+rows[0].WRK_SURNAME+"_"+rows[0].BOOKING_ID; 
                var tempPath="./temp/"+packName; 
                mkdirp(tempPath, function(err)
                {
                    if(err)
                    {
                        kiss.exlog("rlobDownloadListResultFiles","Khong the tao thu muc download trong thu muc tam");
                        res.json({status:'fail'});
                    }
                    else
                    {
                        var copyResult=function(list,index)
                        {
                            var sourcePath="./"+list[index].FILE_PATH;
                            var filePathToken=list[index].FILE_PATH.split("\\");
                            if(filePathToken.length<=0)
                                filePathToken=list[index].FILE_PATH.split("/");
                            if(filePathToken.length<3)
                            {
                                kiss.exlog("rlobDownloadListResultFiles","duong dan khong dung theo mau quy dinh");
                                res.json({status:'fail'});
                            }
                            else
                            {
                                targetPath=tempPath+"/"+filePathToken[3];
                                fs.copy(sourcePath,targetPath,function(err)
                                {
                                    if(err)
                                    {
                                        kiss.exlog("rlobDownloadListResultFiles","Loi copy file",err);
                                        res.json({status:'fail'});
                                    }
                                    else
                                    {
                                        if(index<list.length-1)
                                        {
                                            copyResult(list,index+1);
                                        }
                                        else
                                        {
                                            downloadZip(tempPath);
                                        }
                                    }
                                    
                                });
                            }
                            
                        }
                        copyResult(rows,0);
                    }
                })   
            }
            else
            {
                kiss.exlog("rlobDownloadListResultFiles","Chua co file nao duoc set la result");
                res.json({status:'fail'});
            }
        },function(err){
            kiss.exlog("rlobDownloadListResultFiles","Loi truy van",err);
            res.json({status:'fail'});
        });

        var downloadZip=function(zipPath)
        {
            kiss.exlog(zipPath);
            var outputPath=zipPath+'.zip';
            var output = fs.createWriteStream(outputPath);
            var archive = Archiver('zip');

            output.on('close', function() 
            {
                console.log('done')
                res.download(outputPath,function(err,data){
                    if (err)
                    {
                        //throw err;
                        console.log('download fail');
                        res.json({status:"fail"});
                    }
                    else
                    {
                        fs.unlink(outputPath, function (err) 
                        {
                            if (err)
                            {
                                //throw err;
                                console.log('fail deleted');
                                res.json({status:"fail"});
                            }
                            else
                            {
                                console.log('successfully deleted');
                                res.json({status:"success"});
                                rimraf(zipPath, function (err) {
                                    if (err)
                                    {
                                        console.log(err);
                                        res.json({status:"fail"});
                                    }
                                    else
                                    {
                                        console.log('successfully deleted');
                                        res.json({status:"success"});
                                    }
                                });
                            }
                        });
                        console.log('download success');
                        res.json({status:"success"});
                    }
                });
            });

            archive.on('error', function(err) { throw err });

            archive.pipe(output);

            archive.bulk([
                { expand: true, cwd: zipPath, src: ['**/*'] }
            ]).finalize();
        }
        
    }

}


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
