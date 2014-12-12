angular.module('app.loggedIn.document.gorgonMA.controllers', [])
    .controller("gorgonMAController", function ($scope, $filter, DocumentService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService) {
        var isEdit = true;

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

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };


        //$scope.apptInfo = localStorageService.get('tempAppt');
        $scope.patientInfo = localStorageService.get('tempPatient');
        var CalID = -1;//$scope.apptInfo.CAL_ID;
        var Patient_ID = $scope.patientInfo.Patient_id;

        $scope.checkAudiogram = function () {
            if ($scope.info.AUDIOGRAM == true) {
                $scope.info.RIGHT_EAR_500 = null,
                    $scope.info.RIGHT_EAR_1000 = null,
                    $scope.info.RIGHT_EAR_1500 = null,
                    $scope.info.RIGHT_EAR_2000 = null,
                    $scope.info.RIGHT_EAR_3000 = null,
                    $scope.info.RIGHT_EAR_4000 = null,
                    $scope.info.RIGHT_EAR_6000 = null,
                    $scope.info.RIGHT_EAR_8000 = null,
                    $scope.info.LEFT_EAR_500 = null,
                    $scope.info.LEFT_EAR_1000 = null,
                    $scope.info.LEFT_EAR_1500 = null,
                    $scope.info.LEFT_EAR_2000 = null,
                    $scope.info.LEFT_EAR_3000 = null,
                    $scope.info.LEFT_EAR_4000 = null,
                    $scope.info.LEFT_EAR_6000 = null,
                    $scope.info.LEFT_EAR_8000 = null
            }

        };

        $scope.checkSpirometry = function () {
            if ($scope.info.SPIROMETRY == true) {
                $scope.info.PRE_BR1_V1 = null,
                    $scope.info.PRE_BR1_V2 = null,
                    $scope.info.PRE_BR1_V3 = null,
                    $scope.info.PRE_BR1_V4 = null,
                    $scope.info.PRE_BR1_V5 = null,
                    $scope.info.PRE_BR1_V6 = null,
                    $scope.info.PRE_BR1_V7 = null,
                    $scope.info.PRE_BR2_V1 = null,
                    $scope.info.PRE_BR2_V2 = null,
                    $scope.info.PRE_BR2_V3 = null,
                    $scope.info.PRE_BR2_V4 = null,
                    $scope.info.PRE_BR2_V5 = null,
                    $scope.info.PRE_BR2_V6 = null,
                    $scope.info.PRE_BR2_V7 = null
            }
        };

        var date = new Date();
        var today = $filter('date')(date, 'dd/MM/yyyy');
        $scope.maxDate = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());

        $scope.info = {
            GORGON_ID: null,
            PATIENT_ID: Patient_ID,
            PHOTO_ID: null,
            HAND_DOR: null,
            HEIGHT: null,
            WEIGHT: null,
            PROTEIN: null,
            GLUCOSE: null,
            BLOOD: null,
            CANNABIS: null,
            OPIATES: null,
            AMPHETS: null,
            ANCOHOL: null,
            BENZOS: null,
            COCAIN: null,
            METHAMPH: null,
            AUDIOGRAM: 0,
            SPIROMETRY: 0,
            SPIROMETRY_STATIS: null,
            CANDIDATE_EVER: null,
            YES_TO_EITHER: null,
            SPI_EXAMINERS_COMMENTS: null,
            VA_UNCORRECTED_LEFT: null,
            VA_UNCORRECTED_RIGHT: null,
            VA_CORRECTED_LEFT: null,
            VA_CORRECTED_RIGHT: null,
            NV_UNCORRECTED_LEFT: null,
            NV_UNCORRECTED_RIGHT: null,
            NV_CORRECTED_LEFT: null,
            NV_CORRECTED_RIGHT: null,
            VF_LEFT: null,
            VF_RIGHT: null,
            ISHIHARA_RESPONSE: null,
            AS_Nil : 0,
            AS_Wide : 0,
            AS_Basal : 0,
            AS_Wheezes : 0,
            AS_Rub : 0,
            EC_normal : 0,
            EC_dermatitis : 0,
            EC_fungal : 0,
            EC_structural : 0,
            EC_wax : 0,
            TM_normal : 0,
            TM_effusion : 0,
            TM_wet : 0,
            TM_dry : 0,
            SYSTOLIC_BP : null,
            DIASTOLIC_BP : null,
            PULSE : null,
            HEART_RHYTHM: null,
            HEART_SOUNDS: null,
            PACEMAKER: null,
            CHEST: null,
            UPPER_ZONES: null,
            LOWER_ZONES: null,
            ECZEMA: null,
            PSORIASIS: null,
            TINEA: null,
            SOLAR_DAMAGE: null,
            FOLLICULITIS: null,
            EC_OTHER: null,
            SKIN_EXAMINERS_COMMENTS: null,
            SCARS_NIL: 0,
            SCARS_APPENDIX: 0,
            SCARS_GALLBLADDER: 0,
            SCARS_HERNIA: 0,
            SCARS_OTHER: 0,
            HERNIAL: null,
            HERNIAL_LEFT: 0,
            HERNIAL_RIGHT: 0,
            RECTUS: null,
            MUSCLE_TONE: null,
            MUSCLE_POWER: null,
            MUSCLE_WASTING: null,
            TREMOR: null,
            GAIT: null,
            LOWER_LEFT: null,
            LOWER_RIGHT: null,
            CNS_COMMENTS: null,
            NECK_POSTURE: null,
            NECK_RHYTHM: null,
            NECK_FLEXION: null,
            NECK_EXTENSION: null,
            NECK_LATERAL: null,
            NECK_ROTATION: null,
            BACK_POSTURE: null,
            BACK_RHYTHM: null,
            BACK_FLEXION: null,
            BACK_EXTENSION: null,
            BACK_LATERAL: null,
            BACK_ROTATION: null,
            BACK_EXAMINERS_COMMENTS: null,
            SHOULDER: null,
            ELBOWS: null,
            WRISTS: null,
            KNEES: null,
            ANKLES: null,
            GRIP_STRENGTH: null,
            EPICONDYLES: null,
            HEEL_WALK: null,
            DUCK_WALK: null,
            TOE_WALK: null,
            RHOMBERGS: null,
            FUTHER_COMMENTS: null,
            LIMB_EXAMINERS_COMMENTS: null,
            GORGON_DATE: null,
            SIGNATURE: null,
            Created_by: null,
            //Creation_date: null,
            Last_updated_by: null,
            //Last_update_date: null,
            CalId: CalID,
            DocId: null,
            EXAMINER_NAME: null,
            EXAMINER_ADDRESS: null,
            RIGHT_EAR_500: null,
            RIGHT_EAR_1000: null,
            RIGHT_EAR_1500: null,
            RIGHT_EAR_2000: null,
            RIGHT_EAR_3000: null,
            RIGHT_EAR_4000: null,
            RIGHT_EAR_6000: null,
            RIGHT_EAR_8000: null,
            LEFT_EAR_500: null,
            LEFT_EAR_1000: null,
            LEFT_EAR_1500: null,
            LEFT_EAR_2000: null,
            LEFT_EAR_3000: null,
            LEFT_EAR_4000: null,
            LEFT_EAR_6000: null,
            LEFT_EAR_8000: null,
            PRE_BR1_V1: null,
            PRE_BR1_V2: null,
            PRE_BR1_V3: null,
            PRE_BR1_V4: null,
            PRE_BR1_V5: null,
            PRE_BR1_V6: null,
            PRE_BR1_V7: null,
            PRE_BR2_V1: null,
            PRE_BR2_V2: null,
            PRE_BR2_V3: null,
            PRE_BR2_V4: null,
            PRE_BR2_V5: null,
            PRE_BR2_V6: null,
            PRE_BR2_V7: null,
            PROTEIN_COMMENT: null,
            GLUCOSE_COMMENT: null,
            BLOOD_COMMENT: null
        };
        var oriInfo = angular.copy($scope.info);

        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.gorgonMAForm.$setPristine();
        }

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        }


        //===================================insert and update===============================================

        var insert = true;
        DocumentService.checkGorgonMA(Patient_ID, CalID).then(function (response) {
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

        $scope.submitGorgonMA = function (gorgonMAForm) {
            $scope.showClickedValidation = true;
            if (gorgonMAForm.$invalid) {
                toastr.error("Please Input All Required Information!", "Error");
            } else {
                if (insert == true) {
                    DocumentService.insertGorgonMA($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Add new success!", "Success");
                            $scope.isNew = false;

                            $state.go('loggedIn.gorgonMA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Add new fail!", "Error");
                        }
                    });
                } else {
                    DocumentService.editGorgonMA($scope.info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Edit success!", "Success");
                            $state.go('loggedIn.gorgonMA', null, {'reload': true});
                        }
                        else {
                            toastr.error("Edit fail!", "Error");
                        }
                    });
                }

            }

        };

    });