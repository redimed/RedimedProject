/**
 * Created by tannv.dts@gmail.com on 9/26/2014.
 */
var db = require('../models');
var rlobUtil=require('./rlobUtilsController');
var kiss=require('./kissUtilsController');
var moment=require('moment');
var db = require('../models');
var mkdirp = require('mkdirp');
var rlobEmailController=require('./rlobEmailController');
var fs = require('fs');//Read js file for import into
module.exports =
{
    insertNonEmergency:function(req,res){
        // console.log('zooooooooooooooooooooo',req.body.info);
        // return
        var FIRSTNAME=kiss.checkData(req.body.info.FIRSTNAME)?req.body.info.FIRSTNAME:null;
        var LASTNAME=kiss.checkData(req.body.info.LASTNAME)?req.body.info.LASTNAME:null;
        var GENDER=kiss.checkData(req.body.info.GENDER)?req.body.info.GENDER:null;
        var DOB=kiss.checkData(req.body.info.DOB)?req.body.info.DOB:null;
        var CONTACT_NO=kiss.checkData(req.body.info.CONTACT_NO)?req.body.info.CONTACT_NO:null;
        var MEDICARE_NO=kiss.checkData(req.body.info.MEDICARE_NO)?req.body.info.MEDICARE_NO:null;
        var MEDICARE_REF=kiss.checkData(req.body.info.MEDICARE_REF)?req.body.info.MEDICARE_REF:null;
        var INJURY=kiss.checkData(req.body.info.INJURY)?req.body.info.INJURY:null;
        var LONGITUDE=kiss.checkData(req.body.info.LONGITUDE)?req.body.info.LONGITUDE:null;
        var LATITUDE=kiss.checkData(req.body.info.LATITUDE)?req.body.info.LATITUDE:null;
        var CAL_ID=kiss.checkData(req.body.info.CAL_ID)?req.body.info.CAL_ID:null;
        var BookingType=kiss.checkData(req.body.info.BookingType)?req.body.info.BookingType:null;
        var EMAIL=kiss.checkData(req.body.info.EMAIL)?req.body.info.EMAIL:null;
        var DOCTOR=kiss.checkData(req.body.info.DOCTOR)?req.body.info.DOCTOR:null;
        var DATE=kiss.checkData(req.body.info.DATE)?req.body.info.DATE:null;
        var LOCATION=kiss.checkData(req.body.info.LOCATION)?req.body.info.LOCATION:null;
        var TIME=kiss.checkData(req.body.info.TIME)?req.body.info.TIME:null;
        var REMEMBER_PATIENTS=kiss.checkData(req.body.info.REMEMBER_PATIENTS)?req.body.info.REMEMBER_PATIENTS:0;
        var RECEIVE_REDIMED=kiss.checkData(req.body.info.RECEIVE_REDIMED)?req.body.info.RECEIVE_REDIMED:0;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        if(!kiss.checkListData(FIRSTNAME,LASTNAME,GENDER,DOB,CONTACT_NO,INJURY,CAL_ID,BookingType,EMAIL))
        {
            kiss.exlog('insertNonEmergency',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var sql="SELECT * FROM `cln_patients` WHERE `First_name` = ? AND `Sur_name` = ? AND `Middle_name` IS NULL AND `DOB` = ?";
        
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[FIRSTNAME,LASTNAME,moment(DOB).format("YYYY-MM-DD")],function(err,rows)
            {
                if(err)
                {
                    kiss.exlog("add",err,query.sql);
                    res.json({status:'error'});
                }
                else
                {
                    if (rows.length>0) {
                        console.log('aaaaaaaaaa',rows[0].Patient_id);
                        var Patient_id = rows[0].Patient_id;
                        var insertApptPatient={
                            Patient_id:Patient_id,
                            CAL_ID:CAL_ID
                        }

                        var sql="INSERT INTO `cln_appt_patients` SET ?";
                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,[insertApptPatient],function(err,rows)
                            {
                                if(err)
                                {
                                    kiss.exlog("insert_cln_appt_patient",err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var insertRow={
                                        CONTACT_NO:CONTACT_NO,
                                        MEDICARE_NO:MEDICARE_NO,
                                        MEDICARE_REF:MEDICARE_REF,
                                        INJURY:INJURY,
                                        CAL_ID:CAL_ID,
                                        email:EMAIL,
                                        BookingType:BookingType,
                                        CREATION_DATE:currentDate,
                                        remember_patients:REMEMBER_PATIENTS,
                                        receive_redimed:RECEIVE_REDIMED,
                                        patient_id:Patient_id
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
                                                var emailInfo={
                                                    subject:'',
                                                    senders:'',
                                                    recipients:'',
                                                    htmlBody:'',
                                                    textBody:''
                                                };
                                                emailInfo.subject='RE: Confirmation of booking '+FIRSTNAME+' '+LASTNAME;
                                                emailInfo.recipients=insertRow.email;
                                                emailInfo.senders=rlobUtil.getMedicoLegalMailSender() ;
                                                var template=
                                                    "   <p>Hi {{FIRSTNAME}},</p>                                                                                                                     "+      
                                                    "   NonEmergency                                                                                                                                 "+
                                                    "   <p>                                                                                                                                          "+      
                                                    "    <table >                                                                                                                                    "+         
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Gender:</td>                              "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri  !important;'>{{GENDER}}</td>                                           "+
                                                    "         </tr>                                                                                                                                  "+    
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri  !important;'>DOB:</td>                                "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DOB}}</td>                                               "+
                                                    "         </tr>                                                                                                                                  "+    
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Contact No:</td>                          "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{CONTACT_NO}}</td>                                        "+
                                                    "         </tr>                                                                                                                                  "+     
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Medicare No:</td>                         "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{MEDICARE_NO}}</td>                                       "+
                                                    "         </tr>                                                                                                                                  "+            
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Medicare Ref:</td>                        "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{MEDICARE_REF}}</td>                                      "+
                                                    "         </tr>                                                                                                                                  "+
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Injury:</td>                              "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{INJURY}}</td>                                            "+
                                                    "         </tr>                                                                                                                                  "+
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Doctor:</td>                              "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DOCTOR}}</td>                                            "+
                                                    "         </tr>                                                                                                                                  "+  
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Location:</td>                            "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{LOCATION}}</td>                                          "+
                                                    "         </tr>                                                                                                                                  "+
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Date:</td>                                "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DATE}}</td>                                              "+
                                                    "         </tr>                                                                                                                                  "+      
                                                    "         <tr>                                                                                                                                   "+
                                                    "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Time:</td>                                "+
                                                    "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{TIME}}</td>                                              "+
                                                    "         </tr>                                                                                                                                  "+     
                                                    "    </table>                                                                                                                                    ";         
                                                var emailData={
                                                    FIRSTNAME:FIRSTNAME,
                                                    GENDER:GENDER,
                                                    DOB:moment(DOB).format("YYYY-MM-DD"),
                                                    CONTACT_NO:CONTACT_NO,
                                                    MEDICARE_NO:MEDICARE_NO,
                                                    MEDICARE_REF:MEDICARE_REF,
                                                    INJURY:INJURY,
                                                    DOCTOR:DOCTOR,
                                                    LOCATION:LOCATION,
                                                    DATE:moment(DATE).format("YYYY/MM/DD"),
                                                    TIME:TIME
                                                }
                                                template=kiss.tokenBinding(template,emailData);
                                                emailInfo.htmlBody=template;
                                                rlobEmailController.sendEmail(req,res,emailInfo);
                                            }
                                        });
                                    });
                                }
                            });
                        });
                    }else{
                        console.log('bbbbbbbb',rows,query.sql);
                        var insertRow={
                            First_name:FIRSTNAME,
                            Sur_name:LASTNAME,
                            Sex:GENDER==='Male'?0:1,
                            DOB:moment(DOB).format("YYYY/MM/DD")
                        }
                        var sql="INSERT INTO `cln_patients` SET ?";
                        req.getConnection(function(err,connection)
                        {
                            var query = connection.query(sql,[insertRow],function(err,rows)
                            {
                                if(err)
                                {
                                    kiss.exlog("insert_cln_patient",err);
                                    res.json({status:'fail'});
                                }
                                else
                                {
                                    var Patient_id = rows.insertId;
                                    var insertApptPatient={
                                        Patient_id:Patient_id,
                                        CAL_ID:CAL_ID
                                    }

                                    var sql="INSERT INTO `cln_appt_patients` SET ?";
                                    req.getConnection(function(err,connection)
                                    {
                                        var query = connection.query(sql,[insertApptPatient],function(err,rows)
                                        {
                                            if(err)
                                            {
                                                kiss.exlog("insert_cln_appt_patient",err);
                                                res.json({status:'fail'});
                                            }
                                            else
                                            {
                                                var insertRow={
                                                    CONTACT_NO:CONTACT_NO,
                                                    MEDICARE_NO:MEDICARE_NO,
                                                    MEDICARE_REF:MEDICARE_REF,
                                                    INJURY:INJURY,
                                                    CAL_ID:CAL_ID,
                                                    email:EMAIL,
                                                    BookingType:BookingType,
                                                    CREATION_DATE:currentDate,
                                                    remember_patients:REMEMBER_PATIENTS,
                                                    receive_redimed:RECEIVE_REDIMED,
                                                    patient_id:Patient_id
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
                                                            var emailInfo={
                                                                subject:'',
                                                                senders:'',
                                                                recipients:'',
                                                                htmlBody:'',
                                                                textBody:''
                                                            };
                                                            emailInfo.subject='RE: Confirmation of booking '+FIRSTNAME+' '+LASTNAME;
                                                            emailInfo.recipients=insertRow.email;
                                                            emailInfo.senders=rlobUtil.getMedicoLegalMailSender() ;
                                                            var template=
                                                                "   <p>Hi {{FIRSTNAME}},</p>                                                                                                                     "+      
                                                                "   NonEmergency                                                                                                                                 "+
                                                                "   <p>                                                                                                                                          "+      
                                                                "    <table >                                                                                                                                    "+         
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Gender:</td>                              "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri  !important;'>{{GENDER}}</td>                                           "+
                                                                "         </tr>                                                                                                                                  "+    
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri  !important;'>DOB:</td>                                "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DOB}}</td>                                               "+
                                                                "         </tr>                                                                                                                                  "+    
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Contact No:</td>                          "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{CONTACT_NO}}</td>                                        "+
                                                                "         </tr>                                                                                                                                  "+     
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Medicare No:</td>                         "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{MEDICARE_NO}}</td>                                       "+
                                                                "         </tr>                                                                                                                                  "+            
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Medicare Ref:</td>                        "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{MEDICARE_REF}}</td>                                      "+
                                                                "         </tr>                                                                                                                                  "+
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Injury:</td>                              "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{INJURY}}</td>                                            "+
                                                                "         </tr>                                                                                                                                  "+
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Doctor:</td>                              "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DOCTOR}}</td>                                            "+
                                                                "         </tr>                                                                                                                                  "+  
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Location:</td>                            "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{LOCATION}}</td>                                          "+
                                                                "         </tr>                                                                                                                                  "+
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Date:</td>                                "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DATE}}</td>                                              "+
                                                                "         </tr>                                                                                                                                  "+      
                                                                "         <tr>                                                                                                                                   "+
                                                                "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Time:</td>                                "+
                                                                "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{TIME}}</td>                                              "+
                                                                "         </tr>                                                                                                                                  "+     
                                                                "    </table>                                                                                                                                    ";         
                                                            var emailData={
                                                                FIRSTNAME:FIRSTNAME,
                                                                GENDER:GENDER,
                                                                DOB:moment(DOB).format("YYYY-MM-DD"),
                                                                CONTACT_NO:CONTACT_NO,
                                                                MEDICARE_NO:MEDICARE_NO,
                                                                MEDICARE_REF:MEDICARE_REF,
                                                                INJURY:INJURY,
                                                                DOCTOR:DOCTOR,
                                                                LOCATION:LOCATION,
                                                                DATE:moment(DATE).format("YYYY/MM/DD"),
                                                                TIME:TIME
                                                            }
                                                            template=kiss.tokenBinding(template,emailData);
                                                            emailInfo.htmlBody=template;
                                                            rlobEmailController.sendEmail(req,res,emailInfo);
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        });    
                    };
                }
            });
        }); 
                        
    }
    ,insertEmergency:function(req,res){
        console.log('giappppppppppppppp',req.body.info);
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
        var INJURY=kiss.checkData(req.body.info.INJURY)?req.body.info.INJURY:null;
        var LONGITUDE=kiss.checkData(req.body.info.LONGITUDE)?req.body.info.LONGITUDE:null;
        var LATITUDE=kiss.checkData(req.body.info.LATITUDE)?req.body.info.LATITUDE:null;
        var currentDate=moment().format("YYYY/MM/DD HH:mm:ss");
        var EMAIL=kiss.checkData(req.body.info.EMAIL)?req.body.info.EMAIL:null;
        var REMEMBER_PATIENTS=kiss.checkData(req.body.info.REMEMBER_PATIENTS)?req.body.info.REMEMBER_PATIENTS:0;
        var RECEIVE_REDIMED=kiss.checkData(req.body.info.RECEIVE_REDIMED)?req.body.info.RECEIVE_REDIMED:0;

        if(!kiss.checkListData(FIRSTNAME,LASTNAME,GENDER,DOB,CONTACT_NO,INJURY))
        {
            kiss.exlog('insertEmergency',"Loi data truyen den");
            res.json({status:'fail'});
            return;
        }
        var insertRow={
            FIRSTNAME:FIRSTNAME,
            LASTNAME:LASTNAME,
            GENDER:GENDER,
            DOB:moment(DOB).format("YYYY/MM/DD"),
            ADD:ADD,
            CONTACT_NO:CONTACT_NO,
            MEDICARE_NO:MEDICARE_NO,
            MEDICARE_REF:MEDICARE_REF,
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
                    var emailInfo={
                        subject:'',
                        senders:'',
                        recipients:'',
                        htmlBody:'',
                        textBody:''
                    };
                    emailInfo.subject='RE: Confirmation of booking '+insertRow.FIRSTNAME+' '+insertRow.LASTNAME;
                    emailInfo.recipients=insertRow.email;
                    emailInfo.senders=rlobUtil.getMedicoLegalMailSender() ;
                    var template=
                        "   <p>Hi {{FIRSTNAME}},</p>                                                                                                                     "+     
                        "    Emergency                                                                                                                                   "+ 
                        "   <p>                                                                                                                                          "+      
                        "    <table >                                                                                                                                    "+         
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Gender:</td>                              "+
                        "             <td style='font-size: 11pt !important;font-family: calibri  !important;'>{{GENDER}}</td>                                           "+
                        "         </tr>                                                                                                                                  "+    
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri  !important;'>DOB:</td>                                "+
                        "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{DOB}}</td>                                               "+
                        "         </tr>                                                                                                                                  "+     
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri  !important;'>ADD:</td>                                "+
                        "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{ADD}}</td>                                               "+
                        "         </tr>                                                                                                                                  "+    
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Contact No:</td>                          "+
                        "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{CONTACT_NO}}</td>                                        "+
                        "         </tr>                                                                                                                                  "+     
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Medicare No:</td>                         "+
                        "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{MEDICARE_NO}}</td>                                       "+
                        "         </tr>                                                                                                                                  "+            
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Medicare Ref:</td>                        "+
                        "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{MEDICARE_REF}}</td>                                      "+
                        "         </tr>                                                                                                                                  "+
                        "         <tr>                                                                                                                                   "+
                        "             <td style='font-weight:bold;font-size: 11pt !important;font-family: calibri !important;'>Injury:</td>                              "+
                        "             <td style='font-size: 11pt !important;font-family: calibri !important;'>{{INJURY}}</td>                                            "+
                        "         </tr>                                                                                                                                  "+     
                        "    </table>                                                                                                                                    ";         
                    var emailData={
                        FIRSTNAME:insertRow.FIRSTNAME,
                        GENDER:insertRow.GENDER,
                        DOB:insertRow.DOB,
                        ADD:insertRow.ADD,
                        CONTACT_NO:insertRow.CONTACT_NO,
                        MEDICARE_NO:insertRow.MEDICARE_NO,
                        MEDICARE_REF:insertRow.MEDICARE_REF,
                        INJURY:insertRow.INJURY
                    }
                    template=kiss.tokenBinding(template,emailData);
                    emailInfo.htmlBody=template;
                    rlobEmailController.sendEmail(req,res,emailInfo);
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
