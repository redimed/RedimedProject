
angular.module('app.loggedIn.document.gorgonUQ.controllers',[])

    .controller("gorgonUQController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,toastr) {
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
            UQDate : today,
            Created_by : null,
            Creation_date : null,
            Last_updated_by : null,
            Last_update_date : null,
            CalId: null,
            DocId : null,
            SIGNATURE : null,
            isUseRespirator : 0

        };

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


        $scope.submitGorgonUQ = function(gorgonUQForm){
            $scope.showClickedValidation = true;
            if(gorgonUQForm.$invalid){
                toastr.error("Please Input All Required Information!", "Error");
            }else
            {
                var info = $scope.info;
                console.log(info);
                DocumentService.insertUQ(info).then(function(response){
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

    });