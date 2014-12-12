
angular.module('app.loggedIn.document.MA.controllers',['fcsa-number'])
    .controller("MAController",function($scope,DocumentService,$http,$cookieStore,$state,toastr,$stateParams,localStorageService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var isEdit = true,
            Patient_ID,
            CalID,
            oriInfo;

        $scope.patientInfo = localStorageService.get('tempPatient');
        CalID = -1;
        Patient_ID = $scope.patientInfo.Patient_id;

        $scope.info ={
            PATIENT_ID: Patient_ID,
            CAL_ID: CalID,
            HEIGHT: null,
            WEIGHT: null,
            BMI : null,
            WAIST: null,
            HIP: null,
            WHR: null,
            IS_BMI: null,
            BLOOD_SEC1: null,
            IS_BLOOD: null,
            RESTING_HEART_RATE: null,
            IS_RESTING_HEART_RATE: null,
            HEART_SOUNDS: null,
            PERIPHERAL: null,
            VEINS_OTHER: null,
            COMMENT_SEC1 : null,
            RIGHT_DIST: null,
            RIGHT_DIST_CORRECT: null,
            LEFT_DIST: null,
            LEFT_DIST_CORRECT: null,
            RIGHT_NEAR: null,
            RIGHT_NEAR_CORRECT: null,
            LEFT_NEAR: null,
            LEFT_NEAR_CORRECT: null,
            COLOUR_SEC2: null,
            SCORE_SEC2: null,
            PERIPHERAL_SEC2: null,
            VISUAL_AIDS: null,
            COMMENT_SEC2 : null,
            PROTEIN: null,
            GLUCOSE: null,
            BLOOD: null,
            COMMENT_SEC3 : null,
            SPIROMETRY: null,
            SYMMETRICAL: null,
            AUSCULTATION: null,
            EARS: null,
            HEARING: null,
            NOSE: null,
            THROAT: null,
            TEETH_GUMS: null,
            SKIN: null,
            DRUG: null,
            NAIL: null,
            SCAR: null,
            ABDOMEN: null,
            HERNIAL: null,
            LIVER: null,
            SPLEEN: null,
            KIDNEYS: null,
            BALANCE: null,
            COORDINATION: null,
            LYMPH: null,
            THYROID: null,
            COMMENT_SEC9 : null,
            AGE: null,
            HYPER: 0,
            SMOKER: 0,
            KNOW: 0,
            SEDENTARY: 0,
            FAMILY: 0,
            HISTORY: 0,
            OBESITY: 0,
            RISK: null,
            ECG: null,
            ECG_RESULT: null,
            GP: null,
            COMMENT_SEC10 : null,
            DOCTOR_NAME : null,
            SIGN: null,
            Created_by: null,
            Creation_date: null,
            Last_updated_by: null,
            Last_update_date: null,
            DF_CODE  : null,
            ISENABLE: null
        };
        oriInfo = angular.copy($scope.info);

        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.MAForm.$setPristine();
        }

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        }

        $scope.getColor = function(err){
            if($scope.showClickedValidation){
                if(err){
                    return 'red';
                }
            }
        }

        var insert = true;
        DocumentService.checkMA(Patient_ID, CalID).then(function (response) {
            if (response['status'] === 'fail') {
                insert = true;
                $scope.isNew = true;
            }
            else {
                insert = false;
                $scope.isNew = false;
                $scope.info = angular.copy(response);
                oriInfo = angular.copy($scope.info);
            }
        });

        $scope.submitMA = function (MAForm) {
            $scope.showClickedValidation = true;
            if (MAForm.$invalid) {
                toastr.error("Please Input All Required Information!", "Error");
            } else {
                if (insert == true) {
                    DocumentService.insertMA($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Add new success!", "Success");
                            $scope.isNew = false;

                            $state.go('loggedIn.MA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Add new fail!", "Error");
                        }
                    });
                } else {
                    DocumentService.editMA($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Edit success!", "Success");
                            $state.go('loggedIn.MA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Edit fail!", "Error");
                        }
                    });
                }

            }

        };

    });




