
angular.module('app.loggedIn.document.gorgonMA.controllers',[])
    .controller("gorgonMAController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,toastr) {
        var isEdit = true;

        $scope.resetFlag = false;
        $scope.reset = function () {
            $scope.resetFlag = !$scope.resetFlag;
        }
        //end signature

        //begin show-hidden img signature
        $scope.sig = false;
        $scope.sigClick = function () {
            $scope.sig = true;
        }
        $scope.okClick = function () {
            $scope.sig = false;
        }
        $scope.cancelClick = function () {
            $scope.sig = false;
        }

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var userinfo = $cookieStore.get("userInfo") !== 'undefined' ? $cookieStore.get("userInfo") : 'fail';

		 $scope.print = function(){
            $window.location.href = '/api/document/gorgonMA/print/5';
        }
		
        $scope.info={
            GORGON_ID : null,
            PATIENT_ID : null,
            PHOTO_ID : null,
            HAND_DOR : null,
            HEIGHT : null,
            WEIGHT : null,
            PROTEIN : null,
            GLUCOSE : null,
            BLOOD : null,
            CANNABIS : null,
            OPIATES : null,
            AMPHETS : null,
            ANCOHOL : null,
            BENZOS : null,
            COCAIN : null,
            METHAMPH : null,
            AUDIOGRAM : 0,
            SPIROMETRY : 0,
            SPIROMETRY_STATIS : null,
            CANDIDATE_EVER : null,
            YES_TO_EITHER : null,
            SPI_EXAMINERS_COMMENTS : null,
            VA_UNCORRECTED_LEFT : null,
            VA_UNCORRECTED_RIGHT : null,
            VA_CORRECTED_LEFT : null,
            VA_CORRECTED_RIGHT : null,
            NV_UNCORRECTED_LEFT : null,
            NV_UNCORRECTED_RIGHT : null,
            NV_CORRECTED_LEFT : null,
            NV_CORRECTED_RIGHT : null,
            VF_LEFT : null,
            VF_RIGHT : null,
            ISHIHARA_RESPONSE : null,
            SYSTOLIC_BP: null,
            DIASTOLIC_BP: null,
            PULSE: null,
            HEART_RHYTHM : null,
            HEART_SOUNDS : null,
            PACEMAKER : null,
            CHEST : null,
            UPPER_ZONES : null,
            LOWER_ZONES : null,
            ADDED_SOUNDS : null,
            EXTERNAL_CANALS : null,
            TYMPANIC_MEMBRANES : null,
            ECZEMA : null,
            PSORIASIS : null,
            TINEA : null,
            SOLAR_DAMAGE : null,
            FOLLICULITIS : null,
            EC_OTHER : null,
            SKIN_EXAMINERS_COMMENTS : null,
            SCARS_NIL : 0,
            SCARS_APPENDIX : 0,
            SCARS_GALLBLADDER : 0,
            SCARS_HERNIA : 0,
            SCARS_OTHER : 0,
            HERNIAL : null,
            HERNIAL_LEFT : 0,
            HERNIAL_RIGHT : 0,
            RECTUS : null,
            MUSCLE_TONE : null,
            MUSCLE_POWER : null,
            MUSCLE_WASTING : null,
            TREMOR : null,
            GAIT : null,
            LOWER_LEFT : null,
            LOWER_RIGHT : null,
            CNS_COMMENTS : null,
            NECK_POSTURE : null,
            NECK_RHYTHM : null,
            NECK_FLEXION : null,
            NECK_EXTENSION : null,
            NECK_LATERAL : null,
            NECK_ROTATION : null,
            BACK_POSTURE : null,
            BACK_RHYTHM : null,
            BACK_FLEXION : null,
            BACK_EXTENSION : null,
            BACK_LATERAL : null,
            BACK_ROTATION : null,
            BACK_EXAMINERS_COMMENTS : null,
            SHOULDER : null,
            SHOULDER_PAINFUL : 0,
            ELBOWS : null,
            ELBOWS_PAINFUL : 0,
            WRISTS : null,
            WRISTS_PAINFUL : 0,
            KNEES : null,
            KNEES_PAINFUL : 0,
            ANKLES : null,
            ANKLES_PAINFUL : 0,
            GRIP_STRENGTH : null,
            EPICONDYLES : null,
            HEEL_WALK : null,
            DUCK_WALK : null,
            TOE_WALK : null,
            RHOMBERGS : null,
            FUTHER_COMMENTS : null,
            LIMB_EXAMINERS_COMMENTS : null,
            GORGON_DATE: null,
            SIGNATURE: null,
            Created_by : null,
            Creation_date: null,
            Last_updated_by : null,
            Last_update_date: null,
            CalId : null,
            DocId : null,
            EXAMINER_NAME: null,
            EXAMINER_ADDRESS: null,
            RIGHT_EAR_500 : null,
            RIGHT_EAR_1000 : null,
            RIGHT_EAR_1500 : null,
            RIGHT_EAR_2000 : null,
            RIGHT_EAR_3000 : null,
            RIGHT_EAR_4000 : null,
            RIGHT_EAR_6000 : null,
            RIGHT_EAR_8000 : null,
            LEFT_EAR_500 : null,
            LEFT_EAR_1000 : null,
            LEFT_EAR_1500 : null,
            LEFT_EAR_2000 : null,
            LEFT_EAR_3000 : null,
            LEFT_EAR_4000 : null,
            LEFT_EAR_6000 : null,
            LEFT_EAR_8000 : null,
            PRE_BR1_V1 : null,
            PRE_BR1_V2 : null,
            PRE_BR1_V3 : null,
            PRE_BR1_V4 : null,
            PRE_BR1_V5 : null,
            PRE_BR1_V6 : null,
            PRE_BR1_V7 : null,
            PRE_BR2_V1 : null,
            PRE_BR2_V2 : null,
            PRE_BR2_V3 : null,
            PRE_BR2_V4 : null,
            PRE_BR2_V5 : null,
            PRE_BR2_V6 : null,
            PRE_BR2_V7 : null,
            PROTEIN_COMMENT : null,
            GLUCOSE_COMMENT : null,
            BLOOD_COMMENT : null
        };

        $scope.checkAudiogram = function(value)
        {
            if(value == true)
            {

            }

        };

        $scope.checkSpirometry = function(value)
        {
            if(value == true)
            {

            }

        };

        if(isEdit == false){
            $scope.submitGorgonMA = function(gorgonMAForm){
                $scope.showClickedValidation = true;
                if(gorgonMAForm.$invalid){
                    toastr.error("Please Input All Required Information!", "Error");
                }else
                {
                    var info = $scope.info;
                    console.log(info);
                    DocumentService.insertGorgonMA(info).then(function(response){
                        if(response['status'] === 'success') {
                            alert("Insert Successfully!");
                        }
                        else
                        {
                            alert("Insert Failed!");
                        }
                    });
                }

            };
        }
        else{
            $scope.info.GORGON_ID = 14;

            DocumentService.getGorgonMAInfo(14).then(function(data){
                $scope.info = data;
            })

            $scope.submitGorgonMA = function(gorgonMAForm){
                $scope.showClickedValidation = true;
                if(gorgonMAForm.$invalid){
                    toastr.error("Please Input All Required Information!", "Error");
                }else
                {
                    var info = $scope.info;
                    console.log(info);
                    DocumentService.editGorgonMA(info).then(function(response){
                        if(response['status'] === 'success') {
                            alert("Edit Successfully!");
                        }
                        else
                        {
                            alert("Edit Failed!");
                        }
                    });
                }

            };
        }


    });