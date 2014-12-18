angular.module('app.loggedIn.document.gorgonUQ.controllers', [])

    .controller("gorgonUQController", function ($scope, $filter, DocumentService, $http, $cookieStore, localStorageService, $state, toastr, $window, $stateParams) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';

        //$scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        //var doctorInfo = $cookieStore.get('doctorInfo');
        var Patient_ID = $scope.patientInfo.Patient_id;
        var CalID = -1; // $scope.apptInfo.CAL_ID;

        function getAge(dateString) {
            var now = new Date();
            var birthDate = new Date(dateString);
            var age = now.getFullYear() - birthDate.getFullYear();
            var m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        $scope.info = {
            Patient_Id: Patient_ID,
            CalId: CalID
        };

        var oriInfo = angular.copy($scope.info);

        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.gorgonUQForm.$setPristine();
        }

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        }

        $scope.checkUseRespirator = function (value) {
            if (value == true) {
                $scope.info.isEyeIrritation = null;
                $scope.info.isSkinAllergies = null;
                $scope.info.isAnxiety = null;
                $scope.info.isGeneralWeakness = null;
                $scope.info.isOtherProblem = null;
            }

        };


        DocumentService.checkUser(Patient_ID, CalID).then(function (response) {
            if (response[0].status === 'fail') {
                $state.go("loggedIn.home", null, {"reload": true});
                toastr.error("Load fail!", "Error");
            }
            else if (response[0].status === 'findNull') {
                var date = new Date();
                $scope.isNew = true;
                $scope.maxDate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
            }
            else if (response[0].status === 'findFound') {
                $scope.isNew = false;
                var data = response[0].data;
                $scope.info = {
                    Quest_Id: data.Quest_Id,
                    Patient_Id: Patient_ID,
                    age: getAge($scope.patientInfo.DOB),
                    sex: $scope.patientInfo.Sex,
                    TodayDate: data.TodayDate,
                    Height: data.Height,
                    Weight: data.Weight,
                    JobTitle: data.JobTitle,
                    PhoneNumber: data.PhoneNumber,
                    BestTime: data.BestTime,
                    isReviewQuest: data.isReviewQuest,
                    isNRP: data.isNRP,
                    isOtherType: data.isOtherType,
                    isRespirator: data.isRespirator,
                    RespiratorType: data.RespiratorType,
                    isSmoke: data.isSmoke,
                    isSeizuresCondition: data.isSeizuresCondition,
                    isDiabetes: data.isDiabetes,
                    isAllergicReactions: data.isAllergicReactions,
                    isClaustrophobia: data.isClaustrophobia,
                    isTrouble: data.isTrouble,
                    isAsbestosis: data.isAsbestosis,
                    isAsthma: data.isAsthma,
                    isBronchitis: data.isBronchitis,
                    isEmphysema: data.isEmphysema,
                    isPneumonia: data.isPneumonia,
                    isTuberculosis: data.isTuberculosis,
                    isSilicosis: data.isSilicosis,
                    isPneumothorax: data.isPneumothorax,
                    isLungCancer: data.isLungCancer,
                    isBrokenRibs: data.isBrokenRibs,
                    isInjuries: data.isInjuries,
                    isOtherLung: data.isOtherLung,
                    OtherLungComment: data.OtherLungComment,
                    isSOB: data.isSOB,
                    isSOBWalkingFast: data.isSOBWalkingFast,
                    isSOBWalkingOther: data.isSOBWalkingOther,
                    isStopForBreath: data.isStopForBreath,
                    isSOBWashing: data.isSOBWashing,
                    isSOBInterferes: data.isSOBInterferes,
                    isCoughingPhlegm: data.isCoughingPhlegm,
                    isCoughingMorning: data.isCoughingMorning,
                    isCoughingLyingDown: data.isCoughingLyingDown,
                    isCoughingUpBlood: data.isCoughingUpBlood,
                    isWheezing: data.isWheezing,
                    isWheezingInterferes: data.isWheezingInterferes,
                    isChestPain: data.isChestPain,
                    isOtherSymptomsPulmonary: data.isOtherSymptomsPulmonary,
                    isHeartAttack: data.isHeartAttack,
                    isStroke: data.isStroke,
                    isAngina: data.isAngina,
                    isHeartFailure: data.isHeartFailure,
                    isSwelling: data.isSwelling,
                    isHeartArrhythmia: data.isHeartArrhythmia,
                    isBloodPressureHeart: data.isBloodPressureHeart,
                    isOtherHeart: data.isOtherHeart,
                    OtherHeartComment: data.OtherHeartComment,
                    isFrequentPain: data.isFrequentPain,
                    isPOTPhysical: data.isPOTPhysical,
                    isPOTInterferes: data.isPOTInterferes,
                    isMissingBeat: data.isMissingBeat,
                    isHeartburn: data.isHeartburn,
                    isOtherSymptomsHeart: data.isOtherSymptomsHeart,
                    isBreathing: data.isBreathing,
                    isHeartTrouble: data.isHeartTrouble,
                    isBloodPressureMedication: data.isBloodPressureMedication,
                    isSeizuresMedication: data.isSeizuresMedication,
                    isEyeIrritation: data.isEyeIrritation,
                    isSkinAllergies: data.isSkinAllergies,
                    isAnxiety: data.isAnxiety,
                    isGeneralWeakness: data.isGeneralWeakness,
                    isOtherProblem: data.isOtherProblem,
                    isTalk: data.isTalk,
                    isLostVision: data.isLostVision,
                    isContactLenses: data.isContactLenses,
                    isWearGlasses: data.isWearGlasses,
                    isColourBlind: data.isColourBlind,
                    isOtherEye: data.isOtherEye,
                    isInjuryEars: data.isInjuryEars,
                    isHearingProblems: data.isHearingProblems,
                    isDifficultyHearing: data.isDifficultyHearing,
                    isHearingAid: data.isHearingAid,
                    isOtherHearing: data.isOtherHearing,
                    isBackInjury: data.isBackInjury,
                    isWeaknessAny: data.isWeaknessAny,
                    isBackPain: data.isBackPain,
                    isDFMArmsLegs: data.isDFMArmsLegs,
                    isDFMHead: data.isDFMHead,
                    isPOSLeanForward: data.isPOSLeanForward,
                    isPODHead: data.isPODHead,
                    isDifficultyBending: data.isDifficultyBending,
                    isDifficultySquatting: data.isDifficultySquatting,
                    isClimbing: data.isClimbing,
                    isOtherMuscle: data.isOtherMuscle,
                    Department: data.Department,
                    SocialSecurity: data.SocialSecurity,
                    Supervisor: data.Supervisor,
                    isAtmosphere: data.isAtmosphere,
                    isContinuous: data.isContinuous,
                    isOpen: data.isOpen,
                    isClose: data.isClose,
                    isSupplied: data.isSupplied,
                    isCombination: data.isCombination,
                    isAir_NonPow: data.isAir_NonPow,
                    isAir_Pow: data.isAir_Pow,
                    LevelOfWE: data.LevelOfWE,
                    ExtentUsage: data.ExtentUsage,
                    LengthOfTime: data.LengthOfTime,
                    WorkCons: data.WorkCons,
                    Safety: data.Safety,
                    HealthCare: data.HealthCare,
                    Class: data.Class,
                    Restrictions: data.Restrictions,
                    UQDate: data.UQDate,
                    Created_by: data.Created_by,
                    Creation_date: data.Creation_date,
                    Last_updated_by: data.Last_updated_by,
                    Last_update_date: data.Last_update_date,
                    CalId: CalID,
                    DocId: response[0].doctor.doctor_id,
                    SIGNATURE: data.SIGNATURE,
                    isUseRespirator: data.isUseRespirator,
                    patient: response[0].patient,
                    doctor: response[0].doctor
                };
                oriInfo = angular.copy($scope.info);
            }
            else {
                $state.go("loggedIn.home", null, {"reload": true});
                toastr.error("Load fail!", "Error");
            }
        });

        $scope.submitGorgonUQ = function (gorgonUQForm) {
            $scope.showClickedValidation = true;
            if (gorgonUQForm.$error.required || gorgonUQForm.$error.pattern) {
                toastr.error("Please Input All Required Information!", "Error");
            } else {
                if ($scope.isNew == true) {
                    DocumentService.insertUQ($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Successfully", "Success");
                            $state.go('loggedIn.gorgonUQ', null, {
                                'reload': true
                            });
                        } else {
                            toastr.error("Fail", "Error");
                        }
                    });
                } else if ($scope.isNew == false) {
                    DocumentService.updateUQ($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Successfully", "Success");
                            $state.go('loggedIn.gorgonUQ', null, {
                                'reload': true
                            });
                        } else {
                            toastr.error("Fail", "Error");
                        }
                    });
                }
            }

        };


    });