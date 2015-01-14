var db = require('../models');
var mdt_functions = require('../mdt-functions.js');

module.exports = {
    rl_form_ams6_insert:function(req,res){
        console.log(req.body);
        var info = req.body.info;
        // var userInfo=JSON.parse(req.cookies.userInfo.id);
        // var date = moment().format('MMMM Do YYYY, h:mm:ss');
        // var sql = mdt_functions.commonAdd("rl_form_ams6", info);

        // db.sequelize.query(sql)
        // .success(function(created){
        //     res.json({status:'success'});
        // })
        // .error(function(error){
        //     res.json({status:'error'});
        // });
        db.FormAms6.create({
            BOOKING_ID : info.BOOKING_ID,
            WRK_NAME : info.WRK_NAME,
            WRK_ADDRESS_1: info.WRK_ADDRESS_1,
            WRK_ADDRESS_2: info.WRK_ADDRESS_2,
            WRK_POSTCODE: info.WRK_POSTCODE,
            WRK_DATE_OF_BIRTH: info.WRK_DATE_OF_BIRTH,
            WRK_DATE_OF_INJURI : info.WRK_DATE_OF_INJURI,
            WRK_INSURER_CLAIM_NUMBER : info.WRK_INSURER_CLAIM_NUMBER,
            WRK_DESCRIPTION_OF_INJURI : info.WRK_DESCRIPTION_OF_INJURI,
            WRK_PHONE : info.WRK_PHONE,
            WRK_EMAIL : info.WRK_EMAIL,
            WRK_WORKCOVER_WA_CLAIM_NUMBER : info.WRK_WORKCOVER_WA_CLAIM_NUMBER,
            COMPANIES_ID : null,
            EMP_ORGANISATION_NAME : info.EMP_ORGANISATION_NAME,
            EMP_CONTACT_PERSON : info.EMP_CONTACT_PERSON,
            EMP_ADDRESS_1 : info.EMP_ADDRESS_1,
            EMP_ADDRESS_2 : info.EMP_ADDRESS_2,
            EMP_POSTCODE : info.EMP_POSTCODE,
            EMP_PHONE : info.EMP_PHONE,
            EMP_EMAIL : info.EMP_EMAIL,
            EMP_NAME_OF_INSURER : info.EMP_NAME_OF_INSURER,
            EMP_WORKCOVER_MUNBER : info.EMP_WORKCOVER_MUNBER,
            PURPOSE_OF_THE_ASSESSMENT : info.PURPOSE_OF_THE_ASSESSMENT,
            DATE_ASSESS: info.DATE_ASSESS,
            INJURY_ASSESSMENT : info.INJURY_ASSESSMENT,
            DOCTOR_ID: null,
            DT_DATE : info.DT_DATE,
            DT_SIGNATURE : info.DT_SIGNATURE,
            DT_NAME : info.DT_NAME,
            DT_ADDRESS_1 : info.DT_ADDRESS_1,
            DT_ADDRESS_2 : info.DT_ADDRESS_2,
            DT_POSTCODE : info.DT_POSTCODE,
            DT_PHONE: info.DT_PHONE,
            DT_EMAIL : info.DT_EMAIL,
            ISENABLE: 1,
            CREATED_BY: null,
            CREATION_DATE: null,
            LAST_UPDATED_BY: null,
            LAST_UPDATED_DATE: null
         },{raw:true})
            .success(function(data){
                console.log(data.null);
                res.json({status:'success',data:data.null});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    rl_form_ams6_update:function(req,res){
        console.log(req.body);
        var info = req.body.info;
        // var userInfo=JSON.parse(req.cookies.userInfo.id);
        // var date = moment().format('MMMM Do YYYY, h:mm:ss');
        // var sql = mdt_functions.commonAdd("rl_form_ams6", info);

        // db.sequelize.query(sql)
        // .success(function(created){
        //     res.json({status:'success'});
        // })
        // .error(function(error){
        //     res.json({status:'error'});
        // });
        db.FormAms6.update({
            BOOKING_ID : info.BOOKING_ID,
            WRK_NAME : info.WRK_NAME,
            WRK_ADDRESS_1: info.WRK_ADDRESS_1,
            WRK_ADDRESS_2: info.WRK_ADDRESS_2,
            WRK_POSTCODE: info.WRK_POSTCODE,
            WRK_DATE_OF_BIRTH: info.WRK_DATE_OF_BIRTH,
            WRK_DATE_OF_INJURI : info.WRK_DATE_OF_INJURI,
            WRK_INSURER_CLAIM_NUMBER : info.WRK_INSURER_CLAIM_NUMBER,
            WRK_DESCRIPTION_OF_INJURI : info.WRK_DESCRIPTION_OF_INJURI,
            WRK_PHONE : info.WRK_PHONE,
            WRK_EMAIL : info.WRK_EMAIL,
            WRK_WORKCOVER_WA_CLAIM_NUMBER : info.WRK_WORKCOVER_WA_CLAIM_NUMBER,
            COMPANIES_ID : null,
            EMP_ORGANISATION_NAME : info.EMP_ORGANISATION_NAME,
            EMP_CONTACT_PERSON : info.EMP_CONTACT_PERSON,
            EMP_ADDRESS_1 : info.EMP_ADDRESS_1,
            EMP_ADDRESS_2 : info.EMP_ADDRESS_2,
            EMP_POSTCODE : info.EMP_POSTCODE,
            EMP_PHONE : info.EMP_PHONE,
            EMP_EMAIL : info.EMP_EMAIL,
            EMP_NAME_OF_INSURER : info.EMP_NAME_OF_INSURER,
            EMP_WORKCOVER_MUNBER : info.EMP_WORKCOVER_MUNBER,
            PURPOSE_OF_THE_ASSESSMENT : info.PURPOSE_OF_THE_ASSESSMENT,
            DATE_ASSESS: info.DATE_ASSESS,
            INJURY_ASSESSMENT : info.INJURY_ASSESSMENT,
            DOCTOR_ID: null,
            DT_DATE : info.DT_DATE,
            DT_SIGNATURE : info.DT_SIGNATURE,
            DT_NAME : info.DT_NAME,
            DT_ADDRESS_1 : info.DT_ADDRESS_1,
            DT_ADDRESS_2 : info.DT_ADDRESS_2,
            DT_POSTCODE : info.DT_POSTCODE,
            DT_PHONE: info.DT_PHONE,
            DT_EMAIL : info.DT_EMAIL,
            ISENABLE: 1,
            CREATED_BY: null,
            CREATION_DATE: null,
            LAST_UPDATED_BY: null,
            LAST_UPDATED_DATE: null
         },{AMS6_ID:info.AMS6_ID},{raw:true})
            .success(function(data){
                console.log(data.null);
                res.json({status:'success',data:data.null});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    get_booking_doctor_company:function(req,res){
        var BOOKING_ID = req.query.BOOKING_ID;
        var sql=
             "SELECT booking.`WRK_SURNAME` AS `WRK_SURNAME`,booking.`WRK_OTHERNAMES` AS `WRK_OTHERNAMES`,booking.`WRK_DOB` AS `WRK_DATE_OF_BIRTH`,booking.`WRK_CONTACT_NO` AS `WRK_PHONE`,booking.`WRK_EMAIL` AS WRK_EMAIL,booking.`DESC_INJURY` AS `WRK_DESCRIPTION_OF_INJURI`,company.`Company_name` AS EMP_ORGANISATION_NAME,company.`postcode` AS EMP_POSTCODE,company.`Addr` AS EMP_ADDRESS_1,company.`Email` AS EMP_EMAIL,company.`Phone` AS EMP_PHONE,doctor.`NAME` AS DT_NAME,doctor.`Address` AS DT_ADDRESS_1,doctor.`Email` AS DT_EMAIL,doctor.`Phone` AS DT_PHONE,doctor.`Signature` AS DT_SIGNATURE "+                                      
             "FROM `rl_bookings` booking    "+                                           
             "INNER JOIN `companies` company ON booking.`COMPANY_ID`=company.`id`  "+    
             "INNER JOIN `doctors` doctor ON booking.`DOCTOR_ID`=doctor.`doctor_id`  "+  
             "WHERE booking.`BOOKING_ID`= ?                        ";                
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[BOOKING_ID],function(err,data)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if(data.length>0)
                            res.json({status:'success',data:data[0]});
                        else
                        {
                            console.log("No data",err );
                            res.json({status:'fail'});
                        }
                    }

                });
        });
    },
    select_Item_rl_form_ams6_bookingid: function(req,res){
        var BOOKING_ID = req.query.BOOKING_ID;
        console.log(BOOKING_ID);
        var sql= 'SELECT * FROM `rl_form_ams6` WHERE `BOOKING_ID` = ?';   
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[BOOKING_ID],function(err,data)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if(data.length>0)
                            res.json({status:'update',data:data[0]});
                        else
                        {
                            console.log("No data",err );
                            res.json({status:'insert'});
                        }
                    }

                });
        });
    },
    select_Item_rl_form_ams5_bookingid: function(req,res){
        var BOOKING_ID = req.query.BOOKING_ID;
        console.log(BOOKING_ID);
        var sql= 'SELECT * FROM `rl_form_ams5` WHERE `BOOKING_ID` = ?';   
        req.getConnection(function(err,connection)
        {
            var query = connection.query(sql,[BOOKING_ID],function(err,data)
                {
                    if(err)
                    {
                        console.log("Error Selecting : %s ",err );
                        res.json({status:'fail'});
                    }
                    else
                    {
                        if(data.length>0)
                            res.json({status:'update',data:data[0]});
                        else
                        {
                            console.log("No data",err );
                            res.json({status:'insert'});
                        }
                    }

                });
        });
    },
    rl_form_ams5_insert:function(req,res){
        console.log(req.body);
        var info = req.body.info;
        // var userInfo=JSON.parse(req.cookies.userInfo.id);
        // var date = moment().format('MMMM Do YYYY, h:mm:ss');
        // var sql = mdt_functions.commonAdd("rl_form_ams6", info);

        // db.sequelize.query(sql)
        // .success(function(created){
        //     res.json({status:'success'});
        // })
        // .error(function(error){
        //     res.json({status:'error'});
        // });
        db.FormAms5.create({
              BOOKING_ID : info.BOOKING_ID,
              WRK_NAME : info.WRK_NAME,
              WRK_ADDRESS_2 : info.WRK_ADDRESS_2,
              WRK_ADDRESS_1 : info.WRK_ADDRESS_1,
              WRK_POSTCODE : info.WRK_POSTCODE,
              WRK_DATE_OF_BIRTH : info.WRK_DATE_OF_BIRTH,
              WRK_DATE_OF_INJURI : info.WRK_DATE_OF_INJURI,
              WRK_INSURER_CLAIM_NUMBER : info.WRK_INSURER_CLAIM_NUMBER,
              WRK_DESCRIPTION_OF_INJURI : info.WRK_DESCRIPTION_OF_INJURI,
              WRK_PHONE : info.WRK_PHONE,
              WRK_EMAIL : info.WRK_EMAIL,
              WRK_WORKCOVER_WA_CLAIM_NUMBER : info.WRK_WORKCOVER_WA_CLAIM_NUMBER,
              COMPANIES_ID : null,
              EMP_ORGANISATION_NAME : info.EMP_ORGANISATION_NAME,
              EMP_CONTACT_PERSON : info.EMP_CONTACT_PERSON,
              EMP_ADDRESS_1 : info.EMP_ADDRESS_1,
              EMP_ADDRESS_2 : info.EMP_ADDRESS_2,
              EMP_POSTCODE : info.EMP_POSTCODE,
              EMP_PHONE : info.EMP_PHONE,
              EMP_EMAIL : info.EMP_EMAIL,
              EMP_NAME_OF_INSURER : info.EMP_NAME_OF_INSURER,
              EMP_WORKCOVER_MUNBER : info.EMP_WORKCOVER_MUNBER,
              PURPOSE_OF_THE_ASSESSMENT : info.PURPOSE_OF_THE_ASSESSMENT,
              EX_DATE : info.EX_DATE,
              EXL_NAME : info.EXL_NAME,
              EXL_ADDRESS_1 : info.EXL_ADDRESS_1,
              EXL_ADDRESS_2 : info.EXL_ADDRESS_2,
              EXL_POSTCODE : info.EXL_POSTCODE,
              REPORTS_AND_DOCUMENTS : info.REPORTS_AND_DOCUMENTS,
              NARRATIVE_HISTORY : info.NARRATIVE_HISTORY,
              DIAGNOSIS_AND_STUDIES : info.DIAGNOSIS_AND_STUDIES,
              DIAGNOSIS_AND_IMPAIRMENTS : info.DIAGNOSIS_AND_IMPAIRMENTS,
              PROPORTION_OF_PERMANENT_IMPAIRMENT : info.PROPORTION_OF_PERMANENT_IMPAIRMENT,
              INJURY_ASSESSMENT : info.INJURY_ASSESSMENT,
              DOCTOR_ID : null,
              DT_DATE : info.DT_DATE,
              DT_SIGNATURE : info.DT_SIGNATURE,
              DT_NAME : info.DT_NAME,
              DT_ADDRESS_1 : info.DT_ADDRESS_1,
              DT_ADDRESS_2 : info.DT_ADDRESS_2,
              DT_POSTCODE : info.DT_POSTCODE,
              DT_PHONE : info.DT_PHONE,
              DT_EMAIL : info.DT_EMAIL,
              ISENABLE : 0,
              CREATED_BY : null,
              CREATION_DATE : null,
              LAST_UPDATED_BY : null,
              LAST_UPDATED_DATE : null
         },{raw:true})
            .success(function(data){
                console.log(data.null);
                res.json({status:'success',data:data.null});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },
    rl_form_ams5_update:function(req,res){
        console.log(req.body);
        var info = req.body.info;
        // var userInfo=JSON.parse(req.cookies.userInfo.id);
        // var date = moment().format('MMMM Do YYYY, h:mm:ss');
        // var sql = mdt_functions.commonAdd("rl_form_ams6", info);

        // db.sequelize.query(sql)
        // .success(function(created){
        //     res.json({status:'success'});
        // })
        // .error(function(error){
        //     res.json({status:'error'});
        // });
        db.FormAms5.update({
              BOOKING_ID : info.BOOKING_ID,
              WRK_NAME : info.WRK_NAME,
              WRK_ADDRESS_2 : info.WRK_ADDRESS_2,
              WRK_ADDRESS_1 : info.WRK_ADDRESS_1,
              WRK_POSTCODE : info.WRK_POSTCODE,
              WRK_DATE_OF_BIRTH : info.WRK_DATE_OF_BIRTH,
              WRK_DATE_OF_INJURI : info.WRK_DATE_OF_INJURI,
              WRK_INSURER_CLAIM_NUMBER : info.WRK_INSURER_CLAIM_NUMBER,
              WRK_DESCRIPTION_OF_INJURI : info.WRK_DESCRIPTION_OF_INJURI,
              WRK_PHONE : info.WRK_PHONE,
              WRK_EMAIL : info.WRK_EMAIL,
              WRK_WORKCOVER_WA_CLAIM_NUMBER : info.WRK_WORKCOVER_WA_CLAIM_NUMBER,
              COMPANIES_ID : null,
              EMP_ORGANISATION_NAME : info.EMP_ORGANISATION_NAME,
              EMP_CONTACT_PERSON : info.EMP_CONTACT_PERSON,
              EMP_ADDRESS_1 : info.EMP_ADDRESS_1,
              EMP_ADDRESS_2 : info.EMP_ADDRESS_2,
              EMP_POSTCODE : info.EMP_POSTCODE,
              EMP_PHONE : info.EMP_PHONE,
              EMP_EMAIL : info.EMP_EMAIL,
              EMP_NAME_OF_INSURER : info.EMP_NAME_OF_INSURER,
              EMP_WORKCOVER_MUNBER : info.EMP_WORKCOVER_MUNBER,
              PURPOSE_OF_THE_ASSESSMENT : info.PURPOSE_OF_THE_ASSESSMENT,
              EX_DATE : info.EX_DATE,
              EXL_NAME : info.EXL_NAME,
              EXL_ADDRESS_1 : info.EXL_ADDRESS_1,
              EXL_ADDRESS_2 : info.EXL_ADDRESS_2,
              EXL_POSTCODE : info.EXL_POSTCODE,
              REPORTS_AND_DOCUMENTS : info.REPORTS_AND_DOCUMENTS,
              NARRATIVE_HISTORY : info.NARRATIVE_HISTORY,
              DIAGNOSIS_AND_STUDIES : info.DIAGNOSIS_AND_STUDIES,
              DIAGNOSIS_AND_IMPAIRMENTS : info.DIAGNOSIS_AND_IMPAIRMENTS,
              PROPORTION_OF_PERMANENT_IMPAIRMENT : info.PROPORTION_OF_PERMANENT_IMPAIRMENT,
              INJURY_ASSESSMENT : info.INJURY_ASSESSMENT,
              DOCTOR_ID : null,
              DT_DATE : info.DT_DATE,
              DT_SIGNATURE : info.DT_SIGNATURE,
              DT_NAME : info.DT_NAME,
              DT_ADDRESS_1 : info.DT_ADDRESS_1,
              DT_ADDRESS_2 : info.DT_ADDRESS_2,
              DT_POSTCODE : info.DT_POSTCODE,
              DT_PHONE : info.DT_PHONE,
              DT_EMAIL : info.DT_EMAIL,
              ISENABLE : 0,
              CREATED_BY : null,
              CREATION_DATE : null,
              LAST_UPDATED_BY : null,
              LAST_UPDATED_DATE : null
         },{AMS5_ID:info.AMS5_ID},{raw:true})
            .success(function(data){
                console.log(data.null);
                res.json({status:'success',data:data.null});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
}
