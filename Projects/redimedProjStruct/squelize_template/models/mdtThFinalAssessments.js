module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThFinalAssessments", {
            'id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'cal_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'examinedasfrom': { 
    type: DataTypes.STRING(100),  
            },
            'isworkerhaswholly': { 
    type: DataTypes.INTEGER(11),  
            },
            'isworkerhaspartially': { 
    type: DataTypes.INTEGER(11),  
            },
            'isworkerincapacity': { 
    type: DataTypes.INTEGER(11),  
            },
            'telehealth_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'opinionasfrom': { 
    type: DataTypes.STRING(100),  
            },
            'isfit': { 
    type: DataTypes.INTEGER(11),  
            },
            'isfitalternative': { 
    type: DataTypes.INTEGER(11),  
            },
            'fitalternative': { 
    type: DataTypes.STRING(100),  
            },
            'isnopermanent': { 
    type: DataTypes.INTEGER(11),  
            },
            'ispermanenet': { 
    type: DataTypes.INTEGER(11),  
            },
            'permanenet': { 
    type: DataTypes.STRING(100),  
            },
            'Name': { 
    type: DataTypes.STRING(100),  
            },
            'Address': { 
    type: DataTypes.STRING(100),  
            },
            'Email': { 
    type: DataTypes.STRING(100),  
            },
            'registionNo': { 
    type: DataTypes.STRING(100),  
            },
            'Phone': { 
    type: DataTypes.STRING(15),  
            },
            'examDate': { 
    type: DataTypes.DATE,  
            },
            'vic_fitnessFrom': { 
    type: DataTypes.DATE,  
            },
            'vic_fitnessmodifiedfrom': { 
    type: DataTypes.DATE,  
            },
            'vic_fitnessmodifiedto': { 
    type: DataTypes.DATE,  
            },
            'vic_fitnessalternativefrom': { 
    type: DataTypes.DATE,  
            },
            'vic_fitnessalternativeto': { 
    type: DataTypes.DATE,  
            },
            'vic_isCompleted': { 
    type: DataTypes.INTEGER(11),  
            },
            'vic_isMedicalCertificate': { 
    type: DataTypes.INTEGER(11),  
            },
            'vic_isContinueCertificate': { 
    type: DataTypes.INTEGER(11),  
            },
            'vic_isAttendanceCertificate': { 
    type: DataTypes.INTEGER(11),  
            },
            'vic_comment': { 
    type: DataTypes.STRING(200),  
            },
            'vic_normalRestriction': { 
    type: DataTypes.STRING(200),  
            },
            'vic_modifiedRestriction': { 
    type: DataTypes.STRING(200),  
            },
            'vic_alternativeRestriction': { 
    type: DataTypes.STRING(200),  
            },
            'vic_nextreviewdate': { 
    type: DataTypes.DATE,  
            },
            'signature': { 
    type: DataTypes.BLOB,  
            },
            'reportlocal': { 
    type: DataTypes.STRING(30),  
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
            'nt_isWorkerIncapacitated': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_isInMyOpinion': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_isWorkRelatedInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_groundForMedical': { 
    type: DataTypes.STRING(500),  
            },
            'opinionDate': { 
    type: DataTypes.DATE,  
            },
            'opinionAsFromDate': { 
    type: DataTypes.DATE,  
            },
            'faxNumber': { 
    type: DataTypes.STRING(20),  
            },
            'nsw_diagnoOfWorkInjury': { 
    type: DataTypes.STRING(500),  
            },
            'nsw_patientDateOfInjury': { 
    type: DataTypes.DATE,  
            },
            'nsw_patientFirstSeen': { 
    type: DataTypes.DATE,  
            },
            'nsw_injuryIsConsistent': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_howInjuryRelateWork': { 
    type: DataTypes.STRING(500),  
            },
            'nsw_detailPreFactor': { 
    type: DataTypes.STRING(500),  
            },
            'nsw_claimName': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_claimNo': { 
    type: DataTypes.INTEGER(20),  
            },
            'nsw_treatmentTypeAndDura': { 
    type: DataTypes.STRING(200),  
            },
            'nsw_refeToAnotherHealthCare': { 
    type: DataTypes.STRING(200),  
            },
            'nsw_isRequireCopy': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_isFitPreInjury': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_isHasCapacity': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_hasCapacityFrom': { 
    type: DataTypes.DATE,  
            },
            'nsw_hasCapacityTo': { 
    type: DataTypes.DATE,  
            },
            'nsw_hasCapacityHour': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_hasCapacityDay': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_isHasNoCurrent': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_hasNoCurrentFrom': { 
    type: DataTypes.DATE,  
            },
            'nsw_hasNoCurrentTo': { 
    type: DataTypes.DATE,  
            },
            'nsw_ifNoCurrentWork': { 
    type: DataTypes.STRING(11),  
            },
            'nsw_factorDelay': { 
    type: DataTypes.STRING(200),  
            },
            'nsw_isRecommendRefe': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_liftCapacity': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_sitting': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_standing': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_pushing': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_bending': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_driving': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_other': { 
    type: DataTypes.STRING(200),  
            },
            'nsw_nextReview': { 
    type: DataTypes.DATE,  
            },
            'nsw_comment': { 
    type: DataTypes.STRING(200),  
            },
            'nsw_isAgree': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_isTreatingDoctor': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_isTreatingSpecialist': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_isTreatingOther': { 
    type: DataTypes.INTEGER(11),  
            },
            'nsw_treatingOther': { 
    type: DataTypes.STRING(200),  
            },
            'nsw_signature': { 
    type: DataTypes.BLOB,  
            },
            'nsw_treatingDate': { 
    type: DataTypes.DATE,  
            },
            'nsw_name': { 
    type: DataTypes.STRING(50),  
            },
            'nsw_address': { 
    type: DataTypes.STRING(100),  
            },
            'nsw_telephone': { 
    type: DataTypes.STRING(15),  
            },
            'nsw_providerNo': { 
    type: DataTypes.INTEGER(20),  
            },
            'nsw_assesment': { 
    type: DataTypes.STRING(15),  
            },
            'ql_isNewClaim': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_newClaim': { 
    type: DataTypes.STRING(50),  
            },
            'ql_isReturnToDuties': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_returnToDutiesFrom': { 
    type: DataTypes.DATE,  
            },
            'ql_isForSuitable': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_forSuitableFrom': { 
    type: DataTypes.DATE,  
            },
            'ql_forSuitableTo': { 
    type: DataTypes.DATE,  
            },
            'ql_isNoCapability': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_noCapabilityFrom': { 
    type: DataTypes.DATE,  
            },
            'ql_noCapabilityTo': { 
    type: DataTypes.DATE,  
            },
            'ql_estimateTime': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isTime': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isRequireTreatment': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_requireTreatmentFrom': { 
    type: DataTypes.DATE,  
            },
            'ql_requireTreatmentTo': { 
    type: DataTypes.DATE,  
            },
            'ql_isReview': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_reviewOn': { 
    type: DataTypes.DATE,  
            },
            'ql_isDiagnosisImaging': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isPathology': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isOtherInvest': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_detail': { 
    type: DataTypes.STRING(200),  
            },
            'ql_treatment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_medication': { 
    type: DataTypes.STRING(100),  
            },
            'ql_refeSpecialist': { 
    type: DataTypes.STRING(100),  
            },
            'ql_refeAlliedHealth': { 
    type: DataTypes.STRING(100),  
            },
            'ql_medicalDetail': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isTreatingPractioner': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isTreatingSpecialist': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isTreatingAlliedHealth': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isEmployer': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isEmployerContact': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isInsurerContact': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_furtherInfo': { 
    type: DataTypes.STRING(200),  
            },
            'ql_isApproval': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_liftLimit': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isLiftLimit': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_liftLimitComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isBending': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_bendingComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isStanding': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_standingComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isUseOfInjured': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_useOfInjuredComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isPushing': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_pushingComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isOperating': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_operatingComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isDriving': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_drivingComment': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isKeepWoundClean': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_otherCondideration': { 
    type: DataTypes.STRING(100),  
            },
            'ql_restrictedHour': { 
    type: DataTypes.STRING(100),  
            },
            'ql_isRequired': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isPreferPH': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_preferPHDay': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_preferPHTime': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_isPreferEmail': { 
    type: DataTypes.INTEGER(11),  
            },
            'ql_examDate': { 
    type: DataTypes.DATE,  
            },
            'tas_examDate': { 
    type: DataTypes.DATE,  
            },
            'tas_currentSymptom': { 
    type: DataTypes.STRING(500),  
            },
            'tas_currentDiagnosis': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isDiagnosisChange': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_diagnosisDetail': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isWorkplace': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_workplace': { 
    type: DataTypes.STRING(50),  
            },
            'tas_workplaceDate': { 
    type: DataTypes.DATE,  
            },
            'tas_isRequireTreatment': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isFit': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_fitFrom': { 
    type: DataTypes.DATE,  
            },
            'tas_fitTo': { 
    type: DataTypes.DATE,  
            },
            'tas_isIncapacitate': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_incapacitateFrom': { 
    type: DataTypes.DATE,  
            },
            'tas_incapacitateTo': { 
    type: DataTypes.DATE,  
            },
            'tas_ifGreater': { 
    type: DataTypes.STRING(200),  
            },
            'tas_isWillCease': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_willCeaseOn': { 
    type: DataTypes.DATE,  
            },
            'tas_isFitForOngoing': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_fitForOngoingFrom': { 
    type: DataTypes.DATE,  
            },
            'tas_isDutiesPermanent': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isFulltime': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isGraduated': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_week1': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_toWeek1': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_week2': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_toWeek2': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_hour1': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_hour2': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_hour3': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_hour4': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_day1': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_day2': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_day3': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_day4': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isRestBreak': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_restBreakMins': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_restBreakHour': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isUseArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isElevateArm': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isLiftWeight': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isBend': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isPull': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isClimb': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isSit': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isStand': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isDrive': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isUsePublic': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isOther': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_comment': { 
    type: DataTypes.STRING(200),  
            },
            'tas_isOtherImpediment': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_otherImpediment': { 
    type: DataTypes.STRING(200),  
            },
            'tas_isWorkerConsult': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_workerConsultDetail': { 
    type: DataTypes.STRING(500),  
            },
            'tas_treatment': { 
    type: DataTypes.STRING(200),  
            },
            'tas_providerName': { 
    type: DataTypes.STRING(100),  
            },
            'tas_providerDetail': { 
    type: DataTypes.STRING(200),  
            },
            'tas_isProcedure': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_procedureDetail': { 
    type: DataTypes.STRING(100),  
            },
            'tas_procedureSchedule': { 
    type: DataTypes.DATE,  
            },
            'tas_isReviewWorker': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_reviewWorkerOn': { 
    type: DataTypes.DATE,  
            },
            'tas_sigWorkerDate': { 
    type: DataTypes.DATE,  
            },
            'tas_sigPractionerDate': { 
    type: DataTypes.DATE,  
            },
            'unfitfrom': { 
    type: DataTypes.DATE,  
            },
            'unfitto': { 
    type: DataTypes.DATE,  
            },
            'AssessmentName': { 
    type: DataTypes.STRING(50),  
                defaultValue: Final Assessment,
        },
            'injuryDate': { 
    type: DataTypes.DATE,  
            },
            'isCondition': { 
    type: DataTypes.INTEGER(11),  
            },
            'isFullCapacity': { 
    type: DataTypes.INTEGER(11),  
            },
            'fullCapaFrom': { 
    type: DataTypes.DATE,  
            },
            'isRequireTreat': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCapacityForWork': { 
    type: DataTypes.INTEGER(11),  
            },
            'capaHours': { 
    type: DataTypes.INTEGER(11),  
            },
            'capaDays': { 
    type: DataTypes.INTEGER(11),  
            },
            'capaFrom': { 
    type: DataTypes.DATE,  
            },
            'isLiftUp': { 
    type: DataTypes.INTEGER(11),  
            },
            'liftUpKg': { 
    type: DataTypes.INTEGER(11),  
            },
            'isSitUp': { 
    type: DataTypes.INTEGER(11),  
            },
            'sitUpMins': { 
    type: DataTypes.INTEGER(11),  
            },
            'isStandUp': { 
    type: DataTypes.INTEGER(11),  
            },
            'standUpMins': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWalkUp': { 
    type: DataTypes.INTEGER(11),  
            },
            'walkUpMeter': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWorkBelow': { 
    type: DataTypes.INTEGER(11),  
            },
            'isIncapacity': { 
    type: DataTypes.INTEGER(11),  
            },
            'capaCmt': { 
    type: DataTypes.STRING(500),  
            },
            'reasonCmt': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "th_final_assessment",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}