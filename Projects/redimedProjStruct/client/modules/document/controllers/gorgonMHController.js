angular.module('app.loggedIn.document.gorgonMH.controllers', [])
    .controller("gorgonMHController", function ($filter, DocumentService, $scope, $rootScope, $http, $cookieStore, toastr, $state, $stateParams, localStorageService) {
        //begin date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //end date

        $scope.today = new Date();

        var userInfo = $cookieStore.get('userInfo');

        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist");
            $state.go('loggedIn.home', null, {
                "reload": true
            });
        } else {
            //begin signature
            var tempSignature;
            $scope.isSignature = false;
            $scope.showSignature = function () {
                $scope.isSignature = !$scope.isSignature;
            }

            $scope.cancelClick = function () {
                $scope.isSignature = !$scope.isSignature;
                $scope.info.Signature = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.Signature = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.Signature;
            }

            //end signature
            //set value default
            //var apptInfo = localStorageService.get('tempAppt');
            var tempPatient = localStorageService.get('tempPatient') || [];
            if (tempPatient === null || tempPatient === 'undefined') {
                $state.go('loggedIn.home', null, {
                    "reload": true
                });
                toastr.error("Load some information fail, please try again!", "Error");
            } else {
                var patient_id = tempPatient.Patient_id;
                //var cal_id = tempAppt.CAL_ID;
                var cal_id = -1;
                $scope.info = {
                    Gorgon_Id: null,
                    Patient_Id: patient_id,
                    JobNo: null,
                    Occupation: null,
                    JobLocation: null,
                    SpecificLocation: null,
                    PhoneNumber: null,
                    Q1_YearFrom1: new Date(),
                    Q1_YearFrom2: new Date(),
                    Q1_YearTo1: new Date(),
                    Q1_YearTo2: new Date(),
                    Q1_Job1: null,
                    Q1_Job2: null,
                    Q1_Employer1: null,
                    Q1_Employer2: null,
                    Q1_TypeOfWork: null,
                    Q1_WorkPast: null,
                    Q1_WorkEnvironment: null,
                    Q1_AnyProblems: null,
                    Q1_CauseProblems: null,
                    Q1_Underground: null,
                    Q1_GrainDust: null,
                    Q1_RemoteEnv: null,
                    Q1_AtHeights: null,
                    Q1_WetConditions: null,
                    Q1_Nickel: null,
                    Q1_HumidConditions: null,
                    Q1_FIFO: null,
                    Q1_FIFODone: null,
                    Q1_FIFOProblems: null,
                    Q1_ShiftWork: null,
                    Q1_ShiftWorkDone: null,
                    Q1_ShiftWorkProblems: null,
                    Q1_SafetyEquipment: null,
                    Q1_ExaminersComments: null,
                    Q2_Operation: null,
                    Q2_Accident: null,
                    Q2_SportsInjury: null,
                    Q2_YesWhen: null,
                    Q2_TimeOfWork: null,
                    Q2_HowLongOff: null,
                    Q2_HowLongModified: null,
                    Q2_HowLongTreatment: null,
                    Q2_NormalDuties: null,
                    Q2_Compensation: null,
                    Q2_PsychologicalProblems: null,
                    Q2_ExaminersComments: null,
                    Q2_DentalHealth: null,
                    Q2_Diabetic: null,
                    Q2_Seizure: null,
                    Q2_Epileptic: null,
                    Q2_Asthmatic: null,
                    Q2_AnyScars: null,
                    Q2_MedicAlert: null,
                    Q3_NeckInjury: null,
                    Q3_DiskInjury: null,
                    Q3_Backache: null,
                    Q3_Physio: null,
                    Q3_BackInjury: null,
                    Q3_Sciatica: null,
                    Q3_BackSurgery: null,
                    Q3_SwollenJoints: null,
                    Q3_ArthriticKnee: null,
                    Q3_Arm: null,
                    Q3_HandInjury: null,
                    Q3_LegInjury: null,
                    Q3_KneeCartilage: null,
                    Q3_KneeReconstruction: null,
                    Q3_FootProblems: null,
                    Q3_OtherBone: null,
                    Q3_Rheumatism: null,
                    Q3_RSI: null,
                    Q3_Hernia: null,
                    Q4_MentalHealth: null,
                    Q4_Psychologist: null,
                    Q4_DrugsProblems: null,
                    Q4_Depression: null,
                    Q4_PanicAttacks: null,
                    Q4_NervousProblem: null,
                    Q4_Anxiety: null,
                    Q4_Insomnia: null,
                    Q5_Eczema: null,
                    Q5_Psoriasis: null,
                    Q5_SkinProblem: null,
                    Q5_Dermatitis: null,
                    Q5_SkinCancers: null,
                    Q6_Asthma: null,
                    Q6_LungDisease: null,
                    Q6_Artery: null,
                    Q6_HighBloodPressure: null,
                    Q6_DVT: null,
                    Q6_UsedPuffer: null,
                    Q6_CardiacPacemaker: null,
                    Q6_Emphysema: null,
                    Q6_HeartDisease: null,
                    Q6_Bronchitis: null,
                    Q6_CollapsedLung: null,
                    Q6_HeartAttack: null,
                    Q7_HeadInjury: null,
                    Q7_Epilepsy: null,
                    Q7_SevereHeadaches: null,
                    Q7_NeurologicalDisorder: null,
                    Q8_DOInsulin: null,
                    Q8_DOMedication: null,
                    Q8_DietControl: null,
                    Q8_KidneyProblems: null,
                    Q8_LiverDisease: null,
                    Q8_HearingLoss: null,
                    Q8_Exhaustion: null,
                    Q8_Arthritis: null,
                    Q8_BloodDisorder: null,
                    Q8_Cancer: null,
                    Q8_BowelProblems: null,
                    Q8_Hepatitis: null,
                    Q8_VisionProblem: null,
                    Q8_ChronicIllness: null,
                    Q9_Pregnant: null,
                    Q9_BreastFeeding: null,
                    Q9_ExaminersComments: null,
                    Q10_Disabilities: null,
                    Q11_Climb: null,
                    Q11_Bend: null,
                    Q11_WorkOverhead: null,
                    Q11_WorkHeights: null,
                    Q11_WorkIsolation: null,
                    Q11_Instruments: null,
                    Q11_WorkAwkward: null,
                    Q11_Squat: null,
                    Q11_Push: null,
                    Q11_WorkUnderground: null,
                    Q11_WorkDusty: null,
                    Q11_WorkConfined: null,
                    Q11_WorkGround: null,
                    Q11_WorkVibration: null,
                    Q12_LossFullBack: null,
                    Q12_LossFullLeg: null,
                    Q12_DifficultyHearing: null,
                    Q12_LossEye: null,
                    Q12_Glasses: null,
                    Q12_OtherLoss: null,
                    Q12_LossFullMovements: null,
                    Q12_OtherProblem: null,
                    Q12_LossFullArm: null,
                    Q12_Psychological: null,
                    Q12_Breathing: null,
                    Q12_ChronicSkin: null,
                    Q12_AlcoholMisuse: null,
                    Q12_LossMobility: null,
                    Q12_LossFullNeck: null,
                    Q12_ExaminersComments: null,
                    Q13_AdvisedToChange: null,
                    Q13_AdvisedToChangeComment: null,
                    Q13_AdvisedToLimit: null,
                    Q13_AdvisedToLimitComment: null,
                    Q13_OffInjury: null,
                    Q13_OffInjuryComment: null,
                    Q13_WhatWas: null,
                    Q13_Medi_Vac: null,
                    Q13_Details: null,
                    Q13_ExaminersComments: null,
                    Q14_WorkRelatedDisease: null,
                    Q14_Year: null,
                    Q14_HowLongOff: null,
                    Q14_HowLongModified: null,
                    Q14_HowLongTreatment: null,
                    Q14_NormalDuties: null,
                    Q14_Compensation: null,
                    Q14_Psychological: null,
                    Q14_Details: null,
                    Q14_WCClaim: null,
                    Q14_ExaminersComments: null,
                    Q15_TakeMedications: null,
                    Q15_ListMedication: null,
                    Q16_HayFever: null,
                    Q16_Eczema: null,
                    Q16_Allergic: null,
                    Q16_Adrenaline: null,
                    Q16_Epipen: null,
                    Q16_Asthma: null,
                    Q17_QFever: null,
                    Q17_HepatitisA: null,
                    Q17_Tetanus: null,
                    Q17_HepatitisB: null,
                    Q17_ExaminersComments: null,
                    Q18_IncreasedCough: null,
                    Q18_ChestIllness: null,
                    Q18_SOBHurrying: null,
                    Q18_SOBwalking: null,
                    Q18_SOBWakeUp: null,
                    Q18_CESWheezy: null,
                    Q18_CEFTight: null,
                    Q18_GivenPuffer: null,
                    Q18_LastTimePuffer: null,
                    Q19_Smoke: null,
                    Q19_SmokeDay: null,
                    Q19_SmokeWeek: null,
                    Q19_SmokeYear: null,
                    Q20_DrinkWeek: null,
                    Q20_DrinkMax: null,
                    Q21_Exercise: null,
                    Q21_PlaySport: null,
                    Q21_SportDetails: null,
                    Q21_IsFootball: null,
                    Q21_IsGolf: null,
                    Q21_IsTennis: null,
                    Q21_IsSquash: null,
                    Q21_IsBowls: null,
                    Q21_IsGym: null,
                    Q21_IsOther: null,
                    Q22_SleepDisorder: null,
                    Q22_Choking: null,
                    Q22_UseCPAP: null,
                    Q23_SittingReading: null,
                    Q23_WatchingTV: null,
                    Q23_Inactive: null,
                    Q23_Passenger: null,
                    Q23_LyingDown: null,
                    Q23_SittingTalking: null,
                    Q23_SittingQuietly: null,
                    Q23_InACar: null,
                    Q23_TotalScore: null,
                    Signature: null,
                    GorgonDate: new Date(),
                    Created_by: null,
                    Last_updated_by: null,
                    CalId: cal_id,

                    DocId: null, //$cookieStore.get('doctorInfo').doctor_id,

                    Q21_IsComment: null,
                    Q21Other1Comment: null,
                    PATIENT_SIGNATURE: null
                }
                var oriInfo;

                $scope.totals = [
                    {
                        id: 0
                    },
                    {
                        id: 1
                    },
                    {
                        id: 2
                    },
                    {
                        id: 3
                    }
                ];

                $scope.maxDate = new Date();
                var info = $scope.info;
                DocumentService.loadGGMH(info)
                    .then(function (response) {
                        if (response['status'] === 'fail') {
                            $state.go('loggedIn.home', null, {
                                reload: true
                            });
                        } else if (response[0].status === 'findNull') {
                            $scope.isNew = true;
                            $scope.info.patient = response[0].patient;
                            oriInfo = angular.copy($scope.info);
                        } else if (response[0].status === 'findFound') {
                            $scope.isNew = false;
                            //find found
                            var data = response[0].data;
                            $scope.info = {
                                patient: response[0].patient,
                                Gorgon_Id: data.Gorgon_Id,
                                Patient_Id: data.Patient_Id,
                                JobNo: data.JobNo,
                                Occupation: data.Occupation,
                                JobLocation: data.JobLocation,
                                SpecificLocation: data.SpecificLocation,
                                PhoneNumber: data.PhoneNumber,
                                Q1_YearFrom1: data.Q1_YearFrom1,
                                Q1_YearFrom2: data.Q1_YearFrom2,
                                Q1_YearTo1: data.Q1_YearTo1,
                                Q1_YearTo2: data.Q1_YearTo2,
                                Q1_Job1: data.Q1_Job1,
                                Q1_Job2: data.Q1_Job2,
                                Q1_Employer1: data.Q1_Employer1,
                                Q1_Employer2: data.Q1_Employer2,
                                Q1_TypeOfWork: data.Q1_TypeOfWork,
                                Q1_WorkPast: data.Q1_WorkPast,
                                Q1_WorkEnvironment: data.Q1_WorkEnvironment,
                                Q1_AnyProblems: data.Q1_AnyProblems,
                                Q1_CauseProblems: data.Q1_CauseProblems,
                                Q1_Underground: data.Q1_Underground,
                                Q1_GrainDust: data.Q1_GrainDust,
                                Q1_RemoteEnv: data.Q1_RemoteEnv,
                                Q1_AtHeights: data.Q1_AtHeights,
                                Q1_WetConditions: data.Q1_WetConditions,
                                Q1_Nickel: data.Q1_Nickel,
                                Q1_HumidConditions: data.Q1_HumidConditions,
                                Q1_FIFO: data.Q1_FIFO,
                                Q1_FIFODone: data.Q1_FIFODone,
                                Q1_FIFOProblems: data.Q1_FIFOProblems,
                                Q1_ShiftWork: data.Q1_ShiftWork,
                                Q1_ShiftWorkDone: data.Q1_ShiftWorkDone,
                                Q1_ShiftWorkProblems: data.Q1_ShiftWorkProblems,
                                Q1_SafetyEquipment: data.Q1_SafetyEquipment,
                                Q1_ExaminersComments: data.Q1_ExaminersComments,
                                Q2_Operation: data.Q2_Operation,
                                Q2_Accident: data.Q2_Accident,
                                Q2_SportsInjury: data.Q2_SportsInjury,
                                Q2_YesWhen: data.Q2_YesWhen,
                                Q2_TimeOfWork: data.Q2_TimeOfWork,
                                Q2_HowLongOff: data.Q2_HowLongOff,
                                Q2_HowLongModified: data.Q2_HowLongModified,
                                Q2_HowLongTreatment: data.Q2_HowLongTreatment,
                                Q2_NormalDuties: data.Q2_NormalDuties,
                                Q2_Compensation: data.Q2_Compensation,
                                Q2_PsychologicalProblems: data.Q2_PsychologicalProblems,
                                Q2_ExaminersComments: data.Q2_ExaminersComments,
                                Q2_DentalHealth: data.Q2_DentalHealth,
                                Q2_Diabetic: data.Q2_Diabetic,
                                Q2_Seizure: data.Q2_Seizure,
                                Q2_Epileptic: data.Q2_Epileptic,
                                Q2_Asthmatic: data.Q2_Asthmatic,
                                Q2_AnyScars: data.Q2_AnyScars,
                                Q2_MedicAlert: data.Q2_MedicAlert,
                                Q3_NeckInjury: data.Q3_NeckInjury,
                                Q3_DiskInjury: data.Q3_DiskInjury,
                                Q3_Backache: data.Q3_Backache,
                                Q3_Physio: data.Q3_Physio,
                                Q3_BackInjury: data.Q3_BackInjury,
                                Q3_Sciatica: data.Q3_Sciatica,
                                Q3_BackSurgery: data.Q3_BackSurgery,
                                Q3_SwollenJoints: data.Q3_SwollenJoints,
                                Q3_ArthriticKnee: data.Q3_ArthriticKnee,
                                Q3_Arm: data.Q3_Arm,
                                Q3_HandInjury: data.Q3_HandInjury,
                                Q3_LegInjury: data.Q3_LegInjury,
                                Q3_KneeCartilage: data.Q3_KneeCartilage,
                                Q3_KneeReconstruction: data.Q3_KneeReconstruction,
                                Q3_FootProblems: data.Q3_FootProblems,
                                Q3_OtherBone: data.Q3_OtherBone,
                                Q3_Rheumatism: data.Q3_Rheumatism,
                                Q3_RSI: data.Q3_RSI,
                                Q3_Hernia: data.Q3_Hernia,
                                Q4_MentalHealth: data.Q4_MentalHealth,
                                Q4_Psychologist: data.Q4_Psychologist,
                                Q4_DrugsProblems: data.Q4_DrugsProblems,
                                Q4_Depression: data.Q4_Depression,
                                Q4_PanicAttacks: data.Q4_PanicAttacks,
                                Q4_NervousProblem: data.Q4_NervousProblem,
                                Q4_Anxiety: data.Q4_Anxiety,
                                Q4_Insomnia: data.Q4_Insomnia,
                                Q5_Eczema: data.Q5_Eczema,
                                Q5_Psoriasis: data.Q5_Psoriasis,
                                Q5_SkinProblem: data.Q5_SkinProblem,
                                Q5_Dermatitis: data.Q5_Dermatitis,
                                Q5_SkinCancers: data.Q5_SkinCancers,
                                Q6_Asthma: data.Q6_Asthma,
                                Q6_LungDisease: data.Q6_LungDisease,
                                Q6_Artery: data.Q6_Artery,
                                Q6_HighBloodPressure: data.Q6_HighBloodPressure,
                                Q6_DVT: data.Q6_DVT,
                                Q6_UsedPuffer: data.Q6_UsedPuffer,
                                Q6_CardiacPacemaker: data.Q6_CardiacPacemaker,
                                Q6_Emphysema: data.Q6_Emphysema,
                                Q6_HeartDisease: data.Q6_HeartDisease,
                                Q6_Bronchitis: data.Q6_Bronchitis,
                                Q6_CollapsedLung: data.Q6_CollapsedLung,
                                Q6_HeartAttack: data.Q6_HeartAttack,
                                Q7_HeadInjury: data.Q7_HeadInjury,
                                Q7_Epilepsy: data.Q7_Epilepsy,
                                Q7_SevereHeadaches: data.Q7_SevereHeadaches,
                                Q7_NeurologicalDisorder: data.Q7_NeurologicalDisorder,
                                Q8_DOInsulin: data.Q8_DOInsulin,
                                Q8_DOMedication: data.Q8_DOMedication,
                                Q8_DietControl: data.Q8_DietControl,
                                Q8_KidneyProblems: data.Q8_KidneyProblems,
                                Q8_LiverDisease: data.Q8_LiverDisease,
                                Q8_HearingLoss: data.Q8_HearingLoss,
                                Q8_Exhaustion: data.Q8_Exhaustion,
                                Q8_Arthritis: data.Q8_Arthritis,
                                Q8_BloodDisorder: data.Q8_BloodDisorder,
                                Q8_Cancer: data.Q8_Cancer,
                                Q8_BowelProblems: data.Q8_BowelProblems,
                                Q8_Hepatitis: data.Q8_Hepatitis,
                                Q8_VisionProblem: data.Q8_VisionProblem,
                                Q8_ChronicIllness: data.Q8_ChronicIllness,
                                Q9_Pregnant: data.Q9_Pregnant,
                                Q9_BreastFeeding: data.Q9_BreastFeeding,
                                Q9_ExaminersComments: data.Q9_ExaminersComments,
                                Q10_Disabilities: data.Q10_Disabilities,
                                Q11_Climb: data.Q11_Climb,
                                Q11_Bend: data.Q11_Bend,
                                Q11_WorkOverhead: data.Q11_WorkOverhead,
                                Q11_WorkHeights: data.Q11_WorkHeights,
                                Q11_WorkIsolation: data.Q11_WorkIsolation,
                                Q11_Instruments: data.Q11_Instruments,
                                Q11_WorkAwkward: data.Q11_WorkAwkward,
                                Q11_Squat: data.Q11_Squat,
                                Q11_Push: data.Q11_Push,
                                Q11_WorkUnderground: data.Q11_WorkUnderground,
                                Q11_WorkDusty: data.Q11_WorkDusty,
                                Q11_WorkConfined: data.Q11_WorkConfined,
                                Q11_WorkGround: data.Q11_WorkGround,
                                Q11_WorkVibration: data.Q11_WorkVibration,
                                Q12_LossFullBack: data.Q12_LossFullBack,
                                Q12_LossFullLeg: data.Q12_LossFullLeg,
                                Q12_DifficultyHearing: data.Q12_DifficultyHearing,
                                Q12_LossEye: data.Q12_LossEye,
                                Q12_Glasses: data.Q12_Glasses,
                                Q12_OtherLoss: data.Q12_OtherLoss,
                                Q12_LossFullMovements: data.Q12_LossFullMovements,
                                Q12_OtherProblem: data.Q12_OtherProblem,
                                Q12_LossFullArm: data.Q12_LossFullArm,
                                Q12_Psychological: data.Q12_Psychological,
                                Q12_Breathing: data.Q12_Breathing,
                                Q12_ChronicSkin: data.Q12_ChronicSkin,
                                Q12_AlcoholMisuse: data.Q12_AlcoholMisuse,
                                Q12_LossMobility: data.Q12_LossMobility,
                                Q12_LossFullNeck: data.Q12_LossFullNeck,
                                Q12_ExaminersComments: data.Q12_ExaminersComments,
                                Q13_AdvisedToChange: data.Q13_AdvisedToChange,
                                Q13_AdvisedToChangeComment: data.Q13_AdvisedToChangeComment,
                                Q13_AdvisedToLimit: data.Q13_AdvisedToLimit,
                                Q13_AdvisedToLimitComment: data.Q13_AdvisedToLimitComment,
                                Q13_OffInjury: data.Q13_OffInjury,
                                Q13_OffInjuryComment: data.Q13_OffInjuryComment,
                                Q13_WhatWas: data.Q13_WhatWas,
                                Q13_Medi_Vac: data.Q13_Medi_Vac,
                                Q13_Details: data.Q13_Details,
                                Q13_ExaminersComments: data.Q13_ExaminersComments,
                                Q14_WorkRelatedDisease: data.Q14_WorkRelatedDisease,
                                Q14_Year: data.Q14_Year,
                                Q14_HowLongOff: data.Q14_HowLongOff,
                                Q14_HowLongModified: data.Q14_HowLongModified,
                                Q14_HowLongTreatment: data.Q14_HowLongTreatment,
                                Q14_NormalDuties: data.Q14_NormalDuties,
                                Q14_Compensation: data.Q14_Compensation,
                                Q14_Psychological: data.Q14_Psychological,
                                Q14_Details: data.Q14_Details,
                                Q14_WCClaim: data.Q14_WCClaim,
                                Q14_ExaminersComments: data.Q14_ExaminersComments,
                                Q15_TakeMedications: data.Q15_TakeMedications,
                                Q15_ListMedication: data.Q15_ListMedication,
                                Q16_HayFever: data.Q16_HayFever,
                                Q16_Eczema: data.Q16_Eczema,
                                Q16_Allergic: data.Q16_Allergic,
                                Q16_Adrenaline: data.Q16_Adrenaline,
                                Q16_Epipen: data.Q16_Epipen,
                                Q16_Asthma: data.Q16_Asthma,
                                Q17_QFever: data.Q17_QFever,
                                Q17_HepatitisA: data.Q17_HepatitisA,
                                Q17_Tetanus: data.Q17_Tetanus,
                                Q17_HepatitisB: data.Q17_HepatitisB,
                                Q17_ExaminersComments: data.Q17_ExaminersComments,
                                Q18_IncreasedCough: data.Q18_IncreasedCough,
                                Q18_ChestIllness: data.Q18_ChestIllness,
                                Q18_SOBHurrying: data.Q18_SOBHurrying,
                                Q18_SOBwalking: data.Q18_SOBwalking,
                                Q18_SOBWakeUp: data.Q18_SOBWakeUp,
                                Q18_CESWheezy: data.Q18_CESWheezy,
                                Q18_CEFTight: data.Q18_CEFTight,
                                Q18_GivenPuffer: data.Q18_GivenPuffer,
                                Q18_LastTimePuffer: data.Q18_LastTimePuffer,
                                Q19_Smoke: data.Q19_Smoke,
                                Q19_SmokeDay: data.Q19_SmokeDay,
                                Q19_SmokeWeek: data.Q19_SmokeWeek,
                                Q19_SmokeYear: data.Q19_SmokeYear,
                                Q20_DrinkWeek: data.Q20_DrinkWeek,
                                Q20_DrinkMax: data.Q20_DrinkMax,
                                Q21_Exercise: data.Q21_Exercise,
                                Q21_PlaySport: data.Q21_PlaySport,
                                Q21_SportDetails: data.Q21_SportDetails,
                                Q21_IsFootball: data.Q21_IsFootball,
                                Q21_IsGolf: data.Q21_IsGolf,
                                Q21_IsTennis: data.Q21_IsTennis,
                                Q21_IsSquash: data.Q21_IsSquash,
                                Q21_IsBowls: data.Q21_IsBowls,
                                Q21_IsGym: data.Q21_IsGym,
                                Q21_IsOther: data.Q21_IsOther,
                                Q22_SleepDisorder: data.Q22_SleepDisorder,
                                Q22_Choking: data.Q22_Choking,
                                Q22_UseCPAP: data.Q22_UseCPAP,
                                Q23_SittingReading: data.Q23_SittingReading,
                                Q23_WatchingTV: data.Q23_WatchingTV,
                                Q23_Inactive: data.Q23_Inactive,
                                Q23_Passenger: data.Q23_Passenger,
                                Q23_LyingDown: data.Q23_LyingDown,
                                Q23_SittingTalking: data.Q23_SittingTalking,
                                Q23_SittingQuietly: data.Q23_SittingQuietly,
                                Q23_InACar: data.Q23_InACar,
                                Q23_TotalScore: data.Q23_TotalScore,
                                Signature: data.Signature,
                                GorgonDate: data.GorgonDate,
                                Created_by: data.Created_by,
                                Last_updated_by: data.Last_updated_by,
                                CalId: data.CalId,
                                DocId: data.DocId,
                                Q21_IsComment: data.Q21Other1Comment,
                                Q21Other1Comment: data.Q21Other1Comment,
                                PATIENT_SIGNATURE: data.PATIENT_SIGNATURE
                            };

                            /*
                             * begin Check comment from q3 to q9
                             */
                            var Examiner_Comments = $scope.info.Q9_ExaminersComments;
                            var temp = [];
                            var i = 0;
                            while (Examiner_Comments != '' && Examiner_Comments != null && Examiner_Comments != 'undefined') {
                                var location = Examiner_Comments.search("\r\n");
                                if (location == -1) {
                                    temp[i] = Examiner_Comments;
                                    Examiner_Comments = '';
                                }
                                else {
                                    temp[i] = Examiner_Comments.substring(0, location);
                                    Examiner_Comments = Examiner_Comments.substring(temp[i].length + 2, Examiner_Comments.length);
                                }
                                i++;
                            }
                            $scope.info.Q3_ExaminersComments = temp[0];
                            $scope.info.Q4_ExaminersComments = temp[1];
                            $scope.info.Q5_ExaminersComments = temp[2];
                            $scope.info.Q6_ExaminersComments = temp[3];
                            $scope.info.Q7_ExaminersComments = temp[4];
                            $scope.info.Q8_ExaminersComments = temp[5];
                            $scope.info.Q9_ExaminersComments_details = temp[6];
                            /*
                             * end Check comment from q3 to q9
                             */

                            oriInfo = angular.copy($scope.info);
                        } else {
                            $state.go('loggedIn.home', null, {
                                reload: true
                            });
                        }
                    });

                $scope.resetForm = function () {
                    $scope.info = angular.copy(oriInfo);
                    $scope.gorgonMHForm.$setPristine();
                }

                $scope.infoChanged = function () {
                    return !angular.equals(oriInfo, $scope.info);
                }

                $scope.submit = function (gorgonMHForm) {
                    //begin set value total score
                    $scope.info.Q23_TotalScore = $scope.info.Q23_SittingReading + $scope.info.Q23_WatchingTV +
                    $scope.info.Q23_Inactive + $scope.info.Q23_Passenger +
                    $scope.info.Q23_LyingDown + $scope.info.Q23_SittingTalking +
                    $scope.info.Q23_SittingQuietly + $scope.info.Q23_InACar + 0;
                    //end set value total score

                    //begin comment q3-q9
                    $scope.info.Q9_ExaminersComments = (($scope.info.Q3_ExaminersComments != null && $scope.info.Q3_ExaminersComments != '' && $scope.info.Q3_ExaminersComments != 'undefined') ? $scope.info.Q3_ExaminersComments : '') + "\r\n" +
                    (($scope.info.Q4_ExaminersComments != null && $scope.info.Q4_ExaminersComments != '' && $scope.info.Q4_ExaminersComments != 'undefined') ? $scope.info.Q4_ExaminersComments : '') + "\r\n" +
                    (($scope.info.Q5_ExaminersComments != null && $scope.info.Q5_ExaminersComments != '' && $scope.info.Q5_ExaminersComments != 'undefined') ? $scope.info.Q5_ExaminersComments : '') + "\r\n" +
                    (($scope.info.Q6_ExaminersComments != null && $scope.info.Q6_ExaminersComments != '' && $scope.info.Q6_ExaminersComments != 'undefined') ? $scope.info.Q6_ExaminersComments : '') + "\r\n" +
                    (($scope.info.Q7_ExaminersComments != null && $scope.info.Q7_ExaminersComments != '' && $scope.info.Q7_ExaminersComments != 'undefined') ? $scope.info.Q7_ExaminersComments : '') + "\r\n" +
                    (($scope.info.Q8_ExaminersComments != null && $scope.info.Q8_ExaminersComments != '' && $scope.info.Q8_ExaminersComments != 'undefined') ? $scope.info.Q8_ExaminersComments : '') + "\r\n" +
                    (($scope.info.Q9_ExaminersComments_details != null && $scope.info.Q9_ExaminersComments_details != '' && $scope.info.Q9_ExaminersComments_details != 'undefined') ? $scope.info.Q9_ExaminersComments_details : '');
                    //end comment q3-q9
                    if (gorgonMHForm.$error.maxlength || gorgonMHForm.$error.required) {
                        toastr.error("Please Input All Required Information!", "Error");
                    }
                    else {
                        var info = $scope.info;
                        if ($scope.isNew === true) {
                            //add new gorgon medical history
                            DocumentService.insertGGMH(info).then(function (response) {
                                if (response['status'] === 'success') {
                                    toastr.success("Add new success!", "Success");
                                    $state.go('loggedIn.gorgonMH', null, {
                                        "reload": true
                                    });
                                } else if (response['status'] === 'fail')
                                    toastr.error("Add new fail!", "Error");

                            });
                        }
                        else if ($scope.isNew === false) {
                            //update gorgon medical history
                            DocumentService.editGGMH(info).then(function (response) {
                                if (response['status'] === 'success') {
                                    toastr.success("Update success!", "Success");
                                    $state.go('loggedIn.gorgonMH', null, {
                                        "reload": true
                                    });
                                } else if (response['status'] === 'fail')
                                    toastr.error("Update fail!", "Error");

                            });
                        }
                    }
                }
            }
        }
    });
