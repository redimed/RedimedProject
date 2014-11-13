module.exports = function(sequelize, DataTypes){
    var gorgonUQ = sequelize.define('gorgonUQ',{
        "Quest_Id" : {type:DataTypes.INTEGER(11), primaryKey:true},
        "Patient_Id" : DataTypes.INTEGER(11),
        "TodayDate" : DataTypes.DATE,
        "Height" : DataTypes.INTEGER(11),
        "Weight" : DataTypes.INTEGER(11),
        "JobTitle": DataTypes.STRING(200),
        "PhoneNumber": DataTypes.STRING(200),
        "BestTime": DataTypes.STRING(200),
        "isReviewQuest" : DataTypes.INTEGER(11),
        "isNRP" : DataTypes.INTEGER(11),
        "isOtherType" : DataTypes.INTEGER(11),
        "isRespirator" : DataTypes.INTEGER(11),
        "RespiratorType": DataTypes.STRING(200),
        "isSmoke" : DataTypes.INTEGER(11),
        "isSeizuresCondition" : DataTypes.INTEGER(11),
        "isDiabetes" : DataTypes.INTEGER(11),
        "isAllergicReactions" : DataTypes.INTEGER(11),
        "isClaustrophobia" : DataTypes.INTEGER(11),
        "isTrouble" : DataTypes.INTEGER(11),
        "isAsbestosis" : DataTypes.INTEGER(11),
        "isAsthma" : DataTypes.INTEGER(11),
        "isBronchitis" : DataTypes.INTEGER(11),
        "isEmphysema" : DataTypes.INTEGER(11),
        "isPneumonia" : DataTypes.INTEGER(11),
        "isTuberculosis" : DataTypes.INTEGER(11),
        "isSilicosis" : DataTypes.INTEGER(11),
        "isPneumothorax" : DataTypes.INTEGER(11),
        "isLungCancer" : DataTypes.INTEGER(11),
        "isBrokenRibs" : DataTypes.INTEGER(11),
        "isInjuries" : DataTypes.INTEGER(11),
        "isOtherLung" : DataTypes.INTEGER(11),
        "OtherLungComment": DataTypes.STRING(200),
        "isSOB" : DataTypes.INTEGER(11),
        "isSOBWalkingFast" : DataTypes.INTEGER(11),
        "isSOBWalkingOther" : DataTypes.INTEGER(11),
        "isStopForBreath" : DataTypes.INTEGER(11),
        "isSOBWashing" : DataTypes.INTEGER(11),
        "isSOBInterferes" : DataTypes.INTEGER(11),
        "isCoughingPhlegm" : DataTypes.INTEGER(11),
        "isCoughingMorning" : DataTypes.INTEGER(11),
        "isCoughingLyingDown" : DataTypes.INTEGER(11),
        "isCoughingUpBlood" : DataTypes.INTEGER(11),
        "isWheezing" : DataTypes.INTEGER(11),
        "isWheezingInterferes" : DataTypes.INTEGER(11),
        "isChestPain" : DataTypes.INTEGER(11),
        "isOtherSymptomsPulmonary" : DataTypes.INTEGER(11),
        "isHeartAttack" : DataTypes.INTEGER(11),
        "isStroke" : DataTypes.INTEGER(11),
        "isAngina" : DataTypes.INTEGER(11),
        "isHeartFailure" : DataTypes.INTEGER(11),
        "isSwelling" : DataTypes.INTEGER(11),
        "isHeartArrhythmia" : DataTypes.INTEGER(11),
        "isBloodPressureHeart" : DataTypes.INTEGER(11),
        "isOtherHeart" : DataTypes.INTEGER(11),
        "OtherHeartComment": DataTypes.STRING(200),
        "isFrequentPain" : DataTypes.INTEGER(11),
        "isPOTPhysical" : DataTypes.INTEGER(11),
        "isPOTInterferes" : DataTypes.INTEGER(11),
        "isMissingBeat" : DataTypes.INTEGER(11),
        "isHeartburn" : DataTypes.INTEGER(11),
        "isOtherSymptomsHeart" : DataTypes.INTEGER(11),
        "isBreathing" : DataTypes.INTEGER(11),
        "isHeartTrouble" : DataTypes.INTEGER(11),
        "isBloodPressureMedication" : DataTypes.INTEGER(11),
        "isSeizuresMedication" : DataTypes.INTEGER(11),
        "isEyeIrritation" : DataTypes.INTEGER(11),
        "isSkinAllergies" : DataTypes.INTEGER(11),
        "isAnxiety" : DataTypes.INTEGER(11),
        "isGeneralWeakness" : DataTypes.INTEGER(11),
        "isOtherProblem" : DataTypes.INTEGER(11),
        "isTalk" : DataTypes.INTEGER(11),
        "isLostVision" : DataTypes.INTEGER(11),
        "isContactLenses" : DataTypes.INTEGER(11),
        "isWearGlasses" : DataTypes.INTEGER(11),
        "isColourBlind" : DataTypes.INTEGER(11),
        "isOtherEye" : DataTypes.INTEGER(11),
        "isInjuryEars" : DataTypes.INTEGER(11),
        "isHearingProblems" : DataTypes.INTEGER(11),
        "isDifficultyHearing" : DataTypes.INTEGER(11),
        "isHearingAid" : DataTypes.INTEGER(11),
        "isOtherHearing" : DataTypes.INTEGER(11),
        "isBackInjury" : DataTypes.INTEGER(11),
        "isWeaknessAny" : DataTypes.INTEGER(11),
        "isBackPain" : DataTypes.INTEGER(11),
        "isDFMArmsLegs" : DataTypes.INTEGER(11),
        "isDFMHead" : DataTypes.INTEGER(11),
        "isPOSLeanForward" : DataTypes.INTEGER(11),
        "isPODHead" : DataTypes.INTEGER(11),
        "isDifficultyBending" : DataTypes.INTEGER(11),
        "isDifficultySquatting" : DataTypes.INTEGER(11),
        "isClimbing" : DataTypes.INTEGER(11),
        "isOtherMuscle" : DataTypes.INTEGER(11),
        "Employee": DataTypes.STRING(200),
        "DOB" : DataTypes.DATE,
        "Department": DataTypes.STRING(200),
        "SocialSecurity": DataTypes.STRING(200),
        "Supervisor": DataTypes.STRING(200),
        "isAtmosphere" : DataTypes.INTEGER(11),
        "isContinuous" : DataTypes.INTEGER(11),
        "isOpen" : DataTypes.INTEGER(11),
        "isClose" : DataTypes.INTEGER(11),
        "isSupplied" : DataTypes.INTEGER(11),
        "isCombination" : DataTypes.INTEGER(11),
        "isAir_NonPow" : DataTypes.INTEGER(11),
        "isAir_Pow" : DataTypes.INTEGER(11),
        "LevelOfWE" : DataTypes.INTEGER(11),
        "ExtentUsage" : DataTypes.INTEGER(11),
        "LengthOfTime" : DataTypes.INTEGER(11),
        "WorkCons": DataTypes.STRING(200),
        "Safety": DataTypes.STRING(200),
        "HealthCare": DataTypes.STRING(200),
        "Class" : DataTypes.INTEGER(11),
        "Restrictions": DataTypes.STRING(250),
        "HealthCarePro": DataTypes.STRING(250),
        "UQDate" : DataTypes.DATE,
        "Created_by" : DataTypes.INTEGER(11),
        "Creation_date" : DataTypes.DATE,
        "Last_updated_by" : DataTypes.INTEGER(11),
        //"Last_update_date" : DataTypes.DATE,
        "CalId" : DataTypes.INTEGER(20),
        "DocId" : DataTypes.INTEGER(11),
        "SIGNATURE" : DataTypes.TEXT,
        "isUseRespirator" : DataTypes.INTEGER(11)
    },{
        tableName: 'userquestionnaire', // đặt tên bảng
        updatedAt : "Last_update_date"
    });
    return gorgonUQ;
};




