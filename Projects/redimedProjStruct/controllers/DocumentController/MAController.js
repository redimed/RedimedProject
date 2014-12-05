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

                paramMap.putSync("cal_id",parseInt(calId));
                paramMap.putSync("patient_id",parseInt(patientId));
                paramMap.putSync("key",parseInt(MA_ID));
                paramMap.putSync("real_path","./reports/MA");
                paramMap.putSync("SUBREPORT_DIR","./reports/MA");

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
        var infoL = req.body.infoL;
        var infoH = req.body.infoH;

        db.sequelize.query("INSERT INTO `cln_ma_headers` (Patient_id,CAL_ID,MA_ID,DF_CODE,ISENABLE, DESCRIPTION, Creation_date) SELECT ?,?,h.QUEST_DF_ID,h.`DF_CODE`,h.`ISENABLE`,h.DESCRIPTION,?  FROM `sys_ma_df_headers` h;",null,{raw:true},[infoH.Patient_id,infoH.CAL_ID, new Date()]).success(function(){
            db.sequelize.query("INSERT INTO `cln_ma_group` (PATIENT_ID, CAL_ID, GROUP_ID, GROUP_NAME, MA_ID,USER_TYPE,ISENABLE) SELECT ?,?,g.`GROUP_ID`, g.`GROUP_NAME`,g.`QUEST_DF_ID`,g.`USER_TYPE`,g.`ISENABLE` FROM `sys_ma_df_group` g;",null,{raw:true},[infoH.Patient_id,infoH.CAL_ID]).success(function(){
                db.sequelize.query("INSERT INTO `cln_ma_lines` (PATIENT_ID,CAL_ID,MA_LINE_ID,QUESTION,VAL1_NAME,VAL2_NAME,YES_NO,ORD,GROUP_ID,ISENABLE, Creation_date) SELECT ?,?,l.MA_LINE_ID, l.QUESTION, l.VAL1_NAME, l.VAL2_NAME, l.YES_NO, l.ORD, l.GROUP_ID,l.ISENABLE,? FROM `sys_ma_df_lines` l;",null,{raw:true},[infoH.Patient_id,infoH.CAL_ID, new Date()]).success(function(){
                    submitMA(res,infoH,infoL);
                });
            });
        }).error(function(err){
            res.json({status:"fail"});
        });
    },

    updateMA : function(req, res)
    {
        var infoL = req.body.infoL;
        var infoH = req.body.infoH;
        submitMA(res,infoH,infoL);
    },

    checkMA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;
        db.HeaderMA.find({where:{Patient_id:Patient_Id,CAL_ID : CalId}})
            .success(function(data){
                if(data == null)
                {
                    loadNewMA(res);
                }else
                {
                    loadMA(res,Patient_Id,CalId);
                }
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    }

};

var loadNewMA = function(res){
    var data = [];
    sequelize.transaction(function(t) {
        db.sysHeaderMA.findAll({where : {ISENABLE : 1}},{transaction: t})
            .success(function(dataH){
                db.sysGroupMA.findAll({where : {ISENABLE : 1}},{transaction: t})
                    .success(function(dataG){
                        db.sysLineMA.findAll({where : {ISENABLE : 1}, order : 'ORD'},{transaction: t})
                            .success(function(dataL){
                                data = [{"Header": dataH, "Group" : dataG,"Line": dataL}];
                                res.json({status:"new",data:data});
                            })
                    })
            })
            .error(function(err){
                t.rollback().success(function() {
                    res.json({status:'error'});
                })
                console.log(err);
            })})
};

var loadMA = function(res,idP, idC){
    var data = [];
    sequelize.transaction(function(t) {
        db.HeaderMA.findAll({where : {ISENABLE : 1,Patient_id : idP,CAL_ID: idC}},{transaction: t})
            .success(function(dataH){
                db.GroupMA.findAll({where : {ISENABLE : 1,PATIENT_ID : idP,CAL_ID: idC}},{transaction: t})
                    .success(function(dataG){
                        db.LineMA.findAll({where : {ISENABLE : 1,PATIENT_ID : idP,CAL_ID: idC}, order : 'ORD'},{transaction: t})
                            .success(function(dataL){
                                data = [{"Header": dataH, "Group" : dataG,"Line": dataL}];
                                res.json({status:"update",data:data});
                            })
                    })
            })
            .error(function(err){
                t.rollback().success(function() {
                    res.json({status:'error'});
                })
                console.log(err);
            })})
};

var submitMA = function(res,infoH,infoL){
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
};

