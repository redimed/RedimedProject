/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../../models');
module.exports = {

    newMA: function(req,res)
    {
        var PATIENT_ID = req.body.PATIENT_ID;
        var CAL_ID = req.body.CAL_ID;
        db.sequelize.query("INSERT INTO `cln_ma_headers` (Patient_id,CAL_ID,MA_ID,DF_CODE,ISENABLE, DESCRIPTION, Creation_date) SELECT ?,?,h.QUEST_DF_ID,h.`DF_CODE`,h.`ISENABLE`,h.DESCRIPTION,?  FROM `sys_ma_df_headers` h;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
            db.sequelize.query("INSERT INTO `cln_ma_group` (PATIENT_ID, CAL_ID, GROUP_ID, GROUP_NAME, MA_ID,USER_TYPE,ISENABLE) SELECT ?,?,g.`GROUP_ID`, g.`GROUP_NAME`,g.`QUEST_DF_ID`,g.`USER_TYPE`,g.`ISENABLE` FROM `sys_ma_df_group` g;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                db.sequelize.query("INSERT INTO `cln_ma_lines` (PATIENT_ID,CAL_ID,MA_LINE_ID,QUESTION,VAL1_NAME,VAL2_NAME,YES_NO,ORD,GROUP_ID,ISENABLE) SELECT ?,?,l.MA_LINE_ID, l.QUESTION, l.VAL1_NAME, l.VAL2_NAME, l.YES_NO, l.ORD, l.GROUP_ID,l.ISENABLE FROM `sys_ma_df_lines` l;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(){
                    res.json({status:"success"});
                });
            });
        }).error(function(err){
            res.json({status:"fail"});
        });
    },

    loadMA: function(req,res){
        var data = [];
        var PATIENT_ID = req.body.PATIENT_ID;
        var CAL_ID = req.body.CAL_ID;
        db.sequelize.query("SELECT h.MA_ID,h.DESCRIPTION,h.DF_CODE FROM `cln_ma_headers` h WHERE h.`ISENABLE` = 1 AND h.Patient_id = ? AND h.CAL_ID = ?",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(dataH){
            db.sequelize.query("SELECT g.GROUP_ID, g.GROUP_NAME, g.MA_ID, g.USER_TYPE FROM `cln_ma_group` g WHERE g.ISENABLE = 1 AND g.PATIENT_ID = ? AND g.CAL_ID = ?",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(dataG){
                db.sequelize.query("SELECT l.MA_LINE_ID,l.QUESTION,l.VAL1_NAME,l.VAL2_NAME,l.YES_NO,l.GROUP_ID,l.ISENABLE,l.YES_NO_VAL, l.VAL1 , l.VAL2, l.VAL3, l.COMMENTS FROM `cln_ma_lines` l WHERE l.ISENABLE = 1 AND l.PATIENT_ID = ? AND l.CAL_ID = ?  ORDER BY l.ORD ;",null,{raw:true},[PATIENT_ID,CAL_ID]).success(function(dataL){
                    data = [{"Header": dataH, "Group" : dataG,"Line": dataL}];
                    res.json(data);
                });
            });
        })
            .error(function(err){
                res.json({status:"fail"});
            })
    },

    insertMA : function(req, res)
    {
        var infoL = req.body.infoL;
        var infoH = req.body.infoH;
        db.HeaderMA.update({

            HEIGHT : infoH.HEIGHT,
            WEIGHT: infoH.WEIGHT,
            BMI: infoH.BMI,
            URINALYSIS: infoH.URINALYSIS,
            BSL : infoH.BSL,
            WAIST_CIR : infoH.WAIST_CIR,
            HIP_CIR : infoH.HIP_CIR,
            WAIST_TO_HIP_RATE : infoH.WAIST_TO_HIP_RATE,
            RISK : infoH.RISK,
            DIST_RIGHT_EYE : infoH.DIST_RIGHT_EYE,
            DIST_RIGHT_EYE_CORRECTED : infoH.DIST_RIGHT_EYE_CORRECTED,
            DIST_LEFT_EYE : infoH.DIST_LEFT_EYE,
            DIST_LEFT_EYE_CORRECTED : infoH.DIST_LEFT_EYE_CORRECTED,
            NEAR_RIGHT_EYE : infoH.NEAR_RIGHT_EYE,
            NEAR_RIGHT_EYE_CORRECTED : infoH.NEAR_RIGHT_EYE_CORRECTED,
            NEAR_LEFT_EYE : infoH.NEAR_LEFT_EYE,
            NEAR_LEFT_EYE_CORRECTED : infoH.NEAR_LEFT_EYE_CORRECTED,
            PERIPHERAL_VISION : infoH.PERIPHERAL_VISION,
            VISUAL_AIDS : infoH.VISUAL_AIDS,
            VISUAL_AIDS_TYPE : infoH.VISUAL_AIDS_TYPE,
            COLOR_VISUAL : infoH.COLOR_VISUAL,
            COLOR_VISUAL_SCORE : infoH.COLOR_VISUAL_SCORE,
            ISWOULD : infoH.ISWOULD,
            COMMENTS: infoH.COMMENTS,
            FINAL_ASS : infoH.FINAL_ASS,
            COMMENTS2: infoH.COMMENTS2,
            DOCTOR_NAME: infoH.DOCTOR_NAME,
            SIGN  : infoH.SIGN,
            HA_DATE : infoH.HA_DATE,
            LOCATION_ID : infoH.LOCATION_ID,
            QUEST_DF_ID : infoH.QUEST_DF_ID,
            Created_by : infoH.Created_by,
            Last_updated_by : infoH.Last_updated_by,
            CAL_ID : infoH.CAL_ID,
            DF_CODE : infoH.DF_CODE,
            ISENABLE : infoH.ISENABLE,
            IS_URINALYSIS : infoH.IS_URINALYSIS,
            EXAMINED_COMMENT: infoH.EXAMINED_COMMENT,
            IS_CANDIDATE_CAN_UNDERTAKE : infoH.IS_CANDIDATE_CAN_UNDERTAKE,
            IS_CANDIDATE_BE_ADVERSELY_AFFECTED : infoH.IS_CANDIDATE_BE_ADVERSELY_AFFECTED,
            CANDIDATE_CAN_UNDERTAKE_COMMENT: infoH.CANDIDATE_CAN_UNDERTAKE_COMMENT,
            CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT: infoH.CANDIDATE_BE_ADVERSELY_AFFECTED_COMMENT,
            DESCRIPTION : infoH.DESCRIPTION
        },{Patient_id : infoH.Patient_id,CAL_ID : infoH.CAL_ID},{raw:true})
            .success(function(data){
                db.LineMA.max('MA_LINE_ID').success(function(maxL) {
                    for(var i = 36; i <= maxL ; i++ )
                    {
                        db.LineMA.update({
                            YES_NO_VAL: infoL.YES_NO_VAL[i],
                            VAL1: infoL.VAL1[i],
                            VAL2: infoL.VAL2[i],
                            VAL3: infoL.VAL3[i],
                            COMMENTS: infoL.COMMENTS[i]
                        },{PATIENT_ID : infoH.Patient_id,CAL_ID : infoH.CAL_ID, MA_LINE_ID : i},{raw:true})
                            .success(function(data){
                                res.json({status:'success'});
                            })
                            .error(function(err){
                                res.json({status:'error'});
                                console.log(err);
                            })
                    }
                })
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    checkMA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;
        db.HeaderMA.find({where:{Patient_id:Patient_Id,CAL_ID : CalId}})
            .success(function(data){
                if(data == null)
                {
                    res.json({status:'fail'});
                }else
                {
                    res.json(data);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }

};



