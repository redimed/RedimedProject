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
        var gorgonId = req.params.gorgonId;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId, function (err) {
            if (err) console.error(err)
            else
            {
                var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

                var paramMap = new HashMap();


                paramMap.putSync("id",parseInt(gorgonId));
                paramMap.putSync("realPath","./reports/Gorgon/" +
                "");

                var filePath = '.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId+'\\gorgonMAReport.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/Gorgon/gorgonMAReport.jasper',paramMap,con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,filePath,function(err,rs){
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else
                    {
                        res.download(filePath,'gorgonMAReport.pdf',function(err){
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

    insertMA : function(req,res){
        var info = req.body.info;
        db.gorgonMA.max('GORGON_ID')
            .success(function(max){
                var id = max + 1;
                db.gorgonMA.create({
                    GORGON_ID : id ,
                    PATIENT_ID : info.PATIENT_ID ,
                    PHOTO_ID : info.PHOTO_ID ,
                    HAND_DOR : info.HAND_DOR ,
                    HEIGHT : info.HEIGHT ,
                    WEIGHT : info.WEIGHT ,
                    PROTEIN : info.PROTEIN ,
                    GLUCOSE : info.GLUCOSE ,
                    BLOOD : info.BLOOD ,
                    CANNABIS : info.CANNABIS ,
                    OPIATES : info.OPIATES ,
                    AMPHETS : info.AMPHETS ,
                    ANCOHOL : info.ANCOHOL ,
                    BENZOS : info.BENZOS ,
                    COCAIN : info.COCAIN ,
                    METHAMPH : info.METHAMPH ,
                    AUDIOGRAM : info.AUDIOGRAM ,
                    SPIROMETRY : info.SPIROMETRY ,
                    SPIROMETRY_STATIS : info.SPIROMETRY_STATIS ,
                    CANDIDATE_EVER : info.CANDIDATE_EVER ,
                    YES_TO_EITHER : info.YES_TO_EITHER ,
                    SPI_EXAMINERS_COMMENTS : info.SPI_EXAMINERS_COMMENTS ,
                    VA_UNCORRECTED_LEFT : info.VA_UNCORRECTED_LEFT ,
                    VA_UNCORRECTED_RIGHT : info.VA_UNCORRECTED_RIGHT ,
                    VA_CORRECTED_LEFT : info.VA_CORRECTED_LEFT ,
                    VA_CORRECTED_RIGHT : info.VA_CORRECTED_RIGHT ,
                    NV_UNCORRECTED_LEFT : info.NV_UNCORRECTED_LEFT ,
                    NV_UNCORRECTED_RIGHT : info.NV_UNCORRECTED_RIGHT ,
                    NV_CORRECTED_LEFT : info.NV_CORRECTED_LEFT ,
                    NV_CORRECTED_RIGHT : info.NV_CORRECTED_RIGHT ,
                    VF_LEFT : info.VF_LEFT ,
                    VF_RIGHT : info.VF_RIGHT ,
                    ISHIHARA_RESPONSE : info.ISHIHARA_RESPONSE ,
                    SYSTOLIC_BP: info.SYSTOLIC_BP ,
                    DIASTOLIC_BP: info.DIASTOLIC_BP ,
                    PULSE: info.PULSE ,
                    HEART_RHYTHM : info.HEART_RHYTHM ,
                    HEART_SOUNDS : info.HEART_SOUNDS ,
                    PACEMAKER : info.PACEMAKER ,
                    CHEST : info.CHEST ,
                    UPPER_ZONES : info.UPPER_ZONES ,
                    LOWER_ZONES : info.LOWER_ZONES ,
                    ADDED_SOUNDS : info.ADDED_SOUNDS ,
                    EXTERNAL_CANALS : info.EXTERNAL_CANALS ,
                    TYMPANIC_MEMBRANES : info.TYMPANIC_MEMBRANES ,
                    ECZEMA : info.ECZEMA ,
                    PSORIASIS : info.PSORIASIS ,
                    TINEA : info.TINEA ,
                    SOLAR_DAMAGE : info.SOLAR_DAMAGE ,
                    FOLLICULITIS : info.FOLLICULITIS ,
                    EC_OTHER : info.EC_OTHER ,
                    SKIN_EXAMINERS_COMMENTS : info.SKIN_EXAMINERS_COMMENTS ,
                    SCARS_NIL : info.SCARS_NIL ,
                    SCARS_APPENDIX : info.SCARS_APPENDIX ,
                    SCARS_GALLBLADDER : info.SCARS_GALLBLADDER ,
                    SCARS_HERNIA : info.SCARS_HERNIA ,
                    SCARS_OTHER : info.SCARS_OTHER ,
                    HERNIAL : info.HERNIAL ,
                    HERNIAL_LEFT : info.HERNIAL_LEFT ,
                    HERNIAL_RIGHT : info.HERNIAL_RIGHT ,
                    RECTUS : info.RECTUS ,
                    MUSCLE_TONE : info.MUSCLE_TONE ,
                    MUSCLE_POWER : info.MUSCLE_POWER ,
                    MUSCLE_WASTING : info.MUSCLE_WASTING ,
                    TREMOR : info.TREMOR ,
                    GAIT : info.GAIT ,
                    LOWER_LEFT : info.LOWER_LEFT ,
                    LOWER_RIGHT : info.LOWER_RIGHT ,
                    CNS_COMMENTS : info.CNS_COMMENTS ,
                    NECK_POSTURE : info.NECK_POSTURE ,
                    NECK_RHYTHM : info.NECK_RHYTHM ,
                    NECK_FLEXION : info.NECK_FLEXION ,
                    NECK_EXTENSION : info.NECK_EXTENSION ,
                    NECK_LATERAL : info.NECK_LATERAL ,
                    NECK_ROTATION : info.NECK_ROTATION ,
                    BACK_POSTURE : info.BACK_POSTURE ,
                    BACK_RHYTHM : info.BACK_RHYTHM ,
                    BACK_FLEXION : info.BACK_FLEXION ,
                    BACK_EXTENSION : info.BACK_EXTENSION ,
                    BACK_LATERAL : info.BACK_LATERAL ,
                    BACK_ROTATION : info.BACK_ROTATION ,
                    BACK_EXAMINERS_COMMENTS : info.BACK_EXAMINERS_COMMENTS ,
                    SHOULDER : info.SHOULDER ,
                    SHOULDER_PAINFUL : info.SHOULDER_PAINFUL ,
                    ELBOWS : info.ELBOWS ,
                    ELBOWS_PAINFUL : info.ELBOWS_PAINFUL ,
                    WRISTS : info.WRISTS ,
                    WRISTS_PAINFUL : info.WRISTS_PAINFUL ,
                    KNEES : info.KNEES ,
                    KNEES_PAINFUL : info.KNEES_PAINFUL ,
                    ANKLES : info.ANKLES ,
                    ANKLES_PAINFUL : info.ANKLES_PAINFUL ,
                    GRIP_STRENGTH : info.GRIP_STRENGTH ,
                    EPICONDYLES : info.EPICONDYLES ,
                    HEEL_WALK : info.HEEL_WALK ,
                    DUCK_WALK : info.DUCK_WALK ,
                    TOE_WALK : info.TOE_WALK ,
                    RHOMBERGS : info.RHOMBERGS ,
                    FUTHER_COMMENTS : info.FUTHER_COMMENTS ,
                    LIMB_EXAMINERS_COMMENTS : info.LIMB_EXAMINERS_COMMENTS ,
                    GORGON_DATE: info.GORGON_DATE ,
                    SIGNATURE: info.SIGNATURE ,
                    Created_by : info.Created_by ,
                    //Creation_date: info.Creation_date ,
                    Last_updated_by : info.Last_updated_by ,
                    //Last_update_date: info.Last_update_date ,
                    CalId : info.CalId ,
                    DocId : info.DocId ,
                    EXAMINER_NAME: info.EXAMINER_NAME ,
                    EXAMINER_ADDRESS: info.EXAMINER_ADDRESS ,
                    RIGHT_EAR_500 : info.RIGHT_EAR_500 ,
                    RIGHT_EAR_1000 : info.RIGHT_EAR_1000 ,
                    RIGHT_EAR_1500 : info.RIGHT_EAR_1500 ,
                    RIGHT_EAR_2000 : info.RIGHT_EAR_2000 ,
                    RIGHT_EAR_3000 : info.RIGHT_EAR_3000 ,
                    RIGHT_EAR_4000 : info.RIGHT_EAR_4000 ,
                    RIGHT_EAR_6000 : info.RIGHT_EAR_6000 ,
                    RIGHT_EAR_8000 : info.RIGHT_EAR_8000 ,
                    LEFT_EAR_500 : info.LEFT_EAR_500 ,
                    LEFT_EAR_1000 : info.LEFT_EAR_1000 ,
                    LEFT_EAR_1500 : info.LEFT_EAR_1500 ,
                    LEFT_EAR_2000 : info.LEFT_EAR_2000 ,
                    LEFT_EAR_3000 : info.LEFT_EAR_3000 ,
                    LEFT_EAR_4000 : info.LEFT_EAR_4000 ,
                    LEFT_EAR_6000 : info.LEFT_EAR_6000 ,
                    LEFT_EAR_8000 : info.LEFT_EAR_8000 ,
                    PRE_BR1_V1 : info.PRE_BR1_V1 ,
                    PRE_BR1_V2 : info.PRE_BR1_V2 ,
                    PRE_BR1_V3 : info.PRE_BR1_V3 ,
                    PRE_BR1_V4 : info.PRE_BR1_V4 ,
                    PRE_BR1_V5 : info.PRE_BR1_V5 ,
                    PRE_BR1_V6 : info.PRE_BR1_V6 ,
                    PRE_BR1_V7 : info.PRE_BR1_V7 ,
                    PRE_BR2_V1 : info.PRE_BR2_V1 ,
                    PRE_BR2_V2 : info.PRE_BR2_V2 ,
                    PRE_BR2_V3 : info.PRE_BR2_V3 ,
                    PRE_BR2_V4 : info.PRE_BR2_V4 ,
                    PRE_BR2_V5 : info.PRE_BR2_V5 ,
                    PRE_BR2_V6 : info.PRE_BR2_V6 ,
                    PRE_BR2_V7 : info.PRE_BR2_V7 ,
                    PROTEIN_COMMENT : info.PROTEIN_COMMENT ,
                    GLUCOSE_COMMENT : info.GLUCOSE_COMMENT ,
                    BLOOD_COMMENT : info.BLOOD_COMMENT

                },{raw:true})
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })
            }).error(function(err){
                console.log(err);
            })

    },
    editMA: function(req,res){
        var info = req.body.info;
                db.gorgonMA.update({
                    PHOTO_ID : info.PHOTO_ID ,
                    HAND_DOR : info.HAND_DOR ,
                    HEIGHT : info.HEIGHT ,
                    WEIGHT : info.WEIGHT ,
                    PROTEIN : info.PROTEIN ,
                    GLUCOSE : info.GLUCOSE ,
                    BLOOD : info.BLOOD ,
                    CANNABIS : info.CANNABIS ,
                    OPIATES : info.OPIATES ,
                    AMPHETS : info.AMPHETS ,
                    ANCOHOL : info.ANCOHOL ,
                    BENZOS : info.BENZOS ,
                    COCAIN : info.COCAIN ,
                    METHAMPH : info.METHAMPH ,
                    AUDIOGRAM : info.AUDIOGRAM ,
                    SPIROMETRY : info.SPIROMETRY ,
                    SPIROMETRY_STATIS : info.SPIROMETRY_STATIS ,
                    CANDIDATE_EVER : info.CANDIDATE_EVER ,
                    YES_TO_EITHER : info.YES_TO_EITHER ,
                    SPI_EXAMINERS_COMMENTS : info.SPI_EXAMINERS_COMMENTS ,
                    VA_UNCORRECTED_LEFT : info.VA_UNCORRECTED_LEFT ,
                    VA_UNCORRECTED_RIGHT : info.VA_UNCORRECTED_RIGHT ,
                    VA_CORRECTED_LEFT : info.VA_CORRECTED_LEFT ,
                    VA_CORRECTED_RIGHT : info.VA_CORRECTED_RIGHT ,
                    NV_UNCORRECTED_LEFT : info.NV_UNCORRECTED_LEFT ,
                    NV_UNCORRECTED_RIGHT : info.NV_UNCORRECTED_RIGHT ,
                    NV_CORRECTED_LEFT : info.NV_CORRECTED_LEFT ,
                    NV_CORRECTED_RIGHT : info.NV_CORRECTED_RIGHT ,
                    VF_LEFT : info.VF_LEFT ,
                    VF_RIGHT : info.VF_RIGHT ,
                    ISHIHARA_RESPONSE : info.ISHIHARA_RESPONSE ,
                    SYSTOLIC_BP: info.SYSTOLIC_BP ,
                    DIASTOLIC_BP: info.DIASTOLIC_BP ,
                    PULSE: info.PULSE ,
                    HEART_RHYTHM : info.HEART_RHYTHM ,
                    HEART_SOUNDS : info.HEART_SOUNDS ,
                    PACEMAKER : info.PACEMAKER ,
                    CHEST : info.CHEST ,
                    UPPER_ZONES : info.UPPER_ZONES ,
                    LOWER_ZONES : info.LOWER_ZONES ,
                    ADDED_SOUNDS : info.ADDED_SOUNDS ,
                    EXTERNAL_CANALS : info.EXTERNAL_CANALS ,
                    TYMPANIC_MEMBRANES : info.TYMPANIC_MEMBRANES ,
                    ECZEMA : info.ECZEMA ,
                    PSORIASIS : info.PSORIASIS ,
                    TINEA : info.TINEA ,
                    SOLAR_DAMAGE : info.SOLAR_DAMAGE ,
                    FOLLICULITIS : info.FOLLICULITIS ,
                    EC_OTHER : info.EC_OTHER ,
                    SKIN_EXAMINERS_COMMENTS : info.SKIN_EXAMINERS_COMMENTS ,
                    SCARS_NIL : info.SCARS_NIL ,
                    SCARS_APPENDIX : info.SCARS_APPENDIX ,
                    SCARS_GALLBLADDER : info.SCARS_GALLBLADDER ,
                    SCARS_HERNIA : info.SCARS_HERNIA ,
                    SCARS_OTHER : info.SCARS_OTHER ,
                    HERNIAL : info.HERNIAL ,
                    HERNIAL_LEFT : info.HERNIAL_LEFT ,
                    HERNIAL_RIGHT : info.HERNIAL_RIGHT ,
                    RECTUS : info.RECTUS ,
                    MUSCLE_TONE : info.MUSCLE_TONE ,
                    MUSCLE_POWER : info.MUSCLE_POWER ,
                    MUSCLE_WASTING : info.MUSCLE_WASTING ,
                    TREMOR : info.TREMOR ,
                    GAIT : info.GAIT ,
                    LOWER_LEFT : info.LOWER_LEFT ,
                    LOWER_RIGHT : info.LOWER_RIGHT ,
                    CNS_COMMENTS : info.CNS_COMMENTS ,
                    NECK_POSTURE : info.NECK_POSTURE ,
                    NECK_RHYTHM : info.NECK_RHYTHM ,
                    NECK_FLEXION : info.NECK_FLEXION ,
                    NECK_EXTENSION : info.NECK_EXTENSION ,
                    NECK_LATERAL : info.NECK_LATERAL ,
                    NECK_ROTATION : info.NECK_ROTATION ,
                    BACK_POSTURE : info.BACK_POSTURE ,
                    BACK_RHYTHM : info.BACK_RHYTHM ,
                    BACK_FLEXION : info.BACK_FLEXION ,
                    BACK_EXTENSION : info.BACK_EXTENSION ,
                    BACK_LATERAL : info.BACK_LATERAL ,
                    BACK_ROTATION : info.BACK_ROTATION ,
                    BACK_EXAMINERS_COMMENTS : info.BACK_EXAMINERS_COMMENTS ,
                    SHOULDER : info.SHOULDER ,
                    SHOULDER_PAINFUL : info.SHOULDER_PAINFUL ,
                    ELBOWS : info.ELBOWS ,
                    ELBOWS_PAINFUL : info.ELBOWS_PAINFUL ,
                    WRISTS : info.WRISTS ,
                    WRISTS_PAINFUL : info.WRISTS_PAINFUL ,
                    KNEES : info.KNEES ,
                    KNEES_PAINFUL : info.KNEES_PAINFUL ,
                    ANKLES : info.ANKLES ,
                    ANKLES_PAINFUL : info.ANKLES_PAINFUL ,
                    GRIP_STRENGTH : info.GRIP_STRENGTH ,
                    EPICONDYLES : info.EPICONDYLES ,
                    HEEL_WALK : info.HEEL_WALK ,
                    DUCK_WALK : info.DUCK_WALK ,
                    TOE_WALK : info.TOE_WALK ,
                    RHOMBERGS : info.RHOMBERGS ,
                    FUTHER_COMMENTS : info.FUTHER_COMMENTS ,
                    LIMB_EXAMINERS_COMMENTS : info.LIMB_EXAMINERS_COMMENTS ,
                    GORGON_DATE: info.GORGON_DATE ,
                    SIGNATURE: info.SIGNATURE ,
                    Created_by : info.Created_by ,
                    //Creation_date: info.Creation_date ,
                    Last_updated_by : info.Last_updated_by ,
                    //Last_update_date: info.Last_update_date ,
                    EXAMINER_NAME: info.EXAMINER_NAME ,
                    EXAMINER_ADDRESS: info.EXAMINER_ADDRESS ,
                    RIGHT_EAR_500 : info.RIGHT_EAR_500 ,
                    RIGHT_EAR_1000 : info.RIGHT_EAR_1000 ,
                    RIGHT_EAR_1500 : info.RIGHT_EAR_1500 ,
                    RIGHT_EAR_2000 : info.RIGHT_EAR_2000 ,
                    RIGHT_EAR_3000 : info.RIGHT_EAR_3000 ,
                    RIGHT_EAR_4000 : info.RIGHT_EAR_4000 ,
                    RIGHT_EAR_6000 : info.RIGHT_EAR_6000 ,
                    RIGHT_EAR_8000 : info.RIGHT_EAR_8000 ,
                    LEFT_EAR_500 : info.LEFT_EAR_500 ,
                    LEFT_EAR_1000 : info.LEFT_EAR_1000 ,
                    LEFT_EAR_1500 : info.LEFT_EAR_1500 ,
                    LEFT_EAR_2000 : info.LEFT_EAR_2000 ,
                    LEFT_EAR_3000 : info.LEFT_EAR_3000 ,
                    LEFT_EAR_4000 : info.LEFT_EAR_4000 ,
                    LEFT_EAR_6000 : info.LEFT_EAR_6000 ,
                    LEFT_EAR_8000 : info.LEFT_EAR_8000 ,
                    PRE_BR1_V1 : info.PRE_BR1_V1 ,
                    PRE_BR1_V2 : info.PRE_BR1_V2 ,
                    PRE_BR1_V3 : info.PRE_BR1_V3 ,
                    PRE_BR1_V4 : info.PRE_BR1_V4 ,
                    PRE_BR1_V5 : info.PRE_BR1_V5 ,
                    PRE_BR1_V6 : info.PRE_BR1_V6 ,
                    PRE_BR1_V7 : info.PRE_BR1_V7 ,
                    PRE_BR2_V1 : info.PRE_BR2_V1 ,
                    PRE_BR2_V2 : info.PRE_BR2_V2 ,
                    PRE_BR2_V3 : info.PRE_BR2_V3 ,
                    PRE_BR2_V4 : info.PRE_BR2_V4 ,
                    PRE_BR2_V5 : info.PRE_BR2_V5 ,
                    PRE_BR2_V6 : info.PRE_BR2_V6 ,
                    PRE_BR2_V7 : info.PRE_BR2_V7 ,
                    PROTEIN_COMMENT : info.PROTEIN_COMMENT ,
                    GLUCOSE_COMMENT : info.GLUCOSE_COMMENT ,
                    BLOOD_COMMENT : info.BLOOD_COMMENT

                },{GORGON_ID : info.GORGON_ID})
                    .success(function(data){
                        res.json({status:'success'});
                    })
                    .error(function(err){
                        res.json({status:'error'});
                        console.log(err);
                    })


    },

    checkGorgonMA: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.gorgonMA.find({where:{PATIENT_ID:Patient_Id,CalId : CalId}})
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