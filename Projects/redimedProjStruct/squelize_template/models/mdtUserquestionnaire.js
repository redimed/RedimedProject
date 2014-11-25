module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtUserquestionnaire", {
            'Quest_Id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Patient_Id': { 
    type: DataTypes.INTEGER(11),  
            },
            'TodayDate': { 
    type: DataTypes.DATE,  
                defaultValue: DataTypes.NOW,
        },
            'Height': { 
    type: DataTypes.INTEGER(11),  
            },
            'Weight': { 
    type: DataTypes.INTEGER(11),  
            },
            'JobTitle': { 
    type: DataTypes.STRING(200),  
            },
            'PhoneNumber': { 
    type: DataTypes.STRING(200),  
            },
            'BestTime': { 
    type: DataTypes.STRING(200),  
            },
            'isReviewQuest': { 
    type: DataTypes.INTEGER(11),  
            },
            'isNRP': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherType': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRespirator': { 
    type: DataTypes.INTEGER(11),  
            },
            'RespiratorType': { 
    type: DataTypes.STRING(200),  
            },
            'isSmoke': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSeizuresCondition': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDiabetes': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAllergicReactions': { 
    type: DataTypes.INTEGER(11),  
            },
            'isClaustrophobia': { 
    type: DataTypes.INTEGER(11),  
            },
            'isTrouble': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAsbestosis': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAsthma': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBronchitis': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEmphysema': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPneumonia': { 
    type: DataTypes.INTEGER(11),  
            },
            'isTuberculosis': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSilicosis': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPneumothorax': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLungCancer': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBrokenRibs': { 
    type: DataTypes.INTEGER(11),  
            },
            'isInjuries': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherLung': { 
    type: DataTypes.INTEGER(11),  
            },
            'OtherLungComment': { 
    type: DataTypes.STRING(200),  
            },
            'isSOB': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSOBWalkingFast': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSOBWalkingOther': { 
    type: DataTypes.INTEGER(11),  
            },
            'isStopForBreath': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSOBWashing': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSOBInterferes': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCoughingPhlegm': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCoughingMorning': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCoughingLyingDown': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCoughingUpBlood': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWheezing': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWheezingInterferes': { 
    type: DataTypes.INTEGER(11),  
            },
            'isChestPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherSymptomsPulmonary': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeartAttack': { 
    type: DataTypes.INTEGER(11),  
            },
            'isStroke': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAngina': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeartFailure': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSwelling': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeartArrhythmia': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBloodPressureHeart': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherHeart': { 
    type: DataTypes.INTEGER(11),  
            },
            'OtherHeartComment': { 
    type: DataTypes.STRING(200),  
            },
            'isFrequentPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPOTPhysical': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPOTInterferes': { 
    type: DataTypes.INTEGER(11),  
            },
            'isMissingBeat': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeartburn': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherSymptomsHeart': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBreathing': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeartTrouble': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBloodPressureMedication': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSeizuresMedication': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEyeIrritation': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSkinAllergies': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAnxiety': { 
    type: DataTypes.INTEGER(11),  
            },
            'isGeneralWeakness': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherProblem': { 
    type: DataTypes.INTEGER(11),  
            },
            'isTalk': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLostVision': { 
    type: DataTypes.INTEGER(11),  
            },
            'isContactLenses': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWearGlasses': { 
    type: DataTypes.INTEGER(11),  
            },
            'isColourBlind': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherEye': { 
    type: DataTypes.INTEGER(11),  
            },
            'isInjuryEars': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHearingProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDifficultyHearing': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHearingAid': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherHearing': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBackInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWeaknessAny': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBackPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDFMArmsLegs': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDFMHead': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPOSLeanForward': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPODHead': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDifficultyBending': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDifficultySquatting': { 
    type: DataTypes.INTEGER(11),  
            },
            'isClimbing': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOtherMuscle': { 
    type: DataTypes.INTEGER(11),  
            },
            'Employee': { 
    type: DataTypes.STRING(200),  
            },
            'DOB': { 
    type: DataTypes.DATE,  
            },
            'Department': { 
    type: DataTypes.STRING(200),  
            },
            'SocialSecurity': { 
    type: DataTypes.STRING(200),  
            },
            'Supervisor': { 
    type: DataTypes.STRING(200),  
            },
            'isAtmosphere': { 
    type: DataTypes.INTEGER(11),  
            },
            'isContinuous': { 
    type: DataTypes.INTEGER(11),  
            },
            'isOpen': { 
    type: DataTypes.INTEGER(11),  
            },
            'isClose': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSupplied': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCombination': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAir_NonPow': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAir_Pow': { 
    type: DataTypes.INTEGER(11),  
            },
            'LevelOfWE': { 
    type: DataTypes.INTEGER(11),  
            },
            'ExtentUsage': { 
    type: DataTypes.INTEGER(11),  
            },
            'LengthOfTime': { 
    type: DataTypes.INTEGER(11),  
            },
            'WorkCons': { 
    type: DataTypes.STRING(200),  
            },
            'Safety': { 
    type: DataTypes.STRING(200),  
            },
            'HealthCare': { 
    type: DataTypes.STRING(200),  
            },
            'Class': { 
    type: DataTypes.INTEGER(11),  
            },
            'Restrictions': { 
    type: DataTypes.STRING(250),  
            },
            'HealthCarePro': { 
    type: DataTypes.STRING(250),  
            },
            'UQDate': { 
    type: DataTypes.DATE,  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
                'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
                    'CalId': { 
    type: DataTypes.BIGINT(20),  
            },
            'DocId': { 
    type: DataTypes.INTEGER(11),  
            },
            'SIGNATURE': { 
    type: DataTypes.BLOB,  
            },
            'isUseRespirator': { 
    type: DataTypes.INTEGER(11),  
            },
}, {
tableName: "userquestionnaire",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}