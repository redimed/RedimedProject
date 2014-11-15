angular.module('app.loggedIn.document.cat2.controllers', [])
    .controller("Cat2Controller", function ($scope, DocumentService, $rootScope, $http, $cookieStore, toastr, $state,$stateParams, $filter) {
        //begin show-hidden img signature
        console.log("aaaaaaaaaaaaa");
        //clear signature
        $scope.clearSignature = function () {
            $scope.info.Signature = '';
        }
        $scope.resetSignature = function () {
            $scope.info.Signature = oriInfo.Signature;
        }
        //end show-hidden signature

        //begin date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //end date

        var CalID = $stateParams.CalID;
        var Patient_ID = $stateParams.PatientID;
        console.log("caT 2: " + CalID + " patient: " + Patient_ID);

        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go('loggedIn.home', null, {'reload': true});
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
                $scope.info.Signature = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.Signature = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.Signature;
            }

            //end signature

            $scope.today = new Date();
            //begin value default info
            $scope.info = {
                cat_id: null,
                cal_id: CalID,
                DocId: null,
                patient_id: Patient_ID,
                Signature: null,
                q1_4: null,
                q1_4_c: null,
                q1_5_1: null,
                q1_5_2: null,
                q1_5_3: null,
                q1_5_3_c: null,
                q3_1_1: null,
                q3_1_1_c: null,
                q3_1_2: null,
                q3_1_2_c: null,
                q3_1_3_1: null,
                q3_1_3_2: null,
                q3_1_3_3: null,
                q3_1_3_4: null,
                q3_1_3_5: null,
                q3_1_3_6: null,
                q3_1_3_7: null,
                q3_1_3_8: null,
                q3_1_3_9: null,
                q3_1_3_10: null,
                q3_1_3_11: null,
                q3_1_3_12: null,
                q3_1_3_13: null,
                q3_1_3_14: null,
                q3_1_3_15: null,
                q3_1_3_16: null,
                q3_1_3_17: null,
                q3_1_3_18: null,
                q3_1_3_19: null,
                q3_1_3_20: null,
                q3_1_3_21: null,
                q3_1_3_22: null,
                q3_1_3_23: null,
                q3_1_4_1: null,
                q3_1_4_2: null,
                q3_1_4_3_1: null,
                q3_1_4_3_2: null,
                q3_1_4_3_3: null,
                q3_1_4_3_4: null,
                q3_1_4_3_5: null,
                q3_1_4_3_6: null,
                q3_1_4_3_7: null,
                q3_1_4_3_8: null,
                q3_1_5_1: null,
                q3_1_5_2: null,
                q3_1_5_3: null,
                q3_1_5_4: null,
                q3_1_5_5: null,
                q3_1_5_6: null,
                q3_1_5_7: null,
                q3_1_5_8: null,
                q3_1_5_9: null,
                q3_1_5_10: null,
                q3_1_6_1: null,
                q3_1_6_2: null,
                q3_1_6_3: null,
                q3_1_6_4: null,
                q3_1_6_5: null,
                q3_1_6_6: null,
                q3_1_6_7: null,
                q3_1_6_8: null,
                q3_1_6_9: null,
                q3_1_6_10: null,
                q3_1_6_c: null,
                q3_2: null,
                q4_2_1_1_1: null,
                q4_2_1_1_2: null,
                q4_2_1_2: null,
                q4_2_1_2_c: null,
                q4_2_1_3: null,
                q4_2_1_4: null,
                q4_2_2: null,
                q4_2_3: null,
                q4_2_4_c: null,
                q4_2_5_1: null,
                q4_2_5_2: null,
                q4_2_5_3_1: null,
                q4_2_5_3_2: null,
                q4_2_5_4_1: null,
                q4_2_5_4_2: null,
                q4_2_5_5: null,
                q4_2_5_6: null,
                q4_2_6_1: null,
                q4_2_6_2: null,
                q4_2_7_L_1: null,
                q4_2_7_L_2: null,
                q4_2_7_L_3: null,
                q4_2_7_L_4: null,
                q4_2_7_L_5: null,
                q4_2_7_L_6: null,
                q4_2_7_L_7: null,
                q4_2_7_L_8: null,
                q4_2_7_R_1: null,
                q4_2_7_R_2: null,
                q4_2_7_R_3: null,
                q4_2_7_R_4: null,
                q4_2_7_R_5: null,
                q4_2_7_R_6: null,
                q4_2_7_R_7: null,
                q4_2_7_R_8: null,
                q4_2_7: null,
                q4_2_8_c: null,
                q4_2_8_1_c: null,
                q4_2_8_2_1: null,
                q4_2_8_2_c: null,
                q4_2_8_3_1: null,
                q4_2_8_3_c: null,
                q4_2_8_4_1: null,
                q4_2_8_4_c: null,
                q4_2_8_5_1: null,
                q4_2_8_5_c: null,
                q4_2_8_6_1: null,
                q4_2_8_6_c: null,
                q4_2_8_7_1: null,
                q4_2_8_7_c: null,
                q4_2_8_8_1: null,
                q4_2_8_8_c: null,
                q4_2_8_9_1: null,
                q4_2_8_9_c: null,
                q4_2_9: 0,
                q4_2_10_1: null,
                q4_2_10_2: null,
                q4_2_11: 0,
                q4_2_12_1: 0,
                q4_2_12_2: null,
                q4_2_13_1_1: null,
                q4_2_13_1_2: null,
                q4_2_13_1_3: null,
                q4_2_13_1_4: null,
                q4_2_13_1_5: null,
                q4_2_13_2: null,
                q4_2_13_3: null,
                q4_2_13_4: null,
                q4_2_13_5: null,
                q4_2_13_6: null,
                rel_cmt: null,
                rel_id: null,
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
                DATE: new Date(),
                DOCTOR_ID: null
            };
            var oriInfo = angular.copy($scope.info);
            var info = $scope.info;
            DocumentService.loadCat2(info).then(function (response) {
                if (response['status'] === 'fail') {
                    toastr.error("Load fail!", 'Error');
                    $state.go('logged.home', null, {'reload': true});
                }
                else if (response['status'] === 'findNull') {
                    //add new
                    $scope.isNew = true;
                }
                else if (response[0].status === 'findFound') {
                    //edit
                    $scope.isNew = false;
                    //load old cat2
                    var data = response[0].dataCat2;
                    $scope.info = {
                        cat_id: data[0].cat_id,
                        cal_id: data[0].cal_id,
                        DocId: data[0].DocId,
                        patient_id: data[0].patient_id,
                        Signature: data[0].Signature,
                        q1_4: data[0].q1_4,
                        q1_4_c: data[0].q1_4_c,
                        q1_5_1: data[0].q1_5_1,
                        q1_5_2: data[0].q1_5_2,
                        q1_5_3: data[0].q1_5_3,
                        q1_5_3_c: data[0].q1_5_3_c,
                        q3_1_1: data[0].q3_1_1,
                        q3_1_1_c: data[0].q3_1_1_c,
                        q3_1_2: data[0].q3_1_2,
                        q3_1_2_c: data[0].q3_1_2_c,
                        q3_1_3_1: data[0].q3_1_3_1,
                        q3_1_3_2: data[0].q3_1_3_2,
                        q3_1_3_3: data[0].q3_1_3_3,
                        q3_1_3_4: data[0].q3_1_3_4,
                        q3_1_3_5: data[0].q3_1_3_5,
                        q3_1_3_6: data[0].q3_1_3_6,
                        q3_1_3_7: data[0].q3_1_3_7,
                        q3_1_3_8: data[0].q3_1_3_8,
                        q3_1_3_9: data[0].q3_1_3_9,
                        q3_1_3_10: data[0].q3_1_3_10,
                        q3_1_3_11: data[0].q3_1_3_11,
                        q3_1_3_12: data[0].q3_1_3_12,
                        q3_1_3_13: data[0].q3_1_3_13,
                        q3_1_3_14: data[0].q3_1_3_14,
                        q3_1_3_15: data[0].q3_1_3_15,
                        q3_1_3_16: data[0].q3_1_3_16,
                        q3_1_3_17: data[0].q3_1_3_17,
                        q3_1_3_18: data[0].q3_1_3_18,
                        q3_1_3_19: data[0].q3_1_3_19,
                        q3_1_3_20: data[0].q3_1_3_20,
                        q3_1_3_21: data[0].q3_1_3_21,
                        q3_1_3_22: data[0].q3_1_3_22,
                        q3_1_3_23: data[0].q3_1_3_23,
                        q3_1_4_1: data[0].q3_1_4_1,
                        q3_1_4_2: data[0].q3_1_4_2,
                        q3_1_4_3_1: data[0].q3_1_4_3_1,
                        q3_1_4_3_2: data[0].q3_1_4_3_2,
                        q3_1_4_3_3: data[0].q3_1_4_3_3,
                        q3_1_4_3_4: data[0].q3_1_4_3_4,
                        q3_1_4_3_5: data[0].q3_1_4_3_5,
                        q3_1_4_3_6: data[0].q3_1_4_3_6,
                        q3_1_4_3_7: data[0].q3_1_4_3_7,
                        q3_1_4_3_8: data[0].q3_1_4_3_8,
                        q3_1_5_1: data[0].q3_1_5_1,
                        q3_1_5_2: data[0].q3_1_5_2,
                        q3_1_5_3: data[0].q3_1_5_3,
                        q3_1_5_4: data[0].q3_1_5_4,
                        q3_1_5_5: data[0].q3_1_5_5,
                        q3_1_5_6: data[0].q3_1_5_6,
                        q3_1_5_7: data[0].q3_1_5_7,
                        q3_1_5_8: data[0].q3_1_5_8,
                        q3_1_5_9: data[0].q3_1_5_9,
                        q3_1_5_10: data[0].q3_1_5_10,
                        q3_1_6_1: data[0].q3_1_6_1,
                        q3_1_6_2: data[0].q3_1_6_2,
                        q3_1_6_3: data[0].q3_1_6_3,
                        q3_1_6_4: data[0].q3_1_6_4,
                        q3_1_6_5: data[0].q3_1_6_5,
                        q3_1_6_6: data[0].q3_1_6_6,
                        q3_1_6_7: data[0].q3_1_6_7,
                        q3_1_6_8: data[0].q3_1_6_8,
                        q3_1_6_9: data[0].q3_1_6_9,
                        q3_1_6_10: data[0].q3_1_6_10,
                        q3_1_6_c: data[0].q3_1_6_c,
                        q3_2: data[0].q3_2,
                        q4_2_1_1_1: data[0].q4_2_1_1_1,
                        q4_2_1_1_2: data[0].q4_2_1_1_2,
                        q4_2_1_2: data[0].q4_2_1_2,
                        q4_2_1_2_c: data[0].q4_2_1_2_c,
                        q4_2_1_3: data[0].q4_2_1_3,
                        q4_2_1_4: data[0].q4_2_1_4,
                        q4_2_2: data[0].q4_2_2,
                        q4_2_3: data[0].q4_2_3,
                        q4_2_4_c: data[0].q4_2_4_c,
                        q4_2_5_1: data[0].q4_2_5_1,
                        q4_2_5_2: data[0].q4_2_5_2,
                        q4_2_5_3_1: data[0].q4_2_5_3_1,
                        q4_2_5_3_2: data[0].q4_2_5_3_2,
                        q4_2_5_4_1: data[0].q4_2_5_4_1,
                        q4_2_5_4_2: data[0].q4_2_5_4_2,
                        q4_2_5_5: data[0].q4_2_5_5,
                        q4_2_5_6: data[0].q4_2_5_6,
                        q4_2_6_1: data[0].q4_2_6_1,
                        q4_2_6_2: data[0].q4_2_6_2,
                        q4_2_7_L_1: data[0].q4_2_7_L_1,
                        q4_2_7_L_2: data[0].q4_2_7_L_2,
                        q4_2_7_L_3: data[0].q4_2_7_L_3,
                        q4_2_7_L_4: data[0].q4_2_7_L_4,
                        q4_2_7_L_5: data[0].q4_2_7_L_5,
                        q4_2_7_L_6: data[0].q4_2_7_L_6,
                        q4_2_7_L_7: data[0].q4_2_7_L_7,
                        q4_2_7_L_8: data[0].q4_2_7_L_8,
                        q4_2_7_R_1: data[0].q4_2_7_R_1,
                        q4_2_7_R_2: data[0].q4_2_7_R_2,
                        q4_2_7_R_3: data[0].q4_2_7_R_3,
                        q4_2_7_R_4: data[0].q4_2_7_R_4,
                        q4_2_7_R_5: data[0].q4_2_7_R_5,
                        q4_2_7_R_6: data[0].q4_2_7_R_6,
                        q4_2_7_R_7: data[0].q4_2_7_R_7,
                        q4_2_7_R_8: data[0].q4_2_7_R_8,
                        q4_2_7: data[0].q4_2_7,
                        q4_2_8_c: data[0].q4_2_8_c,
                        q4_2_8_1_c: data[0].q4_2_8_1_c,
                        q4_2_8_2_1: data[0].q4_2_8_2_1,
                        q4_2_8_2_c: data[0].q4_2_8_2_c,
                        q4_2_8_3_1: data[0].q4_2_8_3_1,
                        q4_2_8_3_c: data[0].q4_2_8_3_c,
                        q4_2_8_4_1: data[0].q4_2_8_4_1,
                        q4_2_8_4_c: data[0].q4_2_8_4_c,
                        q4_2_8_5_1: data[0].q4_2_8_5_1,
                        q4_2_8_5_c: data[0].q4_2_8_5_c,
                        q4_2_8_6_1: data[0].q4_2_8_6_1,
                        q4_2_8_6_c: data[0].q4_2_8_6_c,
                        q4_2_8_7_1: data[0].q4_2_8_7_1,
                        q4_2_8_7_c: data[0].q4_2_8_7_c,
                        q4_2_8_8_1: data[0].q4_2_8_8_1,
                        q4_2_8_8_c: data[0].q4_2_8_8_c,
                        q4_2_8_9_1: data[0].q4_2_8_9_1,
                        q4_2_8_9_c: data[0].q4_2_8_9_c,
                        q4_2_9: data[0].q4_2_9,
                        q4_2_10_1: data[0].q4_2_10_1,
                        q4_2_10_2: data[0].q4_2_10_2,
                        q4_2_11: data[0].q4_2_11,
                        q4_2_12_1: data[0].q4_2_12_1,
                        q4_2_12_2: data[0].q4_2_12_2,
                        q4_2_13_1_1: data[0].q4_2_13_1_1,
                        q4_2_13_1_2: data[0].q4_2_13_1_2,
                        q4_2_13_1_3: data[0].q4_2_13_1_3,
                        q4_2_13_1_4: data[0].q4_2_13_1_4,
                        q4_2_13_1_5: data[0].q4_2_13_1_5,
                        q4_2_13_2: data[0].q4_2_13_2,
                        q4_2_13_3: data[0].q4_2_13_3,
                        q4_2_13_4: data[0].q4_2_13_4,
                        q4_2_13_5: data[0].q4_2_13_5,
                        q4_2_13_6: data[0].q4_2_13_6,
                        rel_cmt: data[0].rel_cmt,
                        rel_id: data[0].rel_id,
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
                        DATE: data[0].DATE,
                        DOCTOR_ID: data[0].DOCTOR_ID
                    };
                    oriInfo = angular.copy($scope.info);
                }
            });

            $scope.resetForm = function () {
                $scope.info = angular.copy(oriInfo);
                $scope.cat2Form.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }

            $scope.submit = function (cat2Form) {
                //check validate
                if (cat2Form.$error.pattern || cat2Form.$error.maxlength || cat2Form.$error.required) {
                    toastr.error("Please Input All Required Information!", "Success");
                }
                else {
                    var info = $scope.info;
                    if ($scope.isNew === true) {
                        DocumentService.insertCat2(info).then(function (response) {
                            if (response['status'] === 'success') {
                                //add success
                                toastr.success("Add new success!", "Success");
                                $state.go('loggedIn.category2', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error('Add new fail!', "Error");
                            }
                        })
                    }
                    else if ($scope.isNew === false) {
                        DocumentService.editCat2(info).then(function (response) {
                            if (response['status'] === 'success') {
                                //update success
                                toastr.success("Update success!", "Success");
                                $state.go('loggedIn.category2', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                //update fail
                                toastr.error('Update fail!', "Error");
                            }
                        });
                    }
                }
            }
        }

    });