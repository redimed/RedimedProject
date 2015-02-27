/**
 * Created by thanh on 9/25/2014.
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
            //var apptInfo = localStorageService.get('tempAppt');
            var patientInfo = localStorageService.get('tempPatient');
            if (patientInfo == null || patientInfo == 'undefined') {
                $state.go('loggedIn.home', null, {"reload": true});
                toastr.error("Load some information fail, please try again!", "Error");
            }
            else {
                var Patient_ID = patientInfo.Patient_id;
                //var CalID = apptInfo.CAL_ID;
                // var CalID = -1; //set value default test Calender ID
                var CalID =  $stateParams.cal_id;
                
                $scope.info = {
                    GORGON_ID: null,
                    PATIENT_ID: Patient_ID,
                    CAL_ID: CalID,
                    DocId: null,
                    TIME_TEST: new Date(),
                    WORK_COVER_NO: null,
                    PERSON_ARRANGING_SIGNATURE: null,
                    PERSON_ARRANGING_NAME: null,
                    PERSON_ARRANGING_POSITION: null,
                    DOCTOR_ID: null,
                    WORKER_SIGNATURE: null
                };
                var oriInfo;
                var info = $scope.info;
                DocumentService.loadForm18(info).then(function (response) {
                    if ('fail' === response['status']) {
                        $state.go("loggedIn.demo", null, {"reload": true});
                        toastr.error("Load information fail, Please try again!", "Error");
                    }
                    else if ('findNull' === response[0].status) {
                        $scope.isNew = true;
                        $scope.info.patient = response[0].patient;
                        $scope.info.doctor = response[0].doctor;
                        $scope.info.APPT = response[0].APPT;
                        $scope.info.rmSite = response[0].rmSite;
                        $scope.info.company = response[0].company;
                        $scope.info.Created_by = userInfo.id;
                        oriInfo = angular.copy($scope.info);
                    }
                    else if ('findFound' === response[0].status) {
                        $scope.isNew = false;
                        var data = response[0].dataF18;
                        $scope.info = {
                            doctorInfo: response[0].doctor,
                            apptInfo: response[0].APPT,
                            patient: response[0].patient,
                            "doctor": response[0].doctor,
                            "APPT": response[0].APPT,
                            "rmSite": response[0].rmSite,
                            "company": response[0].company,
                            GORGON_ID: data.GORGON_ID,
                            PATIENT_ID: data.PATIENT_ID,
                            CAL_ID: data.CAL_ID,
                            DocId: data.DocId,
                            TIME_TEST: data.TIME_TEST,
                            WORK_COVER_NO: data.WORK_COVER_NO,
                            PERSON_ARRANGING_SIGNATURE: data.PERSON_ARRANGING_SIGNATURE,
                            PERSON_ARRANGING_NAME: data.PERSON_ARRANGING_NAME,
                            PERSON_ARRANGING_POSITION: data.PERSON_ARRANGING_POSITION,
                            DOCTOR_ID: response[0].doctor.DOCTOR_ID,
                            WORKER_SIGNATURE: data.WORKER_SIGNATURE,
                            Created_by: data.Created_by,
                            Last_updated_by: userInfo.id
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
        }
    });