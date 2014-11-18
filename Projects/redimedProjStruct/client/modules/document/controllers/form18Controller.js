/**
 * Created by HUYNHAN on 9/25/2014.
 */
angular.module('app.loggedIn.document.form18.controllers', [])
    .controller("form18Controller", function ($scope, DocumentService, $rootScope, $http, $cookieStore, toastr, $state, $stateParams, localStorageService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist");
            $state.go('loggedIn.home', null, {"reload": true});
        }
        else {
            $scope.today = new Date();
            //begin signature
            var tempSignature;
            $scope.isSignature = false;
            $scope.showSignature = function () {
                $scope.isSignature = !$scope.isSignature;
            }

            $scope.cancelClick = function () {
                $scope.isSignature = !$scope.isSignature;
                $scope.info.PERSON_ARRANGING_SIGNATURE = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.PERSON_ARRANGING_SIGNATURE = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.PERSON_ARRANGING_SIGNATURE;
            }

            //end signature

            //begin signature 1
            var tempSignature1;
            $scope.isSignature1 = false;
            $scope.showSignature1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
            }

            $scope.cancelClick1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
                $scope.info.WORKER_SIGNATURE = tempSignature1;
            };
            $scope.clearClick1 = function () {
                $scope.info.WORKER_SIGNATURE = '';
            };
            $scope.okClick1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
                tempSignature1 = $scope.info.WORKER_SIGNATURE;
            }

            //end signature1

            //set value default
            $scope.info = {
                GORGON_ID: null,
                PATIENT_ID: $stateParams.PatientID,
                CAL_ID: $stateParams.CalID,
                DocId: null,
                TIME_TEST: localStorageService.get('tempAppt').FROM_TIME,
                WORK_COVER_NO: null,
                PERSON_ARRANGING_SIGNATURE: null,
                PERSON_ARRANGING_NAME: null,
                PERSON_ARRANGING_POSITION: null,
                DOCTOR_ID: $cookieStore.get('doctorInfo').doctor_id,
                WORKER_SIGNATURE: null
            };
            var oriInfo;
            var info = $scope.info;
            DocumentService.loadForm18(info).then(function (response) {
                if ('fail' === response['status']) {
                    $state.go("loggedIn.home", null, {"reload": true});
                }
                else if ('findNull' === response[0].status) {
                    $scope.isNew = true;
                    $scope.info.patient = response[0].patient[0];
                    $scope.info.apptInfo = localStorageService.get('tempAppt');
                    $scope.info.doctorInfo = $cookieStore.get('doctorInfo');
                    oriInfo = angular.copy($scope.info);
                }
                else if ('findFound' === response[0].status) {
                    $scope.isNew = false;
                    var data = response[0].dataF18;
                    $scope.info = [];
                    $scope.info = {
                        doctorInfo: $cookieStore.get('doctorInfo'),
                        apptInfo: localStorageService.get('tempAppt'),
                        patient: response[0].patient[0],
                        GORGON_ID: data[0].GORGON_ID,
                        PATIENT_ID: data[0].PATIENT_ID,
                        CAL_ID: data[0].CAL_ID,
                        DocId: data[0].DocId,
                        TIME_TEST: data[0].TIME_TEST,
                        WORK_COVER_NO: data[0].WORK_COVER_NO,
                        PERSON_ARRANGING_SIGNATURE: data[0].PERSON_ARRANGING_SIGNATURE,
                        PERSON_ARRANGING_NAME: data[0].PERSON_ARRANGING_NAME,
                        PERSON_ARRANGING_POSITION: data[0].PERSON_ARRANGING_POSITION,
                        DOCTOR_ID: data[0].DOCTOR_ID,
                        WORKER_SIGNATURE: data[0].WORKER_SIGNATURE
                    };
                    oriInfo = angular.copy($scope.info);
                }
                else {
                    $state.go('loggedIn.home', null, {"reload": true});
                }
            })

            $scope.resetForm = function () {
                $scope.info = angular.copy(oriInfo);
                $scope.form18.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }

            $scope.submit = function (form18) {
                if (form18.$error.maxlength || form18.$error.required || form18.$error.pattern) {
                    toastr.error("Please Input All Required Information!", "Success");
                }
                else {
                    var info = $scope.info;

                    if ($scope.isNew === true) {
                        /**
                         * add new
                         */
                        DocumentService.insertForm18(info).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Add new success!", 'Success');
                                $state.go("loggedIn.Form18", null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error("Add new fail!", "Error");
                            }
                            else {
                                //throw exception
                                $state.go("loggedIn.home", null, {'reload': true});
                            }
                        })
                    }
                    else if ($scope.isNew === false) {
                        /**
                         * edit
                         */
                        DocumentService.editForm18(info).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Update success!", 'Success');
                                $state.go("loggedIn.Form18", null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error("Update fail!", "Error");
                            }
                            else {
                                //throw exception
                                $state.go("loggedIn.home", null, {'reload': true});
                            }
                        });
                    }
                }
            }
        }
    });