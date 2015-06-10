/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */
var db = require('../models');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var db = require('../models');
var mkdirp = require('mkdirp');
var fs = require('fs');//Read js file for import into
module.exports =
{
    insertNonEmergency:function(req,res){
        // console.log('giapppppppppppppppppppppppp',req.body.info);
        // return
        var FIRSTNAME=kiss.checkData(req.body.info.FIRSTNAME)?req.body.info.FIRSTNAME:null;
        var LASTNAME=kiss.checkData(req.body.info.LASTNAME)?req.body.info.LASTNAME:null;
        var GENDER=kiss.checkData(req.body.info.GENDER)?req.body.info.GENDER:null;
        var DOB=kiss.checkData(req.body.info.DOB)?req.body.info.DOB:null;
        var CONTACT_NO=kiss.checkData(req.body.info.CONTACT_NO)?req.body.info.CONTACT_NO:null;
        var MEDICARE_NO=kiss.checkData(req.body.info.MEDICARE_NO)?req.body.info.MEDICARE_NO:null;
        var MEDICARE_REF=kiss.checkData(req.body.info.MEDICARE_REF)?req.body.info.MEDICARE_REF:null;
        var TYPE_NAME=kiss.checkData(req.body.info.TYPE_NAME)?req.body.info.TYPE_NAME:null;
        var INJURY=kiss.checkData(req.body.info.INJURY)?req.body.info.INJURY:null;
        var LONGITUDE=kiss.checkData(req.body.info.LONGITUDE)?req.body.info.LONGITUDE:null;
        var LATITUDE=kiss.checkData(req.body.info.LATITUDE)?req.body.info.LATITUDE:null;
        var CAL_ID=kiss.checkData(req.body.info.CAL_ID)?req.body.info.CAL_ID:null;
        var BookingType=kiss.checkData(req.body.info.BookingType)?req.body.info.BookingType:null;
        var EMAIL=kiss.checkData(req.body.info.EMAIL)?req.body.info.EMAIL:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!kiss.checkListData(FIRSTNAME,LASTNAME,GENDER,DOB,CONTACT_NO,INJURY,TYPE_NAME,CAL_ID,BookingType,EMAIL))
        {
            kiss.exlog('insertNonEmergency',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var insertRow={
            FIRSTNAME:FIRSTNAME,
            LASTNAME:LASTNAME,
            GENDER:GENDER,
            DOB:moment(DOB).format("YYYY/MM/DD HH:mm:ss"),
            CONTACT_NO:CONTACT_NO,
            MEDICARE_NO:MEDICARE_NO,
            MEDICARE_REF:MEDICARE_REF,
            TYPE_NAME:TYPE_NAME,
            INJURY:INJURY,
            CAL_ID:CAL_ID,
            email:EMAIL,
            BookingType:BookingType,
            CREATION_DATE:currentDate
        }

        var sql="INSERT INTO `waf_sponsor1` SET ?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[insertRow],function(err,result)
            {
                if(err)
                {
                    kiss.exlog("insertNonEmergency",err);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success'});    
                    kiss.exlog("insertNonEmergency",'thanh cong');
                }
            });
        });
    },insertEmergency:function(req,res){
        // console.log('giappppppppppppppp',req.body.info);
        // return
        // console.log()
        var FIRSTNAME=kiss.checkData(req.body.info.FIRSTNAME)?req.body.info.FIRSTNAME:null;
        var LASTNAME=kiss.checkData(req.body.info.LASTNAME)?req.body.info.LASTNAME:null;
        var GENDER=kiss.checkData(req.body.info.GENDER)?req.body.info.GENDER:null;
        var DOB=kiss.checkData(req.body.info.DOB)?req.body.info.DOB:null;
        var ADD=kiss.checkData(req.body.info.ADD)?req.body.info.ADD:null;
        var CONTACT_NO=kiss.checkData(req.body.info.CONTACT_NO)?req.body.info.CONTACT_NO:null;
        var MEDICARE_NO=kiss.checkData(req.body.info.MEDICARE_NO)?req.body.info.MEDICARE_NO:null;
        var MEDICARE_REF=kiss.checkData(req.body.info.MEDICARE_REF)?req.body.info.MEDICARE_REF:null;
        var TYPE_NAME=kiss.checkData(req.body.info.TYPE_NAME)?req.body.info.TYPE_NAME:null;
        var INJURY=kiss.checkData(req.body.info.INJURY)?req.body.info.INJURY:null;
        var LONGITUDE=kiss.checkData(req.body.info.LONGITUDE)?req.body.info.LONGITUDE:null;
        var LATITUDE=kiss.checkData(req.body.info.LATITUDE)?req.body.info.LATITUDE:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var EMAIL=kiss.checkData(req.body.info.EMAIL)?req.body.info.EMAIL:null;
        var REMEMBER_PATIENTS=kiss.checkData(req.body.info.REMEMBER_PATIENTS)?req.body.info.REMEMBER_PATIENTS:0;
        var RECEIVE_REDIMED=kiss.checkData(req.body.info.RECEIVE_REDIMED)?req.body.info.RECEIVE_REDIMED:0;

        if(!kiss.checkListData(FIRSTNAME,LASTNAME,GENDER,DOB,CONTACT_NO,TYPE_NAME,INJURY,EMAIL))
        {
            kiss.exlog('insertEmergency',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var insertRow={
            FIRSTNAME:FIRSTNAME,
            LASTNAME:LASTNAME,
            GENDER:GENDER,
            DOB:moment(DOB).format("YYYY/MM/DD HH:mm:ss"),
            ADD:ADD,
            CONTACT_NO:CONTACT_NO,
            MEDICARE_NO:MEDICARE_NO,
            MEDICARE_REF:MEDICARE_REF,
            TYPE_NAME:TYPE_NAME,
            INJURY:INJURY,
            LONGITUDE:LONGITUDE,
            LATITUDE:LATITUDE,
            email:EMAIL,
            remember_patients:REMEMBER_PATIENTS,
            receive_redimed:RECEIVE_REDIMED,
            CREATION_DATE:currentDate
        }
        // console.log(insertRow);
        var sql="INSERT INTO `waf_sponsor1` SET ?";
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[insertRow],function(err,result)
            {
                if(err)
                {
                    kiss.exlog("insertNonEmergency",err);
                    res.json({status:'fail'});
                }
                else
                {
                    res.json({status:'success',data:result.insertId});    
                    kiss.exlog("insertEmergency",'thanh cong');
                    console.log(">>>>>>>>>>>>>>>>>>",result);
                }
            });
        });
    },
    uploadFile:function(req,resq){
        console.log('uploadFile ::'+JSON.stringify(req.body));
        // resq.json({status:"success"});
        // return;
        //     //console.log(req.body);
        console.log(req.files);
        var prefix=__dirname.substring(0,__dirname.indexOf('controllers'));
        var targetFolder=prefix+'redilegal\\sponsor\\'+req.body.sponsor_id;
        var targetFolderForSave='redilegal\\sponsor\\'+req.body.sponsor_id;
        console.log("targetFolder"+targetFolder);
        console.log("targetFolderForSave"+targetFolderForSave);
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
            console.log('target_path_for_save:'+target_path_for_save);
            // move the file from the temporary location to the intended location
            fs.rename(tmp_path, target_path, function(err) {
                if (err) throw err;
                // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
                fs.unlink(tmp_path, function() {
                    if (err) throw err;
                    console.log('File uploaded to: ' + target_path + ' - ' + req.files.file.size + ' bytes')
                    // resq.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
                });
            });
            var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
            var fileInfo={
                ID_SPONSOR:req.body.sponsor_id,
                URL:target_path_for_save,
                CREATION_DATE:currentDate
            }
            req.getConnection(function(err,connection){
                var query=connection.query('insert into waf_images set ?',fileInfo,function(err,result){
                    if (err)
                    {
                        console.log("Error inserting : %s ",err );
                        resq.json({status:"fail"});
                    }
                    else
                    {
                        resq.json({status:"success"});
                        console.log("insert into waf_images"+result);
                    }

                })
            });
        });


    }
}
