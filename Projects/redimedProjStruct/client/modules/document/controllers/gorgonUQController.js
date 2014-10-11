
angular.module('app.loggedIn.document.gorgonUQ.controllers',[])
    .controller("gorgonUQController",function($scope,$filter,DocumentService,$http,$cookieStore,$state) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.info = [];
        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';
        var date = new Date();
        var today = $filter('date')(date,'dd/MM/yyyy');
        $scope.info = {
            name : userinfo.Booking_Person,
            Patient_Id : userinfo.id,
            age : 15,
            sex : "female",
            TodayDate: today,
            Height : '',
            Weight : '',
            JobTitle : '',
            PhoneNumber : '',
            BestTime : '',
            isReviewQuest : '',
            isNRP : 0,
            isOtherType : 0,
            isRespirator : '',
            RespiratorType : '',
            isSmoke : '',
            isSeizuresCondition : '',
            isDiabetes : '',
            isAllergicReactions : '',
            isClaustrophobia : '',
            isTrouble : '',
            isAsbestosis : '',
            isAsthma : '',
            isBronchitis : '',
            isEmphysema : '',
            isPneumonia : '',
            isTuberculosis : '',
            isSilicosis : '',
            isPneumothorax : '',
            isLungCancer : '',
            isBrokenRibs : '',
            isInjuries : '',
            isOtherLung : '',
            OtherLungComment : '',
            isSOB : '',
            isSOBWalkingFast : '',
            isSOBWalkingOther : '',
            isStopForBreath : '',
            isSOBWashing : '',
            isSOBInterferes : '',
            isCoughingPhlegm : '',
            isCoughingMorning : '',
            isCoughingLyingDown : '',
            isCoughingUpBlood : '',
            isWheezing : '',
            isWheezingInterferes : '',
            isChestPain : '',
            isOtherSymptomsPulmonary : '',
            isHeartAttack : '',
            isStroke : '',
            isAngina : '',
            isHeartFailure : '',
            isSwelling : '',
            isHeartArrhythmia : '',
            isBloodPressureHeart : '',
            isOtherHeart : '',
            OtherHeartComment : '',
            isFrequentPain : '',
            isPOTPhysical : '',
            isPOTInterferes : '',
            isMissingBeat : '',
            isHeartburn : '',
            isOtherSymptomsHeart : '',
            isBreathing : '',
            isHeartTrouble : '',
            isBloodPressureMedication : '',
            isSeizuresMedication : '',
            isEyeIrritation : '',
            isSkinAllergies : '',
            isAnxiety : '',
            isGeneralWeakness : '',
            isOtherProblem : '',
            isTalk : '',
            isLostVision : '',
            isContactLenses : '',
            isWearGlasses : '',
            isColourBlind : '',
            isOtherEye : '',
            isInjuryEars : '',
            isHearingProblems : '',
            isDifficultyHearing : '',
            isHearingAid : '',
            isOtherHearing : '',
            isBackInjury : '',
            isWeaknessAny : '',
            isBackPain : '',
            isDFMArmsLegs : '',
            isDFMHead : '',
            isPOSLeanForward : '',
            isPODHead : '',
            isDifficultyBending : '',
            isDifficultySquatting : '',
            isClimbing : '',
            isOtherMuscle : '',
            Employee : '',
            DOB : '',
            Department : '',
            SocialSecurity : '',
            Supervisor : '',
            isAtmosphere : 0,
            isContinuous : 0,
            isOpen : 0,
            isClose : 0,
            isSupplied : 0,
            isCombination : 0,
            isAir_NonPow : 0,
            isAir_Pow : 0,
            LevelOfWE : '',
            ExtentUsage : '',
            LengthOfTime : '',
            WorkCons : '',
            Safety : '',
            HealthCare : '',
            Class : '',
            Restrictions : '',
            HealthCarePro : '',
            UQDate : today,
//            Created_by : '',
//            Creation_date : '',
//            Last_updated_by : '',
//            Last_update_date : '',
//            CalId: '',
//            DocId : '',
//            SIGNATURE : '',
            isUseRespirator : 0

        };

        $scope.submitGorgonUQ = function(gorgonUQForm){
            $scope.showClickedValidation = true;
            if(gorgonUQForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }
            var info = $scope.info;
            console.log(info);
            DocumentService.insertUQ(info).then(function(response){
                if(response['status'] === 'success') {
                    alert("Insert Successfully!");
                    $state.go('loggedIn.home');
                }
                else
                {
                    alert("Insert Failed!");
                }
            });
        };



    });