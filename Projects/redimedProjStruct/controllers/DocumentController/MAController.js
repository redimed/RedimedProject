/**
 * Created by meditech on 24/09/2014.
 */
var db = require('../../models');
var mkdirp = require('mkdirp');

var java = require('java');
java.options.push("-Djava.awt.headless=true");
java.classpath.push('commons-lang3-3.1.jar');
java.classpath.push('commons-io.jar');
java.classpath.push('./lib/commons-beanutils-1.8.2.jar');
java.classpath.push('./lib/commons-collections-3.2.1.jar');
java.classpath.push('./lib/commons-digester-2.1.jar');
java.classpath.push('./lib/commons-logging-1.1.jar');
java.classpath.push('./lib/groovy-all-2.0.1.jar');
java.classpath.push('./lib/iText-2.1.7.js2.jar');
java.classpath.push('./lib/jasperreports-5.6.0.jar');
java.classpath.push('./lib/mysql-connector-java-5.1.13-bin.jar');
java.classpath.push('./lib/org-apache-commons-codec.jar');


//var ImageIO = java.import('javax.imageio.ImageIO');
var HashMap = java.import('java.util.HashMap');
var JRException = java.import('net.sf.jasperreports.engine.JRException');
var JasperExportManager = java.import('net.sf.jasperreports.engine.JasperExportManager');
var JasperFillManager = java.import('net.sf.jasperreports.engine.JasperFillManager');
var JasperPrint = java.import('net.sf.jasperreports.engine.JasperPrint');
var DriverManager = java.import('java.sql.DriverManager');
var Driver = java.import('com.mysql.jdbc.Driver');
var InputStream = java.import('java.io.InputStream');
var FileInputStream = java.import('java.io.FileInputStream');

module.exports = {
    printReport : function(req,res,next){
        var calId = req.params.calId;
        var MA_ID = req.params.MA_ID;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId, function (err) {
            if (err) console.error(err)
            else
            {
                var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

                var paramMap = new HashMap();

                paramMap.putSync("id",parseInt(MA_ID));
                paramMap.putSync("real_path","./reports/MA");

                var filePath = '.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId+'\\MA.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/MA/MedicalAssessmentReport.jasper',paramMap,con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,filePath,function(err,rs){
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else
                    {

                        res.download(filePath,'MA.pdf',function(err){
                            if(err)
                            {
                                console.log(err);
                                return;
                            }
                        });
                    }

                });
            }
        });



    },

    insertMA : function(req, res)
    {
        var info = req.body.info;
        db.docMA.create({
            PATIENT_ID: info.PATIENT_ID,
            CAL_ID: info.CAL_ID,
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
            DOCTOR_NAME : info.DOCTOR_NAME,
            SIGN: info.SIGN,
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
            DOCTOR_NAME : info.DOCTOR_NAME,
            SIGN: info.SIGN,
            Created_by: info.Created_by,
            Creation_date: info.Creation_date,
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

