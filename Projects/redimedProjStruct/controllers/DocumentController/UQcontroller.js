var db = require('../../models');

module.exports = {

    insertUQ: function(req,res){
        var info = req.body.info;

        console.log(info);

        db.gorgonUQ.max('Quest_Id')
            .success(function(max){
                var id = max + 1;
                db.gorgonUQ.create({
                    Quest_Id : id,
                    Patient_Id : info.Patient_Id,
                    TodayDate: info.TodayDate,
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
                    UQDate : info.UQDate,
                    Created_by : info.Created_by,
                    Creation_date : info.Creation_date,
                    Last_updated_by : info.Last_updated_by,
                    Last_update_date : info.Last_update_date,
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
            UQDate : info.UQDate,
            Created_by : info.Created_by,
            Creation_date : info.Creation_date,
            Last_updated_by : info.Last_updated_by,
            Last_update_date : info.Last_update_date,
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