/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../../models');


module.exports = {

    insertMA : function(req, res)
    {
        var info = req.body.info;
        db.docMA.create({
            PATIENT_ID: info.PATIENT_ID,
            CAL_ID: info.CAL_ID,
            STICKER : info.STICKER,
            HEIGHT: info.HEIGHT == '' ? null : info.HEIGHT,
            WEIGHT: info.WEIGHT == '' ? null : info.WEIGHT,
            BMI : info.BMI == '' ? null : info.BMI,
            WAIST: info.WAIST == '' ? null : info.WAIST,
            HIP: info.HIP == '' ? null : info.HIP,
            WHR: info.WHR == '' ? null : info.WHR,
            IS_BMI: info.IS_BMI,
            IS_BLOOD: info.IS_BLOOD,
            BLOOD_SEC1: info.BLOOD_SEC1 == '' ? null : info.BLOOD_SEC1,
            IS_RESTING_HEART_RATE: info.IS_RESTING_HEART_RATE,
            RESTING_HEART_RATE: info.RESTING_HEART_RATE == '' ? null : info.RESTING_HEART_RATE,
            HEART_SOUNDS: info.HEART_SOUNDS,
            PERIPHERAL: info.PERIPHERAL,
            VEINS_OTHER: info.VEINS_OTHER,
            COMMENT_SEC1 : info.COMMENT_SEC1,
            RIGHT_DIST: info.RIGHT_DIST == '' ? null : info.RIGHT_DIST,
            RIGHT_DIST_CORRECT: info.RIGHT_DIST_CORRECT == '' ? null : info.RIGHT_DIST_CORRECT,
            LEFT_DIST: info.LEFT_DIST == '' ? null : info.LEFT_DIST,
            LEFT_DIST_CORRECT: info.LEFT_DIST_CORRECT == '' ? null : info.LEFT_DIST_CORRECT,
            RIGHT_NEAR: info.RIGHT_NEAR == '' ? null : info.RIGHT_NEAR,
            RIGHT_NEAR_CORRECT: info.RIGHT_NEAR_CORRECT == '' ? null : info.RIGHT_NEAR_CORRECT,
            LEFT_NEAR: info.LEFT_NEAR == '' ? null : info.LEFT_NEAR,
            LEFT_NEAR_CORRECT: info.LEFT_NEAR_CORRECT == '' ? null : info.LEFT_NEAR_CORRECT,
            COLOUR_SEC2: info.COLOUR_SEC2,
            SCORE_SEC2: info.SCORE_SEC2 == '' ? null : info.SCORE_SEC2,
            PERIPHERAL_SEC2: info.PERIPHERAL_SEC2,
            VISUAL_AIDS: info.VISUAL_AIDS,
            COMMENT_SEC2 : info.COMMENT_SEC2,
            PROTEIN: info.PROTEIN,
            GLUCOSE: info.GLUCOSE,
            BLOOD: info.BLOOD,
            BLOOD_SUGAR_LEVEL: info.BLOOD_SUGAR_LEVEL == '' ? null : info.BLOOD_SUGAR_LEVEL,
            COMMENT_SEC3 : info.COMMENT_SEC3,
            SPIROMETRY: info.SPIROMETRY,
            SYMMETRICAL: info.SYMMETRICAL,
            AUSCULTATION: info.AUSCULTATION,
            EARS: info.EARS,
            HEARING: info.HEARING,
            NOSE: info.NOSE,
            THROAT: info.THROAT,
            TEETH_GUMS: info.TEETH_GUMS,
            SKIN: info.SKIN,
            DRUG: info.DRUG,
            NAIL: info.NAIL,
            SCAR: info.SCAR,
            ABDOMEN: info.ABDOMEN,
            HERNIAL: info.HERNIAL,
            LIVER: info.LIVER,
            SPLEEN: info.SPLEEN,
            KIDNEYS: info.KIDNEYS,
            BALANCE: info.BALANCE,
            COORDINATION: info.COORDINATION,
            LYMPH: info.LYMPH,
            THYROID: info.THYROID,
            COMMENT_SEC9 : info.COMMENT_SEC9,
            AGE: info.AGE == '' ? null : info.AGE,
            HYPER: info.HYPER,
            SMOKER: info.SMOKER,
            KNOW: info.KNOW,
            SEDENTARY: info.SEDENTARY,
            FAMILY: info.FAMILY,
            HISTORY: info.HISTORY,
            OBESITY: info.OBESITY,
            RISK: info.RISK,
            ECG: info.ECG,
            ECG_RESULT: info.ECG_RESULT,
            GP: info.GP,
            COMMENT_SEC10 : info.COMMENT_SEC10,
            DOCTOR_ID : info.DOCTOR_ID,
            Created_by: info.Created_by,
            Creation_date: info.Creation_date,
            Last_updated_by: info.Last_updated_by,
            Last_update_date: info.Last_update_date,
            DF_CODE  : info.DF_CODE,
            ISENABLE: info.ISENABLE
        },{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    editMA : function(req, res)
    {
        var info = req.body.info;
        db.docMA.update({
            STICKER : info.STICKER,
            HEIGHT: info.HEIGHT == '' ? null : info.HEIGHT,
            WEIGHT: info.WEIGHT == '' ? null : info.WEIGHT,
            BMI : info.BMI == '' ? null : info.BMI,
            WAIST: info.WAIST == '' ? null : info.WAIST,
            HIP: info.HIP == '' ? null : info.HIP,
            WHR: info.WHR == '' ? null : info.WHR,
            IS_BMI: info.IS_BMI,
            IS_BLOOD: info.IS_BLOOD,
            BLOOD_SEC1: info.BLOOD_SEC1 == '' ? null : info.BLOOD_SEC1,
            IS_RESTING_HEART_RATE: info.IS_RESTING_HEART_RATE,
            RESTING_HEART_RATE: info.RESTING_HEART_RATE == '' ? null : info.RESTING_HEART_RATE,
            HEART_SOUNDS: info.HEART_SOUNDS,
            PERIPHERAL: info.PERIPHERAL,
            VEINS_OTHER: info.VEINS_OTHER,
            COMMENT_SEC1 : info.COMMENT_SEC1,
            RIGHT_DIST: info.RIGHT_DIST == '' ? null : info.RIGHT_DIST,
            RIGHT_DIST_CORRECT: info.RIGHT_DIST_CORRECT == '' ? null : info.RIGHT_DIST_CORRECT,
            LEFT_DIST: info.LEFT_DIST == '' ? null : info.LEFT_DIST,
            LEFT_DIST_CORRECT: info.LEFT_DIST_CORRECT == '' ? null : info.LEFT_DIST_CORRECT,
            RIGHT_NEAR: info.RIGHT_NEAR == '' ? null : info.RIGHT_NEAR,
            RIGHT_NEAR_CORRECT: info.RIGHT_NEAR_CORRECT == '' ? null : info.RIGHT_NEAR_CORRECT,
            LEFT_NEAR: info.LEFT_NEAR == '' ? null : info.LEFT_NEAR,
            LEFT_NEAR_CORRECT: info.LEFT_NEAR_CORRECT == '' ? null : info.LEFT_NEAR_CORRECT,
            COLOUR_SEC2: info.COLOUR_SEC2,
            SCORE_SEC2: info.SCORE_SEC2 == '' ? null : info.SCORE_SEC2,
            PERIPHERAL_SEC2: info.PERIPHERAL_SEC2,
            VISUAL_AIDS: info.VISUAL_AIDS,
            COMMENT_SEC2 : info.COMMENT_SEC2,
            PROTEIN: info.PROTEIN,
            GLUCOSE: info.GLUCOSE,
            BLOOD: info.BLOOD,
            BLOOD_SUGAR_LEVEL: info.BLOOD_SUGAR_LEVEL == '' ? null : info.BLOOD_SUGAR_LEVEL,
            COMMENT_SEC3 : info.COMMENT_SEC3,
            SPIROMETRY: info.SPIROMETRY,
            SYMMETRICAL: info.SYMMETRICAL,
            AUSCULTATION: info.AUSCULTATION,
            EARS: info.EARS,
            HEARING: info.HEARING,
            NOSE: info.NOSE,
            THROAT: info.THROAT,
            TEETH_GUMS: info.TEETH_GUMS,
            SKIN: info.SKIN,
            DRUG: info.DRUG,
            NAIL: info.NAIL,
            SCAR: info.SCAR,
            ABDOMEN: info.ABDOMEN,
            HERNIAL: info.HERNIAL,
            LIVER: info.LIVER,
            SPLEEN: info.SPLEEN,
            KIDNEYS: info.KIDNEYS,
            BALANCE: info.BALANCE,
            COORDINATION: info.COORDINATION,
            LYMPH: info.LYMPH,
            THYROID: info.THYROID,
            COMMENT_SEC9 : info.COMMENT_SEC9,
            AGE: info.AGE == '' ? null : info.AGE,
            HYPER: info.HYPER,
            SMOKER: info.SMOKER,
            KNOW: info.KNOW,
            SEDENTARY: info.SEDENTARY,
            FAMILY: info.FAMILY,
            HISTORY: info.HISTORY,
            OBESITY: info.OBESITY,
            RISK: info.RISK,
            ECG: info.ECG,
            ECG_RESULT: info.ECG_RESULT,
            GP: info.GP,
            COMMENT_SEC10 : info.COMMENT_SEC10,
            Created_by: info.Created_by,
            Last_updated_by: info.Last_updated_by,
            Last_update_date: info.Last_update_date,
            DF_CODE  : info.DF_CODE,
            ISENABLE: info.ISENABLE
        },{MA_ID : info.MA_ID})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })

    },

    checkMA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.docMA.find({where:{PATIENT_ID:Patient_Id,CAL_ID : CalId}})
            .success(function(data){
                if(data == null)
                {
                    db.APPTCAL.find({where: {cal_id: CalId}}, {raw: true})
                        .success(function (appt) {
                            if (appt === null || appt.length === 0) {
                                console.log("Not found APPTCAL in table");
                                res.json({status: 'fail'});
                                return false;
                            }
                            db.Doctor.find({where: {doctor_id: appt.DOCTOR_ID}}, {raw: true})
                                .success(function (doctor) {
                                    if (doctor === null || doctor.length === 0) {
                                        console.log("Not found doctor in table");
                                        res.json({status: 'fail'});
                                        return false;
                                    }else
                                    {
                                        res.json({status:'insert',docID : doctor.doctor_id,docName:doctor.NAME,docSign:doctor.Signature});
                                    }
                                })
                                .error(function (err) {
                                    console.log("ERROR:" + err);
                                    res.json({status: 'error'});
                                    return false;
                                });
                        })
                        .error(function (err) {
                            console.log("ERROR:" + err);
                            res.json({status: 'error'});
                            return false;
                        });
                }else
                {
                    db.Doctor.find({where: {doctor_id: data.DOCTOR_ID}}, {raw: true})
                        .success(function (doctor) {
                            if (doctor === null || doctor.length === 0) {
                                console.log("Not found doctor in table");
                                res.json({status: 'fail'});
                                return false;
                            }else
                            {
                                res.json({status:'update',data : data,docName:doctor.NAME,docSign:doctor.Signature});
                            }
                        })
                        .error(function (err) {
                            console.log("ERROR:" + err);
                            res.json({status: 'error'});
                            return false;
                        });
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }
};

