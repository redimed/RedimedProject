module.exports = function(sequelize, DataTypes){
var mdtInstance = sequelize.define("mdtThFirstAssessments", {
            'Ass_id': { 
    type: DataTypes.INTEGER(11),  
            primaryKey: true,
                    },
            'telehealth_id': { 
    type: DataTypes.INTEGER(11),  
            },
            'cal_id': { 
    type: DataTypes.BIGINT(20),  
            },
            'medical_ass': { 
    type: DataTypes.STRING(100),  
            },
            'isCorrelate': { 
    type: DataTypes.INTEGER(11),  
            },
            'isfitnofurther': { 
    type: DataTypes.INTEGER(11),  
            },
            'isfitrequires': { 
    type: DataTypes.INTEGER(11),  
            },
            'isfitrestricted': { 
    type: DataTypes.INTEGER(11),  
            },
            'restrictedfrom': { 
    type: DataTypes.DATE,  
            },
            'restrictedto': { 
    type: DataTypes.DATE,  
            },
            'isrestrictedhours': { 
    type: DataTypes.INTEGER(11),  
            },
            'restrictedhours': { 
    type: DataTypes.INTEGER(11),  
            },
            'isrestricteddays': { 
    type: DataTypes.INTEGER(11),  
            },
            'restricteddays': { 
    type: DataTypes.INTEGER(11),  
            },
            'isrestrictedduties': { 
    type: DataTypes.INTEGER(11),  
            },
            'isworkrestrictions': { 
    type: DataTypes.INTEGER(11),  
            },
            'nolifting': { 
    type: DataTypes.INTEGER(11),  
            },
            'liftingheavier': { 
    type: DataTypes.INTEGER(11),  
            },
            'ortherreistriction': { 
    type: DataTypes.STRING(200),  
            },
            'isbending': { 
    type: DataTypes.INTEGER(11),  
            },
            'isstanding': { 
    type: DataTypes.INTEGER(11),  
            },
            'isbodypart': { 
    type: DataTypes.INTEGER(11),  
            },
            'iskeepinjuryedclean': { 
    type: DataTypes.INTEGER(11),  
            },
            'isunfitwork': { 
    type: DataTypes.INTEGER(11),  
            },
            'unfitday': { 
    type: DataTypes.INTEGER(11),  
            },
            'unfitfrom': { 
    type: DataTypes.DATE,  
            },
            'unfitto': { 
    type: DataTypes.DATE,  
            },
            'ismedication': { 
    type: DataTypes.INTEGER(11),  
            },
            'medication': { 
    type: DataTypes.STRING(200),  
            },
            'isapproved': { 
    type: DataTypes.INTEGER(11),  
            },
            'approved': { 
    type: DataTypes.STRING(200),  
            },
            'isimaging': { 
    type: DataTypes.INTEGER(11),  
            },
            'imaging': { 
    type: DataTypes.STRING(200),  
            },
            'isrefferedtohospital': { 
    type: DataTypes.INTEGER(11),  
            },
            'refferedtohospital': { 
    type: DataTypes.STRING(200),  
            },
            'orthertreatment': { 
    type: DataTypes.STRING(200),  
            },
            'appoitmentdate': { 
    type: DataTypes.DATE,  
            },
            'ismadecontact': { 
    type: DataTypes.INTEGER(11),  
            },
            'isoffwork': { 
    type: DataTypes.INTEGER(11),  
            },
            'isreturnwork': { 
    type: DataTypes.INTEGER(11),  
            },
            'isfirstandfinalcerf': { 
    type: DataTypes.INTEGER(11),  
            },
            'reportlocal': { 
    type: DataTypes.STRING(30),  
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
            'nt_consistent': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_ofUncertainCause': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_historyOfCurrentCon': { 
    type: DataTypes.STRING(500),  
            },
            'nt_priorHistory': { 
    type: DataTypes.STRING(500),  
            },
            'nt_examination': { 
    type: DataTypes.STRING(500),  
            },
            'nt_investigation': { 
    type: DataTypes.STRING(500),  
            },
            'nt_diagnosis': { 
    type: DataTypes.STRING(500),  
            },
            'nt_complication': { 
    type: DataTypes.STRING(500),  
            },
            'nt_restrictedDutiesFrom': { 
    type: DataTypes.DATE,  
            },
            'nt_restrictedDutiesTo': { 
    type: DataTypes.DATE,  
            },
            'nt_isSquatting': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_workerOffDay': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_workerOffTime': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_isReferralToSpecialist': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_referralToSpecialist': { 
    type: DataTypes.STRING(100),  
            },
            'nt_isReferralToAHP': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_isPhysiotherapist': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_physiotherapist': { 
    type: DataTypes.STRING(100),  
            },
            'nt_physioSession': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_isChiropractor': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_chiropractor': { 
    type: DataTypes.STRING(100),  
            },
            'nt_chiroSession': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_isOther': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_uncertainCause': { 
    type: DataTypes.STRING(100),  
            },
            'nt_other': { 
    type: DataTypes.STRING(500),  
            },
            'nt_isCaseConference': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_caseConference': { 
    type: DataTypes.STRING(500),  
            },
            'nt_isVocationalReferral': { 
    type: DataTypes.INTEGER(11),  
            },
            'nt_workerReviewDate': { 
    type: DataTypes.DATE,  
            },
            'nt_cause': { 
    type: DataTypes.STRING(100),  
            },
            'nt_restrictedDuties': { 
    type: DataTypes.INTEGER(11),  
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
            'tas_presentSymptom': { 
    type: DataTypes.STRING(500),  
            },
            'tas_diagnosis': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_diagDetail': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isIncident': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_incidentOn': { 
    type: DataTypes.DATE,  
            },
            'tas_isDisease': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_diseaseOn': { 
    type: DataTypes.DATE,  
            },
            'tas_injuryCircumstance': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isConsistent': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_inconsistReason': { 
    type: DataTypes.STRING(500),  
            },
            'tas_uncertainReason': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isRecurrence': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isAggravation': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isNewCondition': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_pastHistory': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isHasWorkplace': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_workplace': { 
    type: DataTypes.STRING(100),  
            },
            'tas_workplaceDate': { 
    type: DataTypes.DATE,  
            },
            'tas_isHasNotBeen': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isRequireTreatment': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_isFitForSuitable': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_fitForSuitableFrom': { 
    type: DataTypes.DATE,  
            },
            'tas_fitForSuitableTo': { 
    type: DataTypes.DATE,  
            },
            'tas_indicateRestric': { 
    type: DataTypes.STRING(500),  
            },
            'tas_isWillBeIncapacitate': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_incapacitateFrom': { 
    type: DataTypes.DATE,  
            },
            'tas_incapacitateTo': { 
    type: DataTypes.DATE,  
            },
            'tas_ifGreaterThan': { 
    type: DataTypes.STRING(200),  
            },
            'tas_isWillCease': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_willCeaseOn': { 
    type: DataTypes.DATE,  
            },
            'tas_isHasWorkerConsult': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_workerConsultDetail': { 
    type: DataTypes.STRING(500),  
            },
            'tas_medication': { 
    type: DataTypes.STRING(500),  
            },
            'tas_providerName': { 
    type: DataTypes.STRING(100),  
            },
            'tas_detail': { 
    type: DataTypes.STRING(200),  
            },
            'tas_isReview': { 
    type: DataTypes.INTEGER(11),  
            },
            'tas_reviewOn': { 
    type: DataTypes.DATE,  
            },
            'tas_sigWorkerDate': { 
    type: DataTypes.DATE,  
            },
            'tas_sigPractionerDate': { 
    type: DataTypes.DATE,  
            },
            'tas_sigDate': { 
    type: DataTypes.DATE,  
            },
            'AssessmentName': { 
    type: DataTypes.STRING(50),  
                defaultValue: First Assessment,
        },
            'assessmentDate': { 
    type: DataTypes.DATE,  
            },
            'clinicFind': { 
    type: DataTypes.STRING(200),  
            },
            'diagnosis': { 
    type: DataTypes.STRING(200),  
            },
            'isConsistent': { 
    type: DataTypes.INTEGER(11),  
            },
            'isCondition': { 
    type: DataTypes.INTEGER(11),  
            },
            'usualDuties': { 
    type: DataTypes.STRING(100),  
            },
            'workCapacity': { 
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
            'isSomeCapacity': { 
    type: DataTypes.INTEGER(11),  
            },
            'someCapaFrom': { 
    type: DataTypes.DATE,  
            },
            'someCapaTo': { 
    type: DataTypes.DATE,  
            },
            'isPreDuties': { 
    type: DataTypes.INTEGER(11),  
            },
            'isModiDuties': { 
    type: DataTypes.INTEGER(11),  
            },
            'isWorkModifi': { 
    type: DataTypes.INTEGER(11),  
            },
            'isPreHours': { 
    type: DataTypes.INTEGER(11),  
            },
            'isModiHours': { 
    type: DataTypes.INTEGER(11),  
            },
            'modiHrs': { 
    type: DataTypes.INTEGER(11),  
            },
            'modiDays': { 
    type: DataTypes.INTEGER(11),  
            },
            'isNoCapacity': { 
    type: DataTypes.INTEGER(11),  
            },
            'noCapaFrom': { 
    type: DataTypes.DATE,  
            },
            'noCapaTo': { 
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
            'capaCmt': { 
    type: DataTypes.STRING(500),  
            },
            'activities_1': { 
    type: DataTypes.STRING(100),  
            },
            'activities_2': { 
    type: DataTypes.STRING(100),  
            },
            'activities_3': { 
    type: DataTypes.STRING(100),  
            },
            'activities_4': { 
    type: DataTypes.STRING(100),  
            },
            'activities_5': { 
    type: DataTypes.STRING(100),  
            },
            'activities_6': { 
    type: DataTypes.STRING(100),  
            },
            'goal_1': { 
    type: DataTypes.STRING(200),  
            },
            'goal_2': { 
    type: DataTypes.STRING(200),  
            },
            'goal_3': { 
    type: DataTypes.STRING(200),  
            },
            'goal_4': { 
    type: DataTypes.STRING(200),  
            },
            'goal_5': { 
    type: DataTypes.STRING(200),  
            },
            'goal_6': { 
    type: DataTypes.STRING(200),  
            },
            'isMoreInfo': { 
    type: DataTypes.INTEGER(11),  
            },
            'isRTW': { 
    type: DataTypes.INTEGER(11),  
            },
            'isInvolved': { 
    type: DataTypes.INTEGER(11),  
            },
            'isReview': { 
    type: DataTypes.INTEGER(11),  
            },
            'isNotReview': { 
    type: DataTypes.INTEGER(11),  
            },
            'isNeedReview': { 
    type: DataTypes.INTEGER(11),  
            },
            'reviewOn': { 
    type: DataTypes.DATE,  
            },
            'reviewCmt': { 
    type: DataTypes.STRING(200),  
            },
}, {
tableName: "th_first_assessment",
createdAt: "Creation_date",
updatedAt: "Last_update_date",
});
return mdtInstance;
}