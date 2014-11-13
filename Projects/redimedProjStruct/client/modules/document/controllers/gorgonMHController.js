angular.module('app.loggedIn.document.gorgonMH.controllers', [])
    .controller("gorgonMHController", function ($filter, DocumentService, $scope, $rootScope, $http, $cookieStore, toastr, $state) {
        //begin date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.today = new Date();
        //end date
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist");
            $state.go('loggedIn.home', null, {"reload": true});
        }
        else {
            //set value default
            $scope.info = {
                Gorgon_Id: null,
                Patient_Id: null,
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
                GorgonDate: null,
                Created_by: null,
                Creation_date: null,
                Last_updated_by: null,
                Last_update_date: null,
                CalId: null,
                DocId: null,
                Q21_IsComment: null,
                Q21Other1Comment: null,
                PATIENT_SIGNATURE: null
            }
            var oriInfo = angular.copy($scope.info);
            $scope.totals = [
                {id: 0},
                {id: 1},
                {id: 2},
                {id: 3}
            ];
            $scope.check_comment = function () {
                if ($scope.info.Q21_IsComment == 1) {
                    $scope.info.Q21_IsComment.checked = true;
                }
                else if ($scope.info.Q21_IsComment == 0) {
                    $scope.info.Q21_IsComment.checked = false;
                    $scope.info.Q21_IsComment = 0;
                }

            }
            $scope.maxDate = new Date();
            var info = $scope.info;
            DocumentService.loadGGMH(info)
                .then(function (response) {
                    if (response['status'] === 'fail') {
                        $state.go('loggedIn.home', null, {reload: true});
                    }
                    else if (response['status'] === 'findNull') {
                        $scope.isNew = true;
                    }
                    else if (response[0].status === 'success') {
                        $scope.isNew = false;
                        //find found
                        var data = response[0].data;
                        $scope.info = {
                            Gorgon_Id: data[0].Gorgon_Id,
                            Patient_Id: data[0].Patient_Id,
                            JobNo: data[0].JobNo,
                            Occupation: data[0].Occupation,
                            JobLocation: data[0].JobLocation,
                            SpecificLocation: data[0].SpecificLocation,
                            PhoneNumber: data[0].PhoneNumber,
                            Q1_YearFrom1: data[0].Q1_YearFrom1,
                            Q1_YearFrom2: data[0].Q1_YearFrom2,
                            Q1_YearTo1: data[0].Q1_YearTo1,
                            Q1_YearTo2: data[0].Q1_YearTo2,
                            Q1_Job1: data[0].Q1_Job1,
                            Q1_Job2: data[0].Q1_Job2,
                            Q1_Employer1: data[0].Q1_Employer1,
                            Q1_Employer2: data[0].Q1_Employer2,
                            Q1_TypeOfWork: data[0].Q1_TypeOfWork,
                            Q1_WorkPast: data[0].Q1_WorkPast,
                            Q1_WorkEnvironment: data[0].Q1_WorkEnvironment,
                            Q1_AnyProblems: data[0].Q1_AnyProblems,
                            Q1_CauseProblems: data[0].Q1_CauseProblems,
                            Q1_Underground: data[0].Q1_Underground,
                            Q1_GrainDust: data[0].Q1_GrainDust,
                            Q1_RemoteEnv: data[0].Q1_RemoteEnv,
                            Q1_AtHeights: data[0].Q1_AtHeights,
                            Q1_WetConditions: data[0].Q1_WetConditions,
                            Q1_Nickel: data[0].Q1_Nickel,
                            Q1_HumidConditions: data[0].Q1_HumidConditions,
                            Q1_FIFO: data[0].Q1_FIFO,
                            Q1_FIFODone: data[0].Q1_FIFODone,
                            Q1_FIFOProblems: data[0].Q1_FIFOProblems,
                            Q1_ShiftWork: data[0].Q1_ShiftWork,
                            Q1_ShiftWorkDone: data[0].Q1_ShiftWorkDone,
                            Q1_ShiftWorkProblems: data[0].Q1_ShiftWorkProblems,
                            Q1_SafetyEquipment: data[0].Q1_SafetyEquipment,
                            Q1_ExaminersComments: data[0].Q1_ExaminersComments,
                            Q2_Operation: data[0].Q2_Operation,
                            Q2_Accident: data[0].Q2_Accident,
                            Q2_SportsInjury: data[0].Q2_SportsInjury,
                            Q2_YesWhen: data[0].Q2_YesWhen,
                            Q2_TimeOfWork: data[0].Q2_TimeOfWork,
                            Q2_HowLongOff: data[0].Q2_HowLongOff,
                            Q2_HowLongModified: data[0].Q2_HowLongModified,
                            Q2_HowLongTreatment: data[0].Q2_HowLongTreatment,
                            Q2_NormalDuties: data[0].Q2_NormalDuties,
                            Q2_Compensation: data[0].Q2_Compensation,
                            Q2_PsychologicalProblems: data[0].Q2_PsychologicalProblems,
                            Q2_ExaminersComments: data[0].Q2_ExaminersComments,
                            Q2_DentalHealth: data[0].Q2_DentalHealth,
                            Q2_Diabetic: data[0].Q2_Diabetic,
                            Q2_Seizure: data[0].Q2_Seizure,
                            Q2_Epileptic: data[0].Q2_Epileptic,
                            Q2_Asthmatic: data[0].Q2_Asthmatic,
                            Q2_AnyScars: data[0].Q2_AnyScars,
                            Q2_MedicAlert: data[0].Q2_MedicAlert,
                            Q3_NeckInjury: data[0].Q3_NeckInjury,
                            Q3_DiskInjury: data[0].Q3_DiskInjury,
                            Q3_Backache: data[0].Q3_Backache,
                            Q3_Physio: data[0].Q3_Physio,
                            Q3_BackInjury: data[0].Q3_BackInjury,
                            Q3_Sciatica: data[0].Q3_Sciatica,
                            Q3_BackSurgery: data[0].Q3_BackSurgery,
                            Q3_SwollenJoints: data[0].Q3_SwollenJoints,
                            Q3_ArthriticKnee: data[0].Q3_ArthriticKnee,
                            Q3_Arm: data[0].Q3_Arm,
                            Q3_HandInjury: data[0].Q3_HandInjury,
                            Q3_LegInjury: data[0].Q3_LegInjury,
                            Q3_KneeCartilage: data[0].Q3_KneeCartilage,
                            Q3_KneeReconstruction: data[0].Q3_KneeReconstruction,
                            Q3_FootProblems: data[0].Q3_FootProblems,
                            Q3_OtherBone: data[0].Q3_OtherBone,
                            Q3_Rheumatism: data[0].Q3_Rheumatism,
                            Q3_RSI: data[0].Q3_RSI,
                            Q3_Hernia: data[0].Q3_Hernia,
                            Q4_MentalHealth: data[0].Q4_MentalHealth,
                            Q4_Psychologist: data[0].Q4_Psychologist,
                            Q4_DrugsProblems: data[0].Q4_DrugsProblems,
                            Q4_Depression: data[0].Q4_Depression,
                            Q4_PanicAttacks: data[0].Q4_PanicAttacks,
                            Q4_NervousProblem: data[0].Q4_NervousProblem,
                            Q4_Anxiety: data[0].Q4_Anxiety,
                            Q4_Insomnia: data[0].Q4_Insomnia,
                            Q5_Eczema: data[0].Q5_Eczema,
                            Q5_Psoriasis: data[0].Q5_Psoriasis,
                            Q5_SkinProblem: data[0].Q5_SkinProblem,
                            Q5_Dermatitis: data[0].Q5_Dermatitis,
                            Q5_SkinCancers: data[0].Q5_SkinCancers,
                            Q6_Asthma: data[0].Q6_Asthma,
                            Q6_LungDisease: data[0].Q6_LungDisease,
                            Q6_Artery: data[0].Q6_Artery,
                            Q6_HighBloodPressure: data[0].Q6_HighBloodPressure,
                            Q6_DVT: data[0].Q6_DVT,
                            Q6_UsedPuffer: data[0].Q6_UsedPuffer,
                            Q6_CardiacPacemaker: data[0].Q6_CardiacPacemaker,
                            Q6_Emphysema: data[0].Q6_Emphysema,
                            Q6_HeartDisease: data[0].Q6_HeartDisease,
                            Q6_Bronchitis: data[0].Q6_Bronchitis,
                            Q6_CollapsedLung: data[0].Q6_CollapsedLung,
                            Q6_HeartAttack: data[0].Q6_HeartAttack,
                            Q7_HeadInjury: data[0].Q7_HeadInjury,
                            Q7_Epilepsy: data[0].Q7_Epilepsy,
                            Q7_SevereHeadaches: data[0].Q7_SevereHeadaches,
                            Q7_NeurologicalDisorder: data[0].Q7_NeurologicalDisorder,
                            Q8_DOInsulin: data[0].Q8_DOInsulin,
                            Q8_DOMedication: data[0].Q8_DOMedication,
                            Q8_DietControl: data[0].Q8_DietControl,
                            Q8_KidneyProblems: data[0].Q8_KidneyProblems,
                            Q8_LiverDisease: data[0].Q8_LiverDisease,
                            Q8_HearingLoss: data[0].Q8_HearingLoss,
                            Q8_Exhaustion: data[0].Q8_Exhaustion,
                            Q8_Arthritis: data[0].Q8_Arthritis,
                            Q8_BloodDisorder: data[0].Q8_BloodDisorder,
                            Q8_Cancer: data[0].Q8_Cancer,
                            Q8_BowelProblems: data[0].Q8_BowelProblems,
                            Q8_Hepatitis: data[0].Q8_Hepatitis,
                            Q8_VisionProblem: data[0].Q8_VisionProblem,
                            Q8_ChronicIllness: data[0].Q8_ChronicIllness,
                            Q9_Pregnant: data[0].Q9_Pregnant,
                            Q9_BreastFeeding: data[0].Q9_BreastFeeding,
                            Q9_ExaminersComments: data[0].Q9_ExaminersComments,
                            Q10_Disabilities: data[0].Q10_Disabilities,
                            Q11_Climb: data[0].Q11_Climb,
                            Q11_Bend: data[0].Q11_Bend,
                            Q11_WorkOverhead: data[0].Q11_WorkOverhead,
                            Q11_WorkHeights: data[0].Q11_WorkHeights,
                            Q11_WorkIsolation: data[0].Q11_WorkIsolation,
                            Q11_Instruments: data[0].Q11_Instruments,
                            Q11_WorkAwkward: data[0].Q11_WorkAwkward,
                            Q11_Squat: data[0].Q11_Squat,
                            Q11_Push: data[0].Q11_Push,
                            Q11_WorkUnderground: data[0].Q11_WorkUnderground,
                            Q11_WorkDusty: data[0].Q11_WorkDusty,
                            Q11_WorkConfined: data[0].Q11_WorkConfined,
                            Q11_WorkGround: data[0].Q11_WorkGround,
                            Q11_WorkVibration: data[0].Q11_WorkVibration,
                            Q12_LossFullBack: data[0].Q12_LossFullBack,
                            Q12_LossFullLeg: data[0].Q12_LossFullLeg,
                            Q12_DifficultyHearing: data[0].Q12_DifficultyHearing,
                            Q12_LossEye: data[0].Q12_LossEye,
                            Q12_Glasses: data[0].Q12_Glasses,
                            Q12_OtherLoss: data[0].Q12_OtherLoss,
                            Q12_LossFullMovements: data[0].Q12_LossFullMovements,
                            Q12_OtherProblem: data[0].Q12_OtherProblem,
                            Q12_LossFullArm: data[0].Q12_LossFullArm,
                            Q12_Psychological: data[0].Q12_Psychological,
                            Q12_Breathing: data[0].Q12_Breathing,
                            Q12_ChronicSkin: data[0].Q12_ChronicSkin,
                            Q12_AlcoholMisuse: data[0].Q12_AlcoholMisuse,
                            Q12_LossMobility: data[0].Q12_LossMobility,
                            Q12_LossFullNeck: data[0].Q12_LossFullNeck,
                            Q12_ExaminersComments: data[0].Q12_ExaminersComments,
                            Q13_AdvisedToChange: data[0].Q13_AdvisedToChange,
                            Q13_AdvisedToChangeComment: data[0].Q13_AdvisedToChangeComment,
                            Q13_AdvisedToLimit: data[0].Q13_AdvisedToLimit,
                            Q13_AdvisedToLimitComment: data[0].Q13_AdvisedToLimitComment,
                            Q13_OffInjury: data[0].Q13_OffInjury,
                            Q13_OffInjuryComment: data[0].Q13_OffInjuryComment,
                            Q13_WhatWas: data[0].Q13_WhatWas,
                            Q13_Medi_Vac: data[0].Q13_Medi_Vac,
                            Q13_Details: data[0].Q13_Details,
                            Q13_ExaminersComments: data[0].Q13_ExaminersComments,
                            Q14_WorkRelatedDisease: data[0].Q14_WorkRelatedDisease,
                            Q14_Year: data[0].Q14_Year,
                            Q14_HowLongOff: data[0].Q14_HowLongOff,
                            Q14_HowLongModified: data[0].Q14_HowLongModified,
                            Q14_HowLongTreatment: data[0].Q14_HowLongTreatment,
                            Q14_NormalDuties: data[0].Q14_NormalDuties,
                            Q14_Compensation: data[0].Q14_Compensation,
                            Q14_Psychological: data[0].Q14_Psychological,
                            Q14_Details: data[0].Q14_Details,
                            Q14_WCClaim: data[0].Q14_WCClaim,
                            Q14_ExaminersComments: data[0].Q14_ExaminersComments,
                            Q15_TakeMedications: data[0].Q15_TakeMedications,
                            Q15_ListMedication: data[0].Q15_ListMedication,
                            Q16_HayFever: data[0].Q16_HayFever,
                            Q16_Eczema: data[0].Q16_Eczema,
                            Q16_Allergic: data[0].Q16_Allergic,
                            Q16_Adrenaline: data[0].Q16_Adrenaline,
                            Q16_Epipen: data[0].Q16_Epipen,
                            Q16_Asthma: data[0].Q16_Asthma,
                            Q17_QFever: data[0].Q17_QFever,
                            Q17_HepatitisA: data[0].Q17_HepatitisA,
                            Q17_Tetanus: data[0].Q17_Tetanus,
                            Q17_HepatitisB: data[0].Q17_HepatitisB,
                            Q17_ExaminersComments: data[0].Q17_ExaminersComments,
                            Q18_IncreasedCough: data[0].Q18_IncreasedCough,
                            Q18_ChestIllness: data[0].Q18_ChestIllness,
                            Q18_SOBHurrying: data[0].Q18_SOBHurrying,
                            Q18_SOBwalking: data[0].Q18_SOBwalking,
                            Q18_SOBWakeUp: data[0].Q18_SOBWakeUp,
                            Q18_CESWheezy: data[0].Q18_CESWheezy,
                            Q18_CEFTight: data[0].Q18_CEFTight,
                            Q18_GivenPuffer: data[0].Q18_GivenPuffer,
                            Q18_LastTimePuffer: data[0].Q18_LastTimePuffer,
                            Q19_Smoke: data[0].Q19_Smoke,
                            Q19_SmokeDay: data[0].Q19_SmokeDay,
                            Q19_SmokeWeek: data[0].Q19_SmokeWeek,
                            Q19_SmokeYear: data[0].Q19_SmokeYear,
                            Q20_DrinkWeek: data[0].Q20_DrinkWeek,
                            Q20_DrinkMax: data[0].Q20_DrinkMax,
                            Q21_Exercise: data[0].Q21_Exercise,
                            Q21_PlaySport: data[0].Q21_PlaySport,
                            Q21_SportDetails: data[0].Q21_SportDetails,
                            Q21_IsFootball: data[0].Q21_IsFootball,
                            Q21_IsGolf: data[0].Q21_IsGolf,
                            Q21_IsTennis: data[0].Q21_IsTennis,
                            Q21_IsSquash: data[0].Q21_IsSquash,
                            Q21_IsBowls: data[0].Q21_IsBowls,
                            Q21_IsGym: data[0].Q21_IsGym,
                            Q21_IsOther: data[0].Q21_IsOther,
                            Q22_SleepDisorder: data[0].Q22_SleepDisorder,
                            Q22_Choking: data[0].Q22_Choking,
                            Q22_UseCPAP: data[0].Q22_UseCPAP,
                            Q23_SittingReading: data[0].Q23_SittingReading,
                            Q23_WatchingTV: data[0].Q23_WatchingTV,
                            Q23_Inactive: data[0].Q23_Inactive,
                            Q23_Passenger: data[0].Q23_Passenger,
                            Q23_LyingDown: data[0].Q23_LyingDown,
                            Q23_SittingTalking: data[0].Q23_SittingTalking,
                            Q23_SittingQuietly: data[0].Q23_SittingQuietly,
                            Q23_InACar: data[0].Q23_InACar,
                            Q23_TotalScore: data[0].Q23_TotalScore,
                            Signature: data[0].Signature,
                            GorgonDate: data[0].GorgonDate,
                            Created_by: data[0].Created_by,
                            Creation_date: data[0].Creation_date,
                            Last_updated_by: data[0].Last_updated_by,
                            Last_update_date: data[0].Last_update_date,
                            CalId: data[0].CalId,
                            DocId: data[0].DocId,
                            Q21_IsComment: data[0].Q21Other1Comment,
                            Q21Other1Comment: data[0].Q21Other1Comment,
                            PATIENT_SIGNATURE: data[0].PATIENT_SIGNATURE
                        };
                        oriInfo = angular.copy($scope.info);
                        if ($scope.info.Q21_IsComment) {
                            $scope.info.Q21_IsComment.checked = true;
                        }
                    }
                    else {
                        $state.go('loggedIn.home', null, {reload: true});
                    }
                })

            $scope.resetForm = function () {
                $scope.info = angular.copy(oriInfo);
                $scope.gorgonMHForm.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }

            $scope.submit = function (gorgonMHForm) {
                if ($scope.isNew === true) {
                    /**
                     * edit gorgon medical history
                     */
                    if (gorgonMHForm.$error.maxlength || gorgonMHForm.$error.required) {
                        toastr.error("Please Input All Required Information!", "Error");
                    }
                    else {
                        var info = $scope.info;
                        DocumentService.insertGGMH(info)
                            .then(function (response) {
                                if (response['status'] === 'success') {
                                    toastr.success("Add success!", "Success");
                                    $state.go('loggedIn.gorgonMH', null, {"reload": true});
                                }
                                else if (response['status'] === 'fail')
                                    toastr.error("Add fail!", "Error");

                            })
                    }
                }
                else {
                    /**
                     * add new gorgon medical history
                     */
                    if ($scope.isNew === false) {
                        if (gorgonMHForm.$error.maxlength || gorgonMHForm.$error.required) {
                            toastr.error("Please Input All Required Information!", "Error");
                        }
                        else {
                            var info = $scope.info;
                            DocumentService.editGGMH(info)
                                .then(function (response) {
                                    if (response['status'] === 'success') {
                                        toastr.success("Edit success!", "Success");
                                        $state.go('loggedIn.gorgonMH', null, {"reload": true});
                                    }
                                    else if (response['status'] === 'fail')
                                        toastr.error("Edit fail!", "Error");

                                });
                        }
                    }

                }
            }
        }
    });