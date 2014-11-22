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
        var id = req.params.id;
        var patientId = req.params.patientId;

        mkdirp('.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId, function (err) {
            if (err) console.error(err)
            else
            {
                var con = java.callStaticMethodSync('java.sql.DriverManager','getConnection',"jdbc:mysql://localhost:3306/sakila","root","root");

                var paramMap = new HashMap();

                paramMap.putSync("id",parseInt(id));
                paramMap.putSync("realPath","./reports/Gorgon");

                var filePath = '.\\download\\report\\'+'patientID_'+patientId+'\\calID_'+calId+'\\UQ.pdf';

                var jPrint = java.callStaticMethodSync('net.sf.jasperreports.engine.JasperFillManager','fillReport','./reports/Gorgon/UserQuestionnaireReport.jasper',paramMap,con);

                java.callStaticMethod('net.sf.jasperreports.engine.JasperExportManager','exportReportToPdfFile',jPrint,filePath,function(err,rs){
                    if(err)
                    {
                        console.log(err);
                        return;
                    }
                    else
                    {

                        res.download(filePath,'UQ.pdf',function(err){
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

    insertUQ: function(req,res){
        var info = req.body.info;

        console.log(info);

        db.gorgonUQ.max('Quest_Id')
            .success(function(max){
                var id = max + 1;
                db.gorgonUQ.create({
                    Quest_Id : id,
                    Patient_Id : info.Patient_Id,
                    TodayDate: new Date(),
                    Height : info.Height,
                    Weight :   info.Weight,
                    JobTitle : info.JobTitle,
                    PhoneNumber : info.PhoneNumber,
                    BestTime : info.BestTime,
                    isReviewQuest : info.isReviewQuest,
                    isNRP : info.isNRP,
                    isOtherType : info.isOtherType,
                    isRespirator : info.isRespirator,
                    RespiratorType : info.RespiratorType,
                    isSmoke : info.isSmoke,
                    isSeizuresCondition : info.isSeizuresCondition,
                    isDiabetes : info.isDiabetes,
                    isAllergicReactions : info.isAllergicReactions,
                    isClaustrophobia : info.isClaustrophobia,
                    isTrouble : info.isTrouble,
                    isAsbestosis : info.isAsbestosis,
                    isAsthma : info.isAsthma,
                    isBronchitis : info.isBronchitis,
                    isEmphysema : info.isEmphysema,
                    isPneumonia : info.isPneumonia,
                    isTuberculosis : info.isTuberculosis,
                    isSilicosis : info.isSilicosis,
                    isPneumothorax : info.isPneumothorax,
                    isLungCancer : info.isLungCancer,
                    isBrokenRibs : info.isBrokenRibs,
                    isInjuries : info.isInjuries,
                    isOtherLung : info.isOtherLung,
                    OtherLungComment : info.OtherLungComment,
                    isSOB : info.isSOB,
                    isSOBWalkingFast : info.isSOBWalkingFast,
                    isSOBWalkingOther : info.isSOBWalkingOther,
                    isStopForBreath : info.isStopForBreath,
                    isSOBWashing : info.isSOBWashing,
                    isSOBInterferes : info.isSOBInterferes,
                    isCoughingPhlegm : info.isCoughingPhlegm,
                    isCoughingMorning : info.isCoughingMorning,
                    isCoughingLyingDown : info.isCoughingLyingDown,
                    isCoughingUpBlood : info.isCoughingUpBlood,
                    isWheezing : info.isWheezing,
                    isWheezingInterferes : info.isWheezingInterferes,
                    isChestPain : info.isChestPain,
                    isOtherSymptomsPulmonary : info.isOtherSymptomsPulmonary,
                    isHeartAttack : info.isHeartAttack,
                    isStroke : info.isStroke,
                    isAngina : info.isAngina,
                    isHeartFailure : info.isHeartFailure,
                    isSwelling : info.isSwelling,
                    isHeartArrhythmia : info.isHeartArrhythmia,
                    isBloodPressureHeart : info.isBloodPressureHeart,
                    isOtherHeart : info.isOtherHeart,
                    OtherHeartComment : info.OtherHeartComment,
                    isFrequentPain : info.isFrequentPain,
                    isPOTPhysical : info.isPOTPhysical,
                    isPOTInterferes : info.isPOTInterferes,
                    isMissingBeat : info.isMissingBeat,
                    isHeartburn : info.isHeartburn,
                    isOtherSymptomsHeart : info.isOtherSymptomsHeart,
                    isBreathing : info.isBreathing,
                    isHeartTrouble : info.isHeartTrouble,
                    isBloodPressureMedication : info.isBloodPressureMedication,
                    isSeizuresMedication : info.isSeizuresMedication,
                    isEyeIrritation : info.isEyeIrritation,
                    isSkinAllergies : info.isSkinAllergies,
                    isAnxiety : info.isAnxiety,
                    isGeneralWeakness : info.isGeneralWeakness,
                    isOtherProblem : info.isOtherProblem,
                    isTalk : info.isTalk,
                    isLostVision : info.isLostVision,
                    isContactLenses : info.isContactLenses,
                    isWearGlasses : info.isWearGlasses,
                    isColourBlind : info.isColourBlind,
                    isOtherEye : info.isOtherEye,
                    isInjuryEars : info.isInjuryEars,
                    isHearingProblems : info.isHearingProblems,
                    isDifficultyHearing : info.isDifficultyHearing,
                    isHearingAid : info.isHearingAid,
                    isOtherHearing : info.isOtherHearing,
                    isBackInjury : info.isBackInjury,
                    isWeaknessAny : info.isWeaknessAny,
                    isBackPain : info.isBackPain,
                    isDFMArmsLegs : info.isDFMArmsLegs,
                    isDFMHead : info.isDFMHead,
                    isPOSLeanForward : info.isPOSLeanForward,
                    isPODHead : info.isPODHead,
                    isDifficultyBending : info.isDifficultyBending,
                    isDifficultySquatting : info.isDifficultySquatting,
                    isClimbing : info.isClimbing,
                    isOtherMuscle : info.isOtherMuscle,
                    Employee : info.Employee,
                    DOB : info.DOB,
                    Department : info.Department,
                    SocialSecurity : info.SocialSecurity,
                    Supervisor : info.Supervisor,
                    isAtmosphere : info.isAtmosphere,
                    isContinuous : info.isContinuous,
                    isOpen : info.isOpen,
                    isClose : info.isClose,
                    isSupplied : info.isSupplied,
                    isCombination : info.isCombination,
                    isAir_NonPow : info.isAir_NonPow,
                    isAir_Pow : info.isAir_Pow,
                    LevelOfWE : info.LevelOfWE,
                    ExtentUsage : info.ExtentUsage,
                    LengthOfTime : info.LengthOfTime,
                    WorkCons : info.WorkCons,
                    Safety : info.Safety,
                    HealthCare : info.HealthCare,
                    Class : info.Class,
                    Restrictions : info.Restrictions,
                    HealthCarePro : info.HealthCarePro,
                    UQDate : new Date(),
                    Created_by : info.Created_by,
                    Last_updated_by : info.Last_updated_by,
                    CalId: info.CalId,
                    DocId : info.DocId,
                    SIGNATURE : info.SIGNATURE,
                    isUseRespirator : info.isUseRespirator
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

    updateUQ: function(req,res){
        var info = req.body.info;
        db.gorgonUQ.update({
            Height : info.Height,
            Weight :   info.Weight,
            JobTitle : info.JobTitle,
            PhoneNumber : info.PhoneNumber,
            BestTime : info.BestTime,
            isReviewQuest : info.isReviewQuest,
            isNRP : info.isNRP,
            isOtherType : info.isOtherType,
            isRespirator : info.isRespirator,
            RespiratorType : info.RespiratorType,
            isSmoke : info.isSmoke,
            isSeizuresCondition : info.isSeizuresCondition,
            isDiabetes : info.isDiabetes,
            isAllergicReactions : info.isAllergicReactions,
            isClaustrophobia : info.isClaustrophobia,
            isTrouble : info.isTrouble,
            isAsbestosis : info.isAsbestosis,
            isAsthma : info.isAsthma,
            isBronchitis : info.isBronchitis,
            isEmphysema : info.isEmphysema,
            isPneumonia : info.isPneumonia,
            isTuberculosis : info.isTuberculosis,
            isSilicosis : info.isSilicosis,
            isPneumothorax : info.isPneumothorax,
            isLungCancer : info.isLungCancer,
            isBrokenRibs : info.isBrokenRibs,
            isInjuries : info.isInjuries,
            isOtherLung : info.isOtherLung,
            OtherLungComment : info.OtherLungComment,
            isSOB : info.isSOB,
            isSOBWalkingFast : info.isSOBWalkingFast,
            isSOBWalkingOther : info.isSOBWalkingOther,
            isStopForBreath : info.isStopForBreath,
            isSOBWashing : info.isSOBWashing,
            isSOBInterferes : info.isSOBInterferes,
            isCoughingPhlegm : info.isCoughingPhlegm,
            isCoughingMorning : info.isCoughingMorning,
            isCoughingLyingDown : info.isCoughingLyingDown,
            isCoughingUpBlood : info.isCoughingUpBlood,
            isWheezing : info.isWheezing,
            isWheezingInterferes : info.isWheezingInterferes,
            isChestPain : info.isChestPain,
            isOtherSymptomsPulmonary : info.isOtherSymptomsPulmonary,
            isHeartAttack : info.isHeartAttack,
            isStroke : info.isStroke,
            isAngina : info.isAngina,
            isHeartFailure : info.isHeartFailure,
            isSwelling : info.isSwelling,
            isHeartArrhythmia : info.isHeartArrhythmia,
            isBloodPressureHeart : info.isBloodPressureHeart,
            isOtherHeart : info.isOtherHeart,
            OtherHeartComment : info.OtherHeartComment,
            isFrequentPain : info.isFrequentPain,
            isPOTPhysical : info.isPOTPhysical,
            isPOTInterferes : info.isPOTInterferes,
            isMissingBeat : info.isMissingBeat,
            isHeartburn : info.isHeartburn,
            isOtherSymptomsHeart : info.isOtherSymptomsHeart,
            isBreathing : info.isBreathing,
            isHeartTrouble : info.isHeartTrouble,
            isBloodPressureMedication : info.isBloodPressureMedication,
            isSeizuresMedication : info.isSeizuresMedication,
            isEyeIrritation : info.isEyeIrritation,
            isSkinAllergies : info.isSkinAllergies,
            isAnxiety : info.isAnxiety,
            isGeneralWeakness : info.isGeneralWeakness,
            isOtherProblem : info.isOtherProblem,
            isTalk : info.isTalk,
            isLostVision : info.isLostVision,
            isContactLenses : info.isContactLenses,
            isWearGlasses : info.isWearGlasses,
            isColourBlind : info.isColourBlind,
            isOtherEye : info.isOtherEye,
            isInjuryEars : info.isInjuryEars,
            isHearingProblems : info.isHearingProblems,
            isDifficultyHearing : info.isDifficultyHearing,
            isHearingAid : info.isHearingAid,
            isOtherHearing : info.isOtherHearing,
            isBackInjury : info.isBackInjury,
            isWeaknessAny : info.isWeaknessAny,
            isBackPain : info.isBackPain,
            isDFMArmsLegs : info.isDFMArmsLegs,
            isDFMHead : info.isDFMHead,
            isPOSLeanForward : info.isPOSLeanForward,
            isPODHead : info.isPODHead,
            isDifficultyBending : info.isDifficultyBending,
            isDifficultySquatting : info.isDifficultySquatting,
            isClimbing : info.isClimbing,
            isOtherMuscle : info.isOtherMuscle,
            Employee : info.Employee,
            DOB : info.DOB,
            Department : info.Department,
            SocialSecurity : info.SocialSecurity,
            Supervisor : info.Supervisor,
            isAtmosphere : info.isAtmosphere,
            isContinuous : info.isContinuous,
            isOpen : info.isOpen,
            isClose : info.isClose,
            isSupplied : info.isSupplied,
            isCombination : info.isCombination,
            isAir_NonPow : info.isAir_NonPow,
            isAir_Pow : info.isAir_Pow,
            LevelOfWE : info.LevelOfWE,
            ExtentUsage : info.ExtentUsage,
            LengthOfTime : info.LengthOfTime,
            WorkCons : info.WorkCons,
            Safety : info.Safety,
            HealthCare : info.HealthCare,
            Class : info.Class,
            Restrictions : info.Restrictions,
            HealthCarePro : info.HealthCarePro,
            UQDate : new Date(),
            Created_by : info.Created_by,
            Last_updated_by : info.Last_updated_by,
            CalId: info.CalId,
            DocId : info.DocId,
            SIGNATURE : info.SIGNATURE,
            isUseRespirator : info.isUseRespirator
        },{Quest_Id : info.Quest_Id},{raw:true})
            .success(function(data){
                res.json({status:'success'});
            })
            .error(function(err){
                res.json({status:'error'});
                console.log(err);
            })
    },

    checkUser: function(req,res){
        var Patient_Id = req.body.PatientID;
        var CalId = req.body.calID;

        db.gorgonUQ.find({where:{Patient_Id:Patient_Id,CalId : CalId}})
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