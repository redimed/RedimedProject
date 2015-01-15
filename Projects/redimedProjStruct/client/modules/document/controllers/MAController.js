angular.module('app.loggedIn.document.MA.controllers', ['fcsa-number'])
    .controller("MAController", function ($scope,$filter, DocumentService, ConfigService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

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

        var isEdit = true,
            Patient_ID,
            CalID,
            oriInfo,
            clearInfo,
            sex,
            date,
            value;

        $scope.patientInfo = localStorageService.get('tempPatient');
        CalID = -1;
        Patient_ID = $scope.patientInfo.Patient_id;
        sex = $scope.patientInfo.Sex;
        $scope.patientInfo.DOB = $filter('date')($scope.patientInfo.DOB, 'dd/MM/yyyy');


        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.MAForm.$setPristine();
        };
        $scope.clearForm = function () {
            $scope.info = angular.copy(clearInfo);
            $scope.MAForm.$setPristine();
        };

        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        };
        $scope.infoClear = function () {
            return !angular.equals(clearInfo, $scope.info);
        };

        $scope.getColor = function (err) {
            if ($scope.showClickedValidation) {
                if (err) {
                    return 'red';
                }
            }
        };

        $scope.Ratio = function () {
            value = $scope.info.WAIST / $scope.info.HIP;
            if (value > 0 && value < 100) {
                $scope.info.WHR = value.toFixed(2);
            }
        };

        var weight, height;
        $scope.mathBMI = function () {
            height = $scope.info.HEIGHT;
            weight = $scope.info.WEIGHT;
            value = (weight * 10000) / (height * height);
            value = value.toFixed(1);
            if (value > 0 && value < 300) {
                $scope.info.BMI = value;
                if (value < 18.5) {
                    $scope.info.IS_BMI = 0;
                } else if (value >= 18.5 && value <= 24.9) {
                    $scope.info.IS_BMI = 1;
                } else if (value >= 25.0 && value <= 29.9) {
                    $scope.info.IS_BMI = 2;
                } else if (value >= 30.0) {
                    $scope.info.IS_BMI = 3;
                }
            } else {
                $scope.info.BMI = null;
                $scope.info.IS_BMI = null;
            }
        };

        var len, totalCom = '', str;
        $scope.collectComment = function () {
            $scope.info.COMMENT_SEC10 = (($scope.info.COMMENT_SEC4 != null && $scope.info.COMMENT_SEC4 != '') ? $scope.info.COMMENT_SEC4 + '\n' : '') + (($scope.info.COMMENT_SEC5 != null && $scope.info.COMMENT_SEC5 != '') ? $scope.info.COMMENT_SEC5 + '\n' : '') + (($scope.info.COMMENT_SEC6 != null && $scope.info.COMMENT_SEC6 != '') ? $scope.info.COMMENT_SEC6 + '\n' : '') + (($scope.info.COMMENT_SEC7 != null && $scope.info.COMMENT_SEC7 != '') ? $scope.info.COMMENT_SEC7 + '\n' : '') + (($scope.info.COMMENT_SEC8 != null && $scope.info.COMMENT_SEC8 != '') ? $scope.info.COMMENT_SEC8 + '\n' : '')+ (($scope.info.COMMENT_SEC9 != null && $scope.info.COMMENT_SEC9 != '') ? $scope.info.COMMENT_SEC9 + '\n' : '') + totalCom;
        };

        $scope.totalComment = function () {
            if (!$scope.info.COMMENT_SEC10) {
                $scope.info.COMMENT_SEC10 = (($scope.info.COMMENT_SEC4 != null && $scope.info.COMMENT_SEC4 != '') ? $scope.info.COMMENT_SEC4 + '\n' : '') + (($scope.info.COMMENT_SEC5 != null && $scope.info.COMMENT_SEC5 != '') ? $scope.info.COMMENT_SEC5 + '\n' : '') + (($scope.info.COMMENT_SEC6 != null && $scope.info.COMMENT_SEC6 != '') ? $scope.info.COMMENT_SEC6 + '\n' : '') + (($scope.info.COMMENT_SEC7 != null && $scope.info.COMMENT_SEC7 != '') ? $scope.info.COMMENT_SEC7 + '\n' : '') + (($scope.info.COMMENT_SEC8 != null && $scope.info.COMMENT_SEC8 != '') ? $scope.info.COMMENT_SEC8 + '\n' : '')+ (($scope.info.COMMENT_SEC9 != null && $scope.info.COMMENT_SEC9 != '') ? $scope.info.COMMENT_SEC9 + '\n' : '');
            }
            len = ($scope.info.COMMENT_SEC4 != null ? $scope.info.COMMENT_SEC4.length : 0) + ($scope.info.COMMENT_SEC5 != null ? $scope.info.COMMENT_SEC5.length : 0) + ($scope.info.COMMENT_SEC6 != null ? $scope.info.COMMENT_SEC6.length : 0) + ($scope.info.COMMENT_SEC7 != null ? $scope.info.COMMENT_SEC7.length : 0) + ($scope.info.COMMENT_SEC8 != null ? $scope.info.COMMENT_SEC8.length : 0) + ($scope.info.COMMENT_SEC9 != null ? $scope.info.COMMENT_SEC9.length : 0);
            str = $scope.info.COMMENT_SEC10.replace('\n', '');
            for (var i = 0; i < 5; i++) {
                str = str.replace('\n', '');
            }
            totalCom = str.substr(len);
        }

        var insert = true;
        DocumentService.checkMA(Patient_ID, CalID,$scope.patientInfo.company_id).then(function (response) {
            if (response['status'] === 'insert') {
                insert = true;
                $scope.isNew = true;
                date = new Date();
                $scope.sites = response['site'];
                $scope.info = {
                    PATIENT_ID: Patient_ID,
                    CAL_ID: CalID,
                    STICKER: null,
                    HEIGHT: null,
                    WEIGHT: null,
                    BMI: null,
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
                    COMMENT_SEC1: null,
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
                    COMMENT_SEC2: null,
                    PROTEIN: null,
                    GLUCOSE: null,
                    BLOOD: null,
                    BLOOD_SUGAR_LEVEL: null,
                    COMMENT_SEC3: null,
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
                    COMMENT_SEC4: null,
                    COMMENT_SEC5: null,
                    COMMENT_SEC6: null,
                    COMMENT_SEC7: null,
                    COMMENT_SEC8: null,
                    COMMENT_SEC9: "",
                    AGE: getAge($scope.patientInfo.DOB),
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
                    COMMENT_SEC10: null,
                    DOCTOR_ID: response['docID'],
                    DOCTOR_NAME: response['docName'],
                    SIGN: response['docSign'],
                    LOCATION: null,
                    Created_by: null,
                    Creation_date: date,
                    Last_updated_by: null,
                    Last_update_date: null,
                    DF_CODE: null,
                    ISENABLE: null
                };
                $scope.companyName = response['nameCompany'];
                oriInfo = angular.copy($scope.info);
            } else if (response['status'] === 'fail') {
                toastr.error("Fail!", "Error");
                $state.go('loggedIn.demo', null, {'reload': true});
            } else if (response['status'] === 'error') {
                toastr.error("Error!", "Error");
                $state.go('loggedIn.demo', null, {'reload': true});
            } else if (response['status'] === 'update') {
                insert = false;
                $scope.isNew = false;
                $scope.companyName = response['nameCompany'];
                $scope.sites = response['site'];
                $scope.info = angular.copy(response['data']);
                $scope.info.DOCTOR_NAME = response['docName'];
                $scope.info.SIGN = response['docSign'];
                oriInfo = angular.copy($scope.info);
                $scope.totalComment();
            }
            if ($scope.isNew == true) {
                clearInfo = angular.copy($scope.info);
            }
            else {
                clearInfo = {
                    PATIENT_ID: Patient_ID,
                    CAL_ID: CalID,
                    STICKER: null,
                    HEIGHT: null,
                    WEIGHT: null,
                    BMI: null,
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
                    COMMENT_SEC1: null,
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
                    COMMENT_SEC2: null,
                    PROTEIN: null,
                    GLUCOSE: null,
                    BLOOD: null,
                    BLOOD_SUGAR_LEVEL: null,
                    COMMENT_SEC3: null,
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
                    COMMENT_SEC4: null,
                    COMMENT_SEC5: null,
                    COMMENT_SEC6: null,
                    COMMENT_SEC7: null,
                    COMMENT_SEC8: null,
                    COMMENT_SEC9: "",
                    AGE: getAge($scope.patientInfo.DOB),
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
                    COMMENT_SEC10: null,
                    DOCTOR_ID: $scope.info.DOCTOR_ID,
                    DOCTOR_NAME: $scope.info.DOCTOR_NAME,
                    SIGN: $scope.info.SIGN,
                    Created_by: null,
                    Creation_date: date,
                    Last_updated_by: null,
                    Last_update_date: null,
                    DF_CODE: null,
                    ISENABLE: null
                };
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

    })



