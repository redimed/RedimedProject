angular.module('app.loggedIn.document.cat3.controllers', [])
    .controller("Cat3Controller", function ($scope, DocumentService, $rootScope, $http, $cookieStore, toastr, $state) {
        //begin date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //end date
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go('loggedIn.home', null, {"reload": true});
        }
        else {
            /**
             * Check user exist category-calendar
             */
            var cal_id = 1; //get by params
            var patient_id = userInfo.id;
            $scope.info = {
                cal_id: cal_id,
                patient_id: patient_id,
                PATIENT_DATE: new Date()
            };
            var info = $scope.info;
            DocumentService.findCat3(info).then(function (response) {
                // throw exception
                if (response['status'] === 'fail') {
                    $state.go('loggedIn.home', null, {"reload": true});
                }
                else {
                    if (response['status'] === 'findNull') {
                        /**
                         * New document category 3
                         */
                        $scope.isNew = true;//check exist cal
                        $scope.info = {
                            cal_id: cal_id,
                            patient_id: patient_id,
                            PATIENT_DATE: new Date()
                        };
                    }
                    else if (response[0].status === 'success') {
                        var data = response[0].data;
                        /**
                         * Update category 3
                         */
                        $scope.info = {
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
                    }
                    // throw exception.
                    else {
                        $state.go('loggedIn.home', null, {"reload": true});
                    }

                }

            })

        }
        $scope.submit = function (category3Form) {
            if ($scope.isNew) {
                /**
                 * new document
                 */
                if (category3Form.$valid || category3Form.$error.pattern || category3Form.$error.maxlength) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
                    var info = $scope.info;
                    DocumentService.insertCat3(info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Add new category3 success!", "Success");
                            $state.go('loggedIn.category3', null, {"reload": true});
                        }
                        else if (response['status'] === 'fail')
                            toastr.error("Add new category3 fail!", "Error");

                    });
                }
            }

            else {
                /**
                 * edit document
                 */

                if (category3Form.$valid || category3Form.$error.pattern || category3Form.$error.maxlength) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
                    var info = $scope.info;
                    DocumentService.editCat3(info).then(function (response) {
                        if (response['status'] === 'success') {
                            toastr.success("Edit category3 successful!", "Success");

                            $state.go('loggedIn.category3', null, {"reload": true});
                        }
                        else if (response['status'] === 'fail') {
                            toastr.error("Edit category3 fail!", "Error");
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

    });