module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtGorgonDocMh", {
            'Gorgon_Id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'Patient_Id': { 
    type: DataTypes.INTEGER(11),  
            },
            'JobNo': { 
    type: DataTypes.STRING(50),  
            },
            'Occupation': { 
    type: DataTypes.STRING(200),  
            },
            'JobLocation': { 
    type: DataTypes.STRING(200),  
            },
            'SpecificLocation': { 
    type: DataTypes.STRING(200),  
            },
            'PhoneNumber': { 
    type: DataTypes.STRING(50),  
            },
            'Q1_YearFrom1': { 
    type: DataTypes.DATE,  
            },
            'Q1_YearFrom2': { 
    type: DataTypes.DATE,  
            },
            'Q1_YearTo1': { 
    type: DataTypes.DATE,  
            },
            'Q1_YearTo2': { 
    type: DataTypes.DATE,  
            },
            'Q1_Job1': { 
    type: DataTypes.STRING(200),  
            },
            'Q1_Job2': { 
    type: DataTypes.STRING(200),  
            },
            'Q1_Employer1': { 
    type: DataTypes.STRING(200),  
            },
            'Q1_Employer2': { 
    type: DataTypes.STRING(200),  
            },
            'Q1_TypeOfWork': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_WorkPast': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_WorkEnvironment': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_AnyProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_CauseProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_Underground': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_GrainDust': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_RemoteEnv': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_AtHeights': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_WetConditions': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_Nickel': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_HumidConditions': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_FIFO': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_FIFODone': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_FIFOProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_ShiftWork': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_ShiftWorkDone': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_ShiftWorkProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_SafetyEquipment': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q1_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q2_Operation': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_Accident': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_SportsInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_YesWhen': { 
    type: DataTypes.STRING(200),  
            },
            'Q2_TimeOfWork': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_HowLongOff': { 
    type: DataTypes.STRING(200),  
            },
            'Q2_HowLongModified': { 
    type: DataTypes.STRING(200),  
            },
            'Q2_HowLongTreatment': { 
    type: DataTypes.STRING(200),  
            },
            'Q2_NormalDuties': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_Compensation': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_PsychologicalProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q2_DentalHealth': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_Diabetic': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_Seizure': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_Epileptic': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_Asthmatic': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_AnyScars': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q2_MedicAlert': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_NeckInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_DiskInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_Backache': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_Physio': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_BackInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_Sciatica': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_BackSurgery': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_SwollenJoints': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_ArthriticKnee': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_Arm': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_HandInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_LegInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_KneeCartilage': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_KneeReconstruction': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_FootProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_OtherBone': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_Rheumatism': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_RSI': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q3_Hernia': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_MentalHealth': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_Psychologist': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_DrugsProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_Depression': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_PanicAttacks': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_NervousProblem': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_Anxiety': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q4_Insomnia': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q5_Eczema': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q5_Psoriasis': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q5_SkinProblem': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q5_Dermatitis': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q5_SkinCancers': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_Asthma': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_LungDisease': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_Artery': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_HighBloodPressure': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_DVT': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_UsedPuffer': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_CardiacPacemaker': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_Emphysema': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_HeartDisease': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_Bronchitis': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_CollapsedLung': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q6_HeartAttack': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q7_HeadInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q7_Epilepsy': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q7_SevereHeadaches': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q7_NeurologicalDisorder': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_DOInsulin': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_DOMedication': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_DietControl': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_KidneyProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_LiverDisease': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_HearingLoss': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_Exhaustion': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_Arthritis': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_BloodDisorder': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_Cancer': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_BowelProblems': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_Hepatitis': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_VisionProblem': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q8_ChronicIllness': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q9_Pregnant': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q9_BreastFeeding': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q9_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q10_Disabilities': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_Climb': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_Bend': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkOverhead': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkHeights': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkIsolation': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_Instruments': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkAwkward': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_Squat': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_Push': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkUnderground': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkDusty': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkConfined': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkGround': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q11_WorkVibration': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossFullBack': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossFullLeg': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_DifficultyHearing': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossEye': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_Glasses': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_OtherLoss': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossFullMovements': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_OtherProblem': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossFullArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_Psychological': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_Breathing': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_ChronicSkin': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_AlcoholMisuse': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossMobility': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_LossFullNeck': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q12_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q13_AdvisedToChange': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q13_AdvisedToChangeComment': { 
    type: DataTypes.STRING(200),  
            },
            'Q13_AdvisedToLimit': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q13_AdvisedToLimitComment': { 
    type: DataTypes.STRING(200),  
            },
            'Q13_OffInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q13_OffInjuryComment': { 
    type: DataTypes.STRING(200),  
            },
            'Q13_WhatWas': { 
    type: DataTypes.STRING(200),  
            },
            'Q13_Medi_Vac': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q13_Details': { 
    type: DataTypes.STRING(200),  
            },
            'Q13_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q14_WorkRelatedDisease': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q14_Year': { 
    type: DataTypes.STRING(200),  
            },
            'Q14_HowLongOff': { 
    type: DataTypes.STRING(200),  
            },
            'Q14_HowLongModified': { 
    type: DataTypes.STRING(200),  
            },
            'Q14_HowLongTreatment': { 
    type: DataTypes.STRING(200),  
            },
            'Q14_NormalDuties': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q14_Compensation': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q14_Psychological': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q14_Details': { 
    type: DataTypes.STRING(200),  
            },
            'Q14_WCClaim': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q14_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q15_TakeMedications': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q15_ListMedication': { 
    type: DataTypes.STRING(200),  
            },
            'Q16_HayFever': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q16_Eczema': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q16_Allergic': { 
    type: DataTypes.STRING(200),  
            },
            'Q16_Adrenaline': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q16_Epipen': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q16_Asthma': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q17_QFever': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q17_HepatitisA': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q17_Tetanus': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q17_HepatitisB': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q17_ExaminersComments': { 
    type: DataTypes.STRING(500),  
            },
            'Q18_IncreasedCough': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_ChestIllness': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_SOBHurrying': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_SOBwalking': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_SOBWakeUp': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_CESWheezy': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_CEFTight': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_GivenPuffer': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q18_LastTimePuffer': { 
    type: DataTypes.STRING(200),  
            },
            'Q19_Smoke': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q19_SmokeDay': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q19_SmokeWeek': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q19_SmokeYear': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q20_DrinkWeek': { 
    type: DataTypes.STRING(200),  
            },
            'Q20_DrinkMax': { 
    type: DataTypes.STRING(200),  
            },
            'Q21_Exercise': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_PlaySport': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_SportDetails': { 
    type: DataTypes.STRING(200),  
            },
            'Q21_IsFootball': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_IsGolf': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_IsTennis': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_IsSquash': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_IsBowls': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_IsGym': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q21_IsOther': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q22_SleepDisorder': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q22_Choking': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q22_UseCPAP': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_SittingReading': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_WatchingTV': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_Inactive': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_Passenger': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_LyingDown': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_SittingTalking': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_SittingQuietly': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_InACar': { 
    type: DataTypes.INTEGER(11),  
            },
            'Q23_TotalScore': { 
    type: DataTypes.FLOAT,  
            },
            'Signature': { 
    type: DataTypes.BLOB,  
            },
            'GorgonDate': { 
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
            'Q21Other1Comment': { 
    type: DataTypes.STRING(500),  
            },
            'PATIENT_SIGNATURE': { 
    type: DataTypes.BLOB,  
            },
}, {
tableName: "gorgon_doc_mh",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}