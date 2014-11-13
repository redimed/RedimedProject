/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../../models');
var util = require('util');
module.exports = {

    newIDS: function(req,res)
    {
        var PATIENT_ID = req.body.PATIENT_ID;
        var CAL_ID = req.body.CAL_ID;
        db.sequelize.query("INSERT INTO `cln_idas_headers` (PATIENT_ID,CAL_ID,IDAS_ID,DF_CODE,ITEM_ID,ISENABLE) SELECT ?,?,h.IDAS_DF_ID,h.DF_CODE,h.ITEM_ID,h.ISENABLE FROM `sys_idas_headers` h",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
            db.sequelize.query("INSERT INTO `cln_idas_groups` (PATIENT_ID,CAL_ID,IDAS_GROUP_ID,IDAS_ID,ORD,GROUP_NAME,USER_TYPE,ISENABLE) SELECT ?,?,IDAS_GROUP_ID,IDAS_DF_ID,ORD,GROUP_NAME,USER_TYPE,ISENABLE FROM `sys_idas_groups`",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                db.sequelize.query("INSERT INTO `cln_idas_lines` (PATIENT_ID,CAL_ID,IDAS_LINE_ID,IDAS_GROUP_ID,ORD,QUESTION,YES_NO,ISENABLE) SELECT ?,?,IDAS_LINE_ID,IDAS_GROUP_ID,ORD,QUESTION,YES_NO,ISENABLE FROM `sys_idas_lines`",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                    res.json({status:"success"});
                });
            });
        }).error(function(err){
            res.json({status:"fail"});
        });
    },

    loadIDS: function(req,res){
        var data = [];
        var PATIENT_ID = req.body.PATIENT_ID;
        var CAL_ID = req.body.CAL_ID;
        db.sequelize.query("SELECT h.`IDAS_ID` FROM `cln_idas_headers` h WHERE h.`ISENABLE` = 1 AND h.PATIENT_ID = ? AND h.CAL_ID=? ;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(dataH){
            db.sequelize.query("SELECT g.`IDAS_GROUP_ID`,g.`IDAS_ID`,g.`GROUP_NAME`,g.`USER_TYPE` FROM `cln_idas_groups` g WHERE g.`ISENABLE` = 1 AND g.PATIENT_ID = ? AND g.CAL_ID=? ORDER BY g.`ORD`;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(dataG){
                db.sequelize.query("SELECT l.`IDAS_LINE_ID`, l.`IDAS_GROUP_ID`, l.`QUESTION`,l.`YES_NO` FROM `cln_idas_lines` l WHERE l.`ISENABLE` = 1 AND l.PATIENT_ID = ? AND l.CAL_ID=? ORDER BY l.`ORD`;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(dataL){
                    data = [{"Header": dataH, "Group" : dataG,"Line": dataL}];
                    res.json(data);
                });
            });
        })
            .error(function(err){
                res.json({status:"fail"});
            })
    },

    insertIDS : function(req, res)
    {
        var infoL = req.body.infoL;
        var infoH = req.body.infoH;
        db.HeadersIDS.update({
            DOCTOR_ID : infoH.DOCTOR_ID,
            NAME : infoH.NAME,
            IDAS_DATE: infoH.IDAS_DATE,
            Temperature : infoH.Temperature,
            Creatinine : infoH.Creatinine,
            Drug_Test_Time : infoH.Drug_Test_Time,
            Expiry_Date: infoH.Expiry_Date,
            Notes : infoH.Notes,
            Alcohol_Test_Time : infoH.Alcohol_Test_Time,
            Reading : infoH.Reading,
            Positive_Negative : infoH.Positive_Negative,
            Reading2 : infoH.Reading2,
            Created_by : infoH.Created_by,
            Creation_date: infoH.Creation_date,
            Last_updated_by : infoH.Last_updated_by,
            Last_update_date: infoH.Last_update_date,
            NAME_COMMENT : infoH.NAME_COMMENT,
            SIGNATURE:  infoH.SIGNATURE,
            TesterName : infoH.TesterName,
            TesterSign:  infoH.TesterSign
        },{PATIENT_ID : infoH.PATIENT_ID,CAL_ID : infoH.CAL_ID},{raw:true})
            .success(function(data){
                for(var i = 0 ; i < infoL.length ; i++)
                {
                    db.LinesIDS.update({
                        YES_NO: infoL[i]
                    },{PATIENT_ID : infoH.PATIENT_ID,CAL_ID : infoH.CAL_ID, ORD : i+1},{raw:true})
                        .success(function(data){
                            res.json({status:'success'});
                        })
                        .error(function(err){
                            res.json({status:'error'});
                            console.log(err);
                        })
                }

            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    checkIDS: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;
        console.log(Patient_Id + " ================= " + CalId);
        db.HeadersIDS.find({where:{PATIENT_ID:Patient_Id,CAL_ID : CalId}})
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    //var buffer = new Buffer( data.SIGNATURE, 'binary' );
                    //var sign = buffer.toString('base64');

                    //var rs = util.format("data:image/png;base64,%s", "");

                    res.json({data: data});
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};



