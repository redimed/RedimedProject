
angular.module('app.loggedIn.document.gorgonUQ.controllers',[])

    .controller("gorgonUQController",function($scope,$filter,DocumentService,$http,$cookieStore,localStorageService,$state,toastr,$window,$stateParams) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';



//        var CalID = $stateParams.CalID;
//        var Patient_ID = $stateParams.PatientID;
//        console.log("gorgon UQ: " + CalID + " patient: " + Patient_ID);


        $scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        var doctorInfo = $cookieStore.get('doctorInfo');
        console.log(doctorInfo);
        console.log($scope.apptInfo);
        console.log($scope.patientInfo);
        var Patient_ID = $scope.patientInfo.Patient_id;
        var CalID = $scope.apptInfo.CAL_ID;


        function getAge(dateString)
        {
            var now = new Date();
            var birthDate = new Date(dateString);
            var age = now.getFullYear() - birthDate.getFullYear();
            var m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate()))
            {
                age--;
            }
            return age;
        }


        // Start Signature
        var tempSignature;
        $scope.isSignature = false;
        $scope.showSignature = function () {
            $scope.isSignature = !$scope.isSignature;
        }

        $scope.cancelClick = function () {
            $scope.isSignature = !$scope.isSignature;
            $scope.info.SIGNATURE = tempSignature;
        };
        $scope.clearClick = function () {
            $scope.info.SIGNATURE = '';
        };
        $scope.okClick = function () {
            $scope.isSignature = !$scope.isSignature;
            tempSignature = $scope.info.SIGNATURE;
        }
        // End Signature


        $scope.info = {
            name : $scope.patientInfo.First_name + " " + $scope.patientInfo.Sur_name + " " + $scope.patientInfo.Middle_name,
            Patient_Id : Patient_ID,
            age : getAge($scope.patientInfo.DOB),
            sex : $scope.patientInfo.Sex,
            TodayDate: new Date(),
            Height : null,
            Weight : null,
            JobTitle : null,
            PhoneNumber : null,
            BestTime : null,
            isReviewQuest : null,
            isNRP : 0,
            isOtherType : 0,
            isRespirator : null,
            RespiratorType : null,
            isSmoke : null,
            isSeizuresCondition : null,
            isDiabetes : null,
            isAllergicReactions : null,
            isClaustrophobia : null,
            isTrouble : null,
            isAsbestosis : null,
            isAsthma : null,
            isBronchitis : null,
            isEmphysema : null,
            isPneumonia : null,
            isTuberculosis : null,
            isSilicosis : null,
            isPneumothorax : null,
            isLungCancer : null,
            isBrokenRibs : null,
            isInjuries : null,
            isOtherLung : null,
            OtherLungComment : null,
            isSOB : null,
            isSOBWalkingFast : null,
            isSOBWalkingOther : null,
            isStopForBreath : null,
            isSOBWashing : null,
            isSOBInterferes : null,
            isCoughingPhlegm : null,
            isCoughingMorning : null,
            isCoughingLyingDown : null,
            isCoughingUpBlood : null,
            isWheezing : null,
            isWheezingInterferes : null,
            isChestPain : null,
            isOtherSymptomsPulmonary : null,
            isHeartAttack : null,
            isStroke : null,
            isAngina : null,
            isHeartFailure : null,
            isSwelling : null,
            isHeartArrhythmia : null,
            isBloodPressureHeart : null,
            isOtherHeart : null,
            OtherHeartComment : null,
            isFrequentPain : null,
            isPOTPhysical : null,
            isPOTInterferes : null,
            isMissingBeat : null,
            isHeartburn : null,
            isOtherSymptomsHeart : null,
            isBreathing : null,
            isHeartTrouble : null,
            isBloodPressureMedication : null,
            isSeizuresMedication : null,
            isEyeIrritation : null,
            isSkinAllergies : null,
            isAnxiety : null,
            isGeneralWeakness : null,
            isOtherProblem : null,
            isTalk : null,
            isLostVision : null,
            isContactLenses : null,
            isWearGlasses : null,
            isColourBlind : null,
            isOtherEye : null,
            isInjuryEars : null,
            isHearingProblems : null,
            isDifficultyHearing : null,
            isHearingAid : null,
            isOtherHearing : null,
            isBackInjury : null,
            isWeaknessAny : null,
            isBackPain : null,
            isDFMArmsLegs : null,
            isDFMHead : null,
            isPOSLeanForward : null,
            isPODHead : null,
            isDifficultyBending : null,
            isDifficultySquatting : null,
            isClimbing : null,
            isOtherMuscle : null,
            Employee : null,
            DOB : null,
            Department : null,
            SocialSecurity : null,
            Supervisor : null,
            isAtmosphere : 0,
            isContinuous : 0,
            isOpen : 0,
            isClose : 0,
            isSupplied : 0,
            isCombination : 0,
            isAir_NonPow : 0,
            isAir_Pow : 0,
            LevelOfWE : null,
            ExtentUsage : null,
            LengthOfTime : null,
            WorkCons : null,
            Safety : null,
            HealthCare : null,
            Class : null,
            Restrictions : null,
            HealthCarePro : null,
            UQDate : new Date(),
            Created_by : null,
            Creation_date : null,
            Last_updated_by : null,
            Last_update_date : null,
            CalId: CalID,
            DocId : null,
            SIGNATURE : null,
            isUseRespirator : 0
        };

        var oriInfo = angular.copy($scope.info);

        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.gorgonUQForm.$setPristine();
        }

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        }

        $scope.checkUseRespirator = function(value)
        {
            if(value == true)
            {
                $scope.info.isEyeIrritation = null;
                $scope.info.isSkinAllergies = null;
                $scope.info.isAnxiety = null;
                $scope.info.isGeneralWeakness = null;
                $scope.info.isOtherProblem = null;
            }

        };


        DocumentService.checkUser(Patient_ID,CalID).then(function(response){
            if(response['status'] === 'fail') {
                var date = new Date();
                $scope.isNew = true;

                $scope.maxDate = new Date(date.getFullYear() - 1,date.getMonth() ,date.getDate());
                $scope.submitGorgonUQ = function(gorgonUQForm){
                    $scope.showClickedValidation = true;
                    if(gorgonUQForm.$invalid){
                        toastr.error("Please Input All Required Information!", "Error");
                    }else
                    {
                        DocumentService.insertUQ($scope.info).then(function(response){
                            if(response['status'] === 'success') {
                                alert("Insert Successfully!");
                                //$state.go('loggedIn.home');
                            }
                            else
                            {
                                alert("Insert Failed!");
                            }
                        });
                    }

                };
            }
            else
            {
                $scope.isNew = false;
                $scope.info = {
                    Quest_Id : response.Quest_Id,
                    name :  $scope.patientInfo.First_name + " " + $scope.patientInfo.Sur_name + " " + $scope.patientInfo.Middle_name,
                    Patient_Id : response.Patient_Id,
                    age : getAge($scope.patientInfo.DOB),
                    sex : $scope.patientInfo.Sex,
                    TodayDate: new Date(),
                    Height : response.Height,
                    Weight :   response.Weight,
                    JobTitle : response.JobTitle,
                    PhoneNumber : response.PhoneNumber,
                    BestTime : response.BestTime,
                    isReviewQuest : response.isReviewQuest,
                    isNRP : response.isNRP,
                    isOtherType : response.isOtherType,
                    isRespirator : response.isRespirator,
                    RespiratorType : response.RespiratorType,
                    isSmoke : response.isSmoke,
                    isSeizuresCondition : response.isSeizuresCondition,
                    isDiabetes : response.isDiabetes,
                    isAllergicReactions : response.isAllergicReactions,
                    isClaustrophobia : response.isClaustrophobia,
                    isTrouble : response.isTrouble,
                    isAsbestosis : response.isAsbestosis,
                    isAsthma : response.isAsthma,
                    isBronchitis : response.isBronchitis,
                    isEmphysema : response.isEmphysema,
                    isPneumonia : response.isPneumonia,
                    isTuberculosis : response.isTuberculosis,
                    isSilicosis : response.isSilicosis,
                    isPneumothorax : response.isPneumothorax,
                    isLungCancer : response.isLungCancer,
                    isBrokenRibs : response.isBrokenRibs,
                    isInjuries : response.isInjuries,
                    isOtherLung : response.isOtherLung,
                    OtherLungComment : response.OtherLungComment,
                    isSOB : response.isSOB,
                    isSOBWalkingFast : response.isSOBWalkingFast,
                    isSOBWalkingOther : response.isSOBWalkingOther,
                    isStopForBreath : response.isStopForBreath,
                    isSOBWashing : response.isSOBWashing,
                    isSOBInterferes : response.isSOBInterferes,
                    isCoughingPhlegm : response.isCoughingPhlegm,
                    isCoughingMorning : response.isCoughingMorning,
                    isCoughingLyingDown : response.isCoughingLyingDown,
                    isCoughingUpBlood : response.isCoughingUpBlood,
                    isWheezing : response.isWheezing,
                    isWheezingInterferes : response.isWheezingInterferes,
                    isChestPain : response.isChestPain,
                    isOtherSymptomsPulmonary : response.isOtherSymptomsPulmonary,
                    isHeartAttack : response.isHeartAttack,
                    isStroke : response.isStroke,
                    isAngina : response.isAngina,
                    isHeartFailure : response.isHeartFailure,
                    isSwelling : response.isSwelling,
                    isHeartArrhythmia : response.isHeartArrhythmia,
                    isBloodPressureHeart : response.isBloodPressureHeart,
                    isOtherHeart : response.isOtherHeart,
                    OtherHeartComment : response.OtherHeartComment,
                    isFrequentPain : response.isFrequentPain,
                    isPOTPhysical : response.isPOTPhysical,
                    isPOTInterferes : response.isPOTInterferes,
                    isMissingBeat : response.isMissingBeat,
                    isHeartburn : response.isHeartburn,
                    isOtherSymptomsHeart : response.isOtherSymptomsHeart,
                    isBreathing : response.isBreathing,
                    isHeartTrouble : response.isHeartTrouble,
                    isBloodPressureMedication : response.isBloodPressureMedication,
                    isSeizuresMedication : response.isSeizuresMedication,
                    isEyeIrritation : response.isEyeIrritation,
                    isSkinAllergies : response.isSkinAllergies,
                    isAnxiety : response.isAnxiety,
                    isGeneralWeakness : response.isGeneralWeakness,
                    isOtherProblem : response.isOtherProblem,
                    isTalk : response.isTalk,
                    isLostVision : response.isLostVision,
                    isContactLenses : response.isContactLenses,
                    isWearGlasses : response.isWearGlasses,
                    isColourBlind : response.isColourBlind,
                    isOtherEye : response.isOtherEye,
                    isInjuryEars : response.isInjuryEars,
                    isHearingProblems : response.isHearingProblems,
                    isDifficultyHearing : response.isDifficultyHearing,
                    isHearingAid : response.isHearingAid,
                    isOtherHearing : response.isOtherHearing,
                    isBackInjury : response.isBackInjury,
                    isWeaknessAny : response.isWeaknessAny,
                    isBackPain : response.isBackPain,
                    isDFMArmsLegs : response.isDFMArmsLegs,
                    isDFMHead : response.isDFMHead,
                    isPOSLeanForward : response.isPOSLeanForward,
                    isPODHead : response.isPODHead,
                    isDifficultyBending : response.isDifficultyBending,
                    isDifficultySquatting : response.isDifficultySquatting,
                    isClimbing : response.isClimbing,
                    isOtherMuscle : response.isOtherMuscle,
                    Employee : response.Employee,
                    DOB : response.DOB,
                    Department : response.Department,
                    SocialSecurity : response.SocialSecurity,
                    Supervisor : response.Supervisor,
                    isAtmosphere : response.isAtmosphere,
                    isContinuous : response.isContinuous,
                    isOpen : response.isOpen,
                    isClose : response.isClose,
                    isSupplied : response.isSupplied,
                    isCombination : response.isCombination,
                    isAir_NonPow : response.isAir_NonPow,
                    isAir_Pow : response.isAir_Pow,
                    LevelOfWE : response.LevelOfWE,
                    ExtentUsage : response.ExtentUsage,
                    LengthOfTime : response.LengthOfTime,
                    WorkCons : response.WorkCons,
                    Safety : response.Safety,
                    HealthCare : response.HealthCare,
                    Class : response.Class,
                    Restrictions : response.Restrictions,
                    HealthCarePro : response.HealthCarePro,
                    UQDate : response.UQDate,
                    Created_by : response.Created_by,
                    Creation_date : response.Creation_date,
                    Last_updated_by : response.Last_updated_by,
                    Last_update_date : response.Last_update_date,
                    CalId: response.CalId,
                    DocId : response.DocId,
                    SIGNATURE : response.SIGNATURE,
                    isUseRespirator : response.isUseRespirator
                };
                oriInfo = angular.copy($scope.info);
                $scope.submitGorgonUQ = function(gorgonUQForm){
                    $scope.showClickedValidation = true;
                    if(gorgonUQForm.$invalid){
                        toastr.error("Please Input All Required Information!", "Error");
                    }else
                    {
                        var info = $scope.info;
                        DocumentService.updateUQ(info).then(function(response){
                            if(response['status'] === 'success') {
                                alert("Update Successfully!");
                                //$state.go('loggedIn.home');
                            }
                            else
                            {
                                alert("Update Failed!");
                            }
                        });
                    }

                };
            }
        });







        $scope.print = function(){
            $window.location.href = '/api/document/gorgonUQ/print/7';
        }

    });