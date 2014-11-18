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
            $scope.info = {
                cat_id: null,
                cal_id: $stateParams.CalID,
                patient_id: $stateParams.PatientID,
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
                DOCTOR_ID: $cookieStore.get('doctorInfo').doctor_id
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
                        $scope.info.patient = response[0].patient[0];
                        $scope.info.apptInfo = localStorageService.get('tempAppt');
                        oriInfo = angular.copy($scope.info);
                    }
                    else if (response[0].status === 'findFound') {
                        var data = response[0].data;
                        $scope.isNew = false;

                        // Update category 3
                        $scope.info = {
                            apptInfo: localStorageService.get('tempAppt'),
                            patient: response[0].patient[0],
                            cat_id: data[0].cat_id,
                            cal_id: data[0].cal_id,
                            patient_id: data[0].patient_id,
                            q1_4: data[0].q1_4,
                            q1_4_c: data[0].q1_4_c,
                            q1_5_1: data[0].q1_5_1,
                            q1_5_2: data[0].q1_5_2,
                            q1_5_3: data[0].q1_5_3,
                            s3_q1_1_1: data[0].s3_q1_1_1,
                            s3_q1_1_2: data[0].s3_q1_1_2,
                            s3_q1_2_1: data[0].s3_q1_2_1,
                            s3_q1_2_2: data[0].s3_q1_2_2,
                            s3_q1_3: data[0].s3_q1_3,
                            s3_q1_4: data[0].s3_q1_4,
                            s3_q2_1_1: data[0].s3_q2_1_1,
                            s3_q2_1_2: data[0].s3_q2_1_2,
                            s3_q2_1_3: data[0].s3_q2_1_3,
                            s3_q2_1_4: data[0].s3_q2_1_4,
                            s3_q2_1_5: data[0].s3_q2_1_5,
                            s3_q2_1_6: data[0].s3_q2_1_6,
                            s3_q2_1_7: data[0].s3_q2_1_7,
                            s3_q2_1_8: data[0].s3_q2_1_8,
                            s3_q2_2_1: data[0].s3_q2_2_1,
                            s3_q2_2_2: data[0].s3_q2_2_2,
                            s3_q2_2_3: data[0].s3_q2_2_3,
                            s3_q2_2_4: data[0].s3_q2_2_4,
                            s3_q2_2_5: data[0].s3_q2_2_5,
                            s3_q2_2_6: data[0].s3_q2_2_6,
                            s3_q2_2_7: data[0].s3_q2_2_7,
                            s3_q2_2_8: data[0].s3_q2_2_8,
                            s3_q2_3: data[0].s3_q2_3,
                            s3_q3_1: data[0].s3_q3_1,
                            s3_q3_2: data[0].s3_q3_2,
                            s3_q3_3_1: data[0].s3_q3_3_1,
                            s3_q3_3_2: data[0].s3_q3_3_2,
                            s3_q3_4_1: data[0].s3_q3_4_1,
                            s3_q3_4_2: data[0].s3_q3_4_2,
                            s3_q3_5: data[0].s3_q3_5,
                            s3_q3_6: data[0].s3_q3_6,
                            s3_q4: data[0].s3_q4,
                            s3_q5_1_1_1: data[0].s3_q5_1_1_1,
                            s3_q5_1_1_2: data[0].s3_q5_1_1_2,
                            s3_q5_1_1_3: data[0].s3_q5_1_1_3,
                            s3_q5_1_1_4: data[0].s3_q5_1_1_4,
                            s3_q5_1_2: data[0].s3_q5_1_2,
                            s3_q5_2: data[0].s3_q5_2,
                            s3_q5_3: data[0].s3_q5_3,
                            s3_q5_4: data[0].s3_q5_4,
                            s3_q5_5: data[0].s3_q5_5,
                            s3_q5_6: data[0].s3_q5_6,
                            s3_q6_c: data[0].s3_q6_c,
                            s3_q6_1: data[0].s3_q6_1,
                            s3_q6_2_1: data[0].s3_q6_2_1,
                            s3_q6_2_2: data[0].s3_q6_2_2,
                            s3_q6_3_1: data[0].s3_q6_3_1,
                            s3_q6_3_2: data[0].s3_q6_3_2,
                            s3_q6_4_1: data[0].s3_q6_4_1,
                            s3_q6_4_2: data[0].s3_q6_4_2,
                            s3_q6_5_1: data[0].s3_q6_5_1,
                            s3_q6_5_2: data[0].s3_q6_5_2,
                            s3_q6_6_1: data[0].s3_q6_6_1,
                            s3_q6_6_2: data[0].s3_q6_6_2,
                            s3_q6_7_1: data[0].s3_q6_7_1,
                            s3_q6_7_2: data[0].s3_q6_7_2,
                            s3_q6_8_1: data[0].s3_q6_8_1,
                            s3_q6_8_2: data[0].s3_q6_8_2,
                            s3_q6_9_1: data[0].s3_q6_9_1,
                            s3_q6_9_2: data[0].s3_q6_9_2,
                            s3_q7_1: data[0].s3_q7_1,
                            s3_q7_2: data[0].s3_q7_2,
                            s4_c: data[0].s4_c,
                            s4_1: data[0].s4_1,
                            s4_2: data[0].s4_2,
                            r1_1: data[0].r1_1,
                            r1_2: data[0].r1_2,
                            r1_3: data[0].r1_3,
                            r1_4_y: data[0].r1_4_y,
                            r1_5: data[0].r1_5,
                            r1_6: data[0].r1_6,
                            r1_7: data[0].r1_7,
                            r1_8: data[0].r1_8,
                            r1_8_c: data[0].r1_8_c,
                            r2_1: data[0].r2_1,
                            r2_2: data[0].r2_2,
                            r2_2_y: data[0].r2_2_y,
                            r2_3: data[0].r2_3,
                            r2_4: data[0].r2_4,
                            r2_5: data[0].r2_5,
                            r2_6: data[0].r2_6,
                            r2_7_c: data[0].r2_7_c,
                            r3_1: data[0].r3_1,
                            r3_2_c: data[0].r3_2_c,
                            r4_1: data[0].r4_1,
                            r4_2_c: data[0].r4_2_c,
                            r5_1: data[0].r5_1,
                            r5_2: data[0].r5_2,
                            DocId: data[0].DocId,
                            q1_5_3_c: data[0].q1_5_3_c,
                            PATIENT_SIGNATURE: data[0].PATIENT_SIGNATURE,
                            PATIENT_DATE: data[0].PATIENT_DATE,
                            DOCTOR_ID: data[0].DOCTOR_ID
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
                if ($scope.isNew === true) {
                    /**
                     * add new cat3
                     */
                    if (category3Form.$error.pattern || category3Form.$error.maxlength) {
                        toastr.error("Please Input All Required Information!", "Error");
                    }
                    else {
                        var info = $scope.info;
                        DocumentService.insertCat3(info).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Add new success!", "Success");
                                $state.go('loggedIn.category3', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail')
                                toastr.error("Add new fail!", "Error");

                        });
                    }
                }

                else {
                    /**
                     * edit cat3
                     */

                    if (category3Form.$error.pattern || category3Form.$error.maxlength || category3Form.$error.required) {
                        toastr.error("Please Input All Required Information!", "Error");
                    }
                    else {
                        var info = $scope.info;
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
                        })
                    }

                }
            }
        }

    });
