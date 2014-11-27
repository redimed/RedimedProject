angular.module('app.loggedIn.document.cat3.controllers', [])
    .controller("Cat3Controller", function ($scope, DocumentService, $rootScope, $http, $cookieStore, toastr, $state, $stateParams, localStorageService) {
        //begin date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //end date
        $scope.today = new Date();
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go('loggedIn.home', null, {"reload": true});
        }
        else {
            //begin signature
            var tempSignature;
            $scope.isSignature = false;
            $scope.showSignature = function () {
                $scope.isSignature = !$scope.isSignature;
            }

            $scope.cancelClick = function () {
                $scope.isSignature = !$scope.isSignature;
                $scope.info.PATIENT_SIGNATURE = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.PATIENT_SIGNATURE = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.PATIENT_SIGNATURE;
            }

            //end signature
            //set value default
            //var tempAppt = localStorageService.get('tempAppt');
            var tempPatient = localStorageService.get('tempPatient');
            if (tempPatient === 'undefined' || tempPatient == null) {
                $state.go('loggedIn.home', null, {"reload": true});
                toastr.error("Load information fail, please try again!", "Error");
            }
            else {
                var patient_id = tempPatient.Patient_id;
                //var cal_id = tempAppt.CAL_ID;
                var cal_id = -1;//set value default cal_id
                $scope.info = {
                    cat_id: null,
                    cal_id: cal_id,
                    patient_id: patient_id,
                    q1_4: null,
                    q1_4_c: null,
                    q1_5_1: null,
                    q1_5_2: null,
                    q1_5_3: null,
                    s3_q1_1_1: null,
                    s3_q1_1_2: null,
                    s3_q1_2_1: null,
                    s3_q1_2_2: null,
                    s3_q1_3: null,
                    s3_q1_4: null,
                    s3_q2_1_1: null,
                    s3_q2_1_2: null,
                    s3_q2_1_3: null,
                    s3_q2_1_4: null,
                    s3_q2_1_5: null,
                    s3_q2_1_6: null,
                    s3_q2_1_7: null,
                    s3_q2_1_8: null,
                    s3_q2_2_1: null,
                    s3_q2_2_2: null,
                    s3_q2_2_3: null,
                    s3_q2_2_4: null,
                    s3_q2_2_5: null,
                    s3_q2_2_6: null,
                    s3_q2_2_7: null,
                    s3_q2_2_8: null,
                    s3_q2_3: null,
                    s3_q3_1: null,
                    s3_q3_2: null,
                    s3_q3_3_1: null,
                    s3_q3_3_2: null,
                    s3_q3_4_1: null,
                    s3_q3_4_2: null,
                    s3_q3_5: null,
                    s3_q3_6: null,
                    s3_q4: null,
                    s3_q5_1_1_1: null,
                    s3_q5_1_1_2: null,
                    s3_q5_1_1_3: null,
                    s3_q5_1_1_4: null,
                    s3_q5_1_2: null,
                    s3_q5_2: null,
                    s3_q5_3: null,
                    s3_q5_4: null,
                    s3_q5_5: null,
                    s3_q5_6: null,
                    s3_q6_c: null,
                    s3_q6_1: null,
                    s3_q6_2_1: null,
                    s3_q6_2_2: null,
                    s3_q6_3_1: null,
                    s3_q6_3_2: null,
                    s3_q6_4_1: null,
                    s3_q6_4_2: null,
                    s3_q6_5_1: null,
                    s3_q6_5_2: null,
                    s3_q6_6_1: null,
                    s3_q6_6_2: null,
                    s3_q6_7_1: null,
                    s3_q6_7_2: null,
                    s3_q6_8_1: null,
                    s3_q6_8_2: null,
                    s3_q6_9_1: null,
                    s3_q6_9_2: null,
                    s3_q7_1: null,
                    s3_q7_2: null,
                    s4_c: null,
                    s4_1: null,
                    s4_2: null,
                    r1_1: null,
                    r1_2: null,
                    r1_3: null,
                    r1_4_y: null,
                    r1_5: null,
                    r1_6: null,
                    r1_7: null,
                    r1_8: null,
                    r1_8_c: null,
                    r2_1: null,
                    r2_2: null,
                    r2_2_y: null,
                    r2_3: null,
                    r2_4: null,
                    r2_5: null,
                    r2_6: null,
                    r2_7_c: null,
                    r3_1: null,
                    r3_2_c: null,
                    r4_1: null,
                    r4_2_c: null,
                    r5_1: null,
                    r5_2: null,
                    DocId: null,
                    q1_5_3_c: null,
                    PATIENT_SIGNATURE: null,
                    PATIENT_DATE: new Date(),
                    DOCTOR_ID:null
                };
                var oriInfo;
                var info = $scope.info;
                DocumentService.loadCat3(info).then(function (response) {
                    // throw exception
                    if (response['status'] === 'fail') {
                        $state.go('loggedIn.home', null, {"reload": true});
                    }
                    else {
                        if (response[0].status === 'findNull') {
                            // Add new category 3
                            $scope.isNew = true;
                            $scope.info.patient = response[0].patient;
                            $scope.info.apptInfo = response[0].appt;
                            $scope.info.doctor = response[0].doctor;
                            $scope.info.company = response[0].company;
                            oriInfo = angular.copy($scope.info);
                        }
                        else if (response[0].status === 'findFound') {
                            var data = response[0].data;
                            $scope.isNew = false;
                            var timeAppt = (((new Date(response[0].appt.FROM_TIME)).getHours()) % 12 <= 9 ? '0' + ((new Date(response[0].appt.FROM_TIME)).getHours()) % 12 : ((new Date(response[0].appt.FROM_TIME)).getHours()) % 12) + ' : ' + (((new Date(response[0].appt.FROM_TIME)).getMinutes()) <= 9 ? '0' + ((new Date(response[0].appt.FROM_TIME)).getMinutes()) : ((new Date(response[0].appt.FROM_TIME)).getMinutes())) + (((new Date(response[0].appt.FROM_TIME)).getHours()) > 12 ? ' PM' : ' AM');
                            // Update category 3
                            $scope.info = {
                                timeAppt: timeAppt,
                                apptInfo: response[0].appt,
                                patient: response[0].patient,
                                doctor: response[0].doctor,
                                company: response[0].company,
                                cat_id: data.cat_id,
                                cal_id: data.cal_id,
                                patient_id: data.patient_id,
                                q1_4: data.q1_4,
                                q1_4_c: data.q1_4_c,
                                q1_5_1: data.q1_5_1,
                                q1_5_2: data.q1_5_2,
                                q1_5_3: data.q1_5_3,
                                s3_q1_1_1: data.s3_q1_1_1,
                                s3_q1_1_2: data.s3_q1_1_2,
                                s3_q1_2_1: data.s3_q1_2_1,
                                s3_q1_2_2: data.s3_q1_2_2,
                                s3_q1_3: data.s3_q1_3,
                                s3_q1_4: data.s3_q1_4,
                                s3_q2_1_1: data.s3_q2_1_1,
                                s3_q2_1_2: data.s3_q2_1_2,
                                s3_q2_1_3: data.s3_q2_1_3,
                                s3_q2_1_4: data.s3_q2_1_4,
                                s3_q2_1_5: data.s3_q2_1_5,
                                s3_q2_1_6: data.s3_q2_1_6,
                                s3_q2_1_7: data.s3_q2_1_7,
                                s3_q2_1_8: data.s3_q2_1_8,
                                s3_q2_2_1: data.s3_q2_2_1,
                                s3_q2_2_2: data.s3_q2_2_2,
                                s3_q2_2_3: data.s3_q2_2_3,
                                s3_q2_2_4: data.s3_q2_2_4,
                                s3_q2_2_5: data.s3_q2_2_5,
                                s3_q2_2_6: data.s3_q2_2_6,
                                s3_q2_2_7: data.s3_q2_2_7,
                                s3_q2_2_8: data.s3_q2_2_8,
                                s3_q2_3: data.s3_q2_3,
                                s3_q3_1: data.s3_q3_1,
                                s3_q3_2: data.s3_q3_2,
                                s3_q3_3_1: data.s3_q3_3_1,
                                s3_q3_3_2: data.s3_q3_3_2,
                                s3_q3_4_1: data.s3_q3_4_1,
                                s3_q3_4_2: data.s3_q3_4_2,
                                s3_q3_5: data.s3_q3_5,
                                s3_q3_6: data.s3_q3_6,
                                s3_q4: data.s3_q4,
                                s3_q5_1_1_1: data.s3_q5_1_1_1,
                                s3_q5_1_1_2: data.s3_q5_1_1_2,
                                s3_q5_1_1_3: data.s3_q5_1_1_3,
                                s3_q5_1_1_4: data.s3_q5_1_1_4,
                                s3_q5_1_2: data.s3_q5_1_2,
                                s3_q5_2: data.s3_q5_2,
                                s3_q5_3: data.s3_q5_3,
                                s3_q5_4: data.s3_q5_4,
                                s3_q5_5: data.s3_q5_5,
                                s3_q5_6: data.s3_q5_6,
                                s3_q6_c: data.s3_q6_c,
                                s3_q6_1: data.s3_q6_1,
                                s3_q6_2_1: data.s3_q6_2_1,
                                s3_q6_2_2: data.s3_q6_2_2,
                                s3_q6_3_1: data.s3_q6_3_1,
                                s3_q6_3_2: data.s3_q6_3_2,
                                s3_q6_4_1: data.s3_q6_4_1,
                                s3_q6_4_2: data.s3_q6_4_2,
                                s3_q6_5_1: data.s3_q6_5_1,
                                s3_q6_5_2: data.s3_q6_5_2,
                                s3_q6_6_1: data.s3_q6_6_1,
                                s3_q6_6_2: data.s3_q6_6_2,
                                s3_q6_7_1: data.s3_q6_7_1,
                                s3_q6_7_2: data.s3_q6_7_2,
                                s3_q6_8_1: data.s3_q6_8_1,
                                s3_q6_8_2: data.s3_q6_8_2,
                                s3_q6_9_1: data.s3_q6_9_1,
                                s3_q6_9_2: data.s3_q6_9_2,
                                s3_q7_1: data.s3_q7_1,
                                s3_q7_2: data.s3_q7_2,
                                s4_c: data.s4_c,
                                s4_1: data.s4_1,
                                s4_2: data.s4_2,
                                r1_1: data.r1_1,
                                r1_2: data.r1_2,
                                r1_3: data.r1_3,
                                r1_4_y: data.r1_4_y,
                                r1_5: data.r1_5,
                                r1_6: data.r1_6,
                                r1_7: data.r1_7,
                                r1_8: data.r1_8,
                                r1_8_c: data.r1_8_c,
                                r2_1: data.r2_1,
                                r2_2: data.r2_2,
                                r2_2_y: data.r2_2_y,
                                r2_3: data.r2_3,
                                r2_4: data.r2_4,
                                r2_5: data.r2_5,
                                r2_6: data.r2_6,
                                r2_7_c: data.r2_7_c,
                                r3_1: data.r3_1,
                                r3_2_c: data.r3_2_c,
                                r4_1: data.r4_1,
                                r4_2_c: data.r4_2_c,
                                r5_1: data.r5_1,
                                r5_2: data.r5_2,
                                DocId: data.DocId,
                                q1_5_3_c: data.q1_5_3_c,
                                PATIENT_SIGNATURE: data.PATIENT_SIGNATURE,
                                PATIENT_DATE: data.PATIENT_DATE,
                                DOCTOR_ID: data.DOCTOR_ID
                            };
                            oriInfo = angular.copy($scope.info);
                        }
                        // throw exception.
                        else {
                            $state.go('loggedIn.home', null, {"reload": true});
                        }

                    }

                })
                $scope.resetForm = function () {
                    $scope.info = angular.copy(oriInfo);
                    $scope.category3Form.$setPristine();
                }

                $scope.infoChanged = function () {
                    return !angular.equals(oriInfo, $scope.info);
                }
                $scope.submit = function (category3Form) {
                    if (category3Form.$error.pattern || category3Form.$error.maxlength) {
                        toastr.error("Please Input All Required Information!", "Error");
                    }
                    else {
                        var info = $scope.info;
                        if ($scope.isNew === true) {
                            /**
                             * add new cat3
                             */
                            DocumentService.insertCat3(info).then(function (response) {
                                if (response['status'] === 'success') {

                                    toastr.success("Add new success!", "Success");
                                    $state.go('loggedIn.category3', null, {"reload": true});
                                }
                                else if (response['status'] === 'fail')
                                    toastr.error("Add new fail!", "Error");

                            });
                        }
                        else if ($scope.isNew == false) {
                            DocumentService.editCat3(info).then(function (response) {
                                if (response['status'] === 'success') {
                                    toastr.success("Update success!", "Success");

                                    $state.go('loggedIn.category3', null, {"reload": true});
                                }
                                else if (response['status'] === 'fail') {
                                    toastr.error("Update fail!", "Error");
                                }
                                else {
                                    /**
                                     * throw new exception
                                     */
                                    $state.go('loggedIn.home', null, {"reload": true});
                                }
                            });
                        }

                    }

                }
            }
        }

    });