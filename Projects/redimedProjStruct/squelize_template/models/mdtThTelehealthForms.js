module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThTelehealthForms", {
            'Id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'isWorkRelated': { 
    type: DataTypes.INTEGER(11),  
            },
            'isTraumaConsult': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFirstMedicalCertificate': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFollowupInPerth': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFitnessForWork': { 
    type: DataTypes.INTEGER(11),  
            },
            'isInitialTelehealthConsult': { 
    type: DataTypes.INTEGER(11),  
            },
            'isProgressTelehealthConsult': { 
    type: DataTypes.INTEGER(11),  
            },
            'isTransportAirPort': { 
    type: DataTypes.INTEGER(11),  
            },
            'Salutation': { 
    type: DataTypes.STRING(10),  
            },
            'DOB': { 
    type: DataTypes.DATE,  
            },
            'Family_name': { 
    type: DataTypes.STRING(50),  
            },
            'Given_name': { 
    type: DataTypes.STRING(50),  
            },
            'Occupation': { 
    type: DataTypes.STRING(50),  
            },
            'Address': { 
    type: DataTypes.STRING(50),  
            },
            'Suburb': { 
    type: DataTypes.STRING(50),  
            },
            'Postcode': { 
    type: DataTypes.INTEGER(11),  
            },
            'Home_phone': { 
    type: DataTypes.STRING(15),  
            },
            'Mobile_phone': { 
    type: DataTypes.STRING(15),  
            },
            'Work_phone': { 
    type: DataTypes.STRING(15),  
            },
            'Next_Of_kin': { 
    type: DataTypes.STRING(50),  
            },
            'Tel': { 
    type: DataTypes.STRING(15),  
            },
            'Medicare': { 
    type: DataTypes.INTEGER(11),  
            },
            'Position_no': { 
    type: DataTypes.INTEGER(11),  
            },
            'Exp': { 
    type: DataTypes.STRING(15),  
            },
            'isPrivateInsurrance': { 
    type: DataTypes.INTEGER(11),  
            },
            'Health_fund_name': { 
    type: DataTypes.STRING(50),  
            },
            'Mem_no': { 
    type: DataTypes.STRING(50),  
            },
            'isHospitalCover': { 
    type: DataTypes.INTEGER(11),  
            },
            'Veteran_affairs_no': { 
    type: DataTypes.STRING(50),  
            },
            'Card_holder': { 
    type: DataTypes.STRING(50),  
            },
            'isStatement1': { 
    type: DataTypes.INTEGER(11),  
            },
            'isStatement2': { 
    type: DataTypes.INTEGER(11),  
            },
            'isStatement3': { 
    type: DataTypes.INTEGER(11),  
            },
            'signature': { 
    type: DataTypes.BLOB,  
            },
            'Medical_History': { 
    type: DataTypes.STRING(100),  
            },
            'isAsthma': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEpilepsy': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeartCondition': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHighCholesterol': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDiabetesTypeI': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDiabetesTypeII': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHighBloobPressure': { 
    type: DataTypes.INTEGER(11),  
            },
            'isArthritis': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBloodCon': { 
    type: DataTypes.INTEGER(11),  
            },
            'isMedications': { 
    type: DataTypes.INTEGER(11),  
            },
            'Medications': { 
    type: DataTypes.STRING(100),  
            },
            'isAllergies': { 
    type: DataTypes.INTEGER(11),  
            },
            'Allergies': { 
    type: DataTypes.STRING(100),  
            },
            'Initial_treatment_provided': { 
    type: DataTypes.STRING(100),  
            },
            'Picture_of_Injury': { 
    type: DataTypes.BLOB,  
            },
            'Accident_Date': { 
    type: DataTypes.DATE,  
            },
            'Workplace': { 
    type: DataTypes.STRING(100),  
            },
            'Cause': { 
    type: DataTypes.STRING(100),  
            },
            'isSprainStrain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLaceration': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCrush': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFall': { 
    type: DataTypes.INTEGER(11),  
            },
            'Other_of_Injury': { 
    type: DataTypes.STRING(100),  
            },
            'isSymtomBefore_of_Injury': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLeftLowerleg': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRightLowerleg': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLeftUperleg': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRightUperleg': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLeftLowerArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRightLowerArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLeftUperArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRightUperArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLefthand': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRighthand': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLeftShoulder': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRightShoulder': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAbdomen': { 
    type: DataTypes.INTEGER(11),  
            },
            'isChest': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLowerBack': { 
    type: DataTypes.INTEGER(11),  
            },
            'Other': { 
    type: DataTypes.STRING(100),  
            },
            'isOpenWound': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSwelling': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRedness': { 
    type: DataTypes.INTEGER(11),  
            },
            'isReducesMovement': { 
    type: DataTypes.INTEGER(11),  
            },
            'Pain': { 
    type: DataTypes.INTEGER(11),  
            },
            'OtherSymtom': { 
    type: DataTypes.STRING(100),  
            },
            'GI_picture': { 
    type: DataTypes.BLOB,  
            },
            'GI_Date': { 
    type: DataTypes.DATE,  
            },
            'isSymtomBefore': { 
    type: DataTypes.INTEGER(11),  
            },
            'isHeadache': { 
    type: DataTypes.INTEGER(11),  
            },
            'isNausea': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFatigue': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFever': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSoreThroat': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCough': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSinusCongestion': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBodyAches': { 
    type: DataTypes.INTEGER(11),  
            },
            'isVomiting': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLightHeadedness': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDiarrhea': { 
    type: DataTypes.INTEGER(11),  
            },
            'isShortnessOfBreath': { 
    type: DataTypes.INTEGER(11),  
            },
            'isChestPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isAbdomenPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isBackPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isEarPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'isLowMood': { 
    type: DataTypes.INTEGER(11),  
            },
            'isDecreasedAppetite': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFeelingDepressed': { 
    type: DataTypes.INTEGER(11),  
            },
            'isToothPain': { 
    type: DataTypes.INTEGER(11),  
            },
            'OtherGISymtom': { 
    type: DataTypes.STRING(100),  
            },
            'BPM': { 
    type: DataTypes.STRING(100),  
            },
            'Temp': { 
    type: DataTypes.INTEGER(11),  
            },
            'RR': { 
    type: DataTypes.STRING(100),  
            },
            'BP': { 
    type: DataTypes.STRING(100),  
            },
            'SaO2': { 
    type: DataTypes.INTEGER(11),  
            },
            'company_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'doctor_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'Created_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Creation_date': { 
    type: DataTypes.DATE,  
            },
            'Last_updated_by': { 
    type: DataTypes.INTEGER(11),  
            },
            'Last_update_date': { 
    type: DataTypes.DATE,  
            },
            'isPhysioConsult': { 
    type: DataTypes.INTEGER(11),  
            },
            'isInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'symtom_value_1': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_2': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_3': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_4': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_5': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_6': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_7': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_8': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_9': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_10': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_11': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_12': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_13': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_14': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_15': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_16': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_17': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_18': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_19': { 
    type: DataTypes.STRING(500),  
            },
            'symtom_value_20': { 
    type: DataTypes.STRING(500),  
            },
            'nt_descInjury': { 
    type: DataTypes.STRING(500),  
            },
            'claimNo': { 
    type: DataTypes.INTEGER(20),  
            },
            'isEngageInForm': { 
    type: DataTypes.INTEGER(11),  
            },
            'state': { 
    type: DataTypes.STRING(15),  
            },
            'medicalDiagnosis': { 
    type: DataTypes.STRING(200),  
            },
            'isProvisonalDiag': { 
    type: DataTypes.INTEGER(11),  
            },
            'isConsistent': { 
    type: DataTypes.INTEGER(11),  
            },
            'detailFactor': { 
    type: DataTypes.STRING(100),  
            },
            'vic_OtherAggravation': { 
    type: DataTypes.STRING(200),  
            },
            'vic_PatientType': { 
    type: DataTypes.STRING(50),  
            },
            'vic_Referral': { 
    type: DataTypes.STRING(200),  
            },
            'email': { 
    type: DataTypes.STRING(50),  
            },
            'jobTitle': { 
    type: DataTypes.STRING(50),  
            },
}, {
tableName: "th_telehealth_form",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}