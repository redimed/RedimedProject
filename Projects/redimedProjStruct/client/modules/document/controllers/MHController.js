/**
 * Created by thanh on 9/27/2014.
 */
angular.module('app.loggedIn.document.MH.controllers', [])
    .controller("MHController", function ($scope, DocumentService, $http, $cookieStore, toastr, $state, localStorageService, $stateParams) {
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
        }
        else {
            //set value default
            $scope.today = new Date();
            $scope.info = [];
            //begin signature
            var tempSignature;
            $scope.isSignature = false;
            $scope.showSignature = function () {
                $scope.isSignature = !$scope.isSignature;
            }

            $scope.cancelClick = function () {
                $scope.isSignature = !$scope.isSignature;
                $scope.info.Sign = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.Sign = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.Sign;
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
                $scope.info.Declaration_sign = tempSignature1;
            };
            $scope.clearClick1 = function () {
                $scope.info.Declaration_sign = '';
            };
            $scope.okClick1 = function () {
                $scope.isSignature1 = !$scope.isSignature1;
                tempSignature1 = $scope.info.Declaration_sign;
            }
            //end signature 1

            //begin signature 2
            var tempSignature2;
            $scope.isSignature2 = false;
            $scope.showSignature2 = function () {
                $scope.isSignature2 = !$scope.isSignature2;
            }

            $scope.cancelClick2 = function () {
                $scope.isSignature2 = !$scope.isSignature2;
                $scope.info.Signature2 = tempSignature2;
            };
            $scope.clearClick2 = function () {
                $scope.info.Signature2 = '';
            };
            $scope.okClick2 = function () {
                $scope.isSignature2 = !$scope.isSignature2;
                tempSignature2 = $scope.info.Signature2;
            }
            //end signature 2

            $scope.info.Date = new Date();
            $scope.info.Statement_Date = new Date();
            var PATIENT_ID = $stateParams.PatientID;
            var CAL_ID = $stateParams.CalID;
            $scope.info = {
                PATIENT_ID: PATIENT_ID,
                CAL_ID: CAL_ID
            };
            $scope.info.headers = [];
            var oriInfo;
            var info = $scope.info;
            DocumentService.loadMH(info).then(function (response) {
                if (response['status'] === 'fail') {
                    $state.go('loggedIn.home', null, {"reload": true});
                }
                else if (response[0].status === 'findNull') {
                    //add new MH.
                    $scope.isNew = true;
                }
                else if (response[0].status === 'findFound') {
                    //edit MH
                    $scope.isNew = false;
                }
                else {
                    //throw new exception
                    $state.go('loggedIn.home', null, {"reload": true});
                }
                /**
                 * load data normal input
                 */
                var data = response[0];
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "PATIENT_ID": PATIENT_ID,
                        "CAL_ID": CAL_ID,
                        "MH_DF_ID": dataH.MH_DF_ID,
                        "DF_CODE": dataH.DF_CODE,
                        "DESCRIPTION": dataH.DESCRIPTION,
                        "ISENABLE": dataH.ISENABLE,
                        "CREATED_BY": dataH.CREATED_BY,
                        "Last_updated_by": dataH.Last_updated_by,
                        "Sign": dataH.Sign,
                        "Date": dataH.Date,
                        "Release_of_medical_info_sign": dataH.Release_of_medical_info_sign,
                        "Release_of_medical_info_witness_sign": dataH.Release_of_medical_info_witness_sign,
                        "Declaration_sign": dataH.Declaration_sign,
                        "Declaration_witness_sign": dataH.Declaration_witness_sign,
                        "Statement_sign": dataH.Statement_sign,
                        "Statement_Date": dataH.Statement_Date,
                        "group": []
                    });
                    $scope.info.Sign = dataH.Sign;
                    $scope.info.Date = dataH.Date || new Date();
                    $scope.info.Declaration_sign = dataH.Declaration_sign;
                    $scope.info.Declaration_witness_sign = dataH.Declaration_witness_sign;
                    $scope.info.Statement_sign = dataH.Statement_sign;
                    $scope.info.Statement_Date = dataH.Statement_Date || new Date();


                    var g = 0;
                    angular.forEach(data.groups, function (dataG, gIndex) {
                        if (dataG.MH_DF_ID === $scope.info.headers[hIndex].MH_DF_ID) {
                            $scope.info.headers[hIndex].group.push({
                                "PATIENT_ID": PATIENT_ID,
                                "CAL_ID": CAL_ID,
                                "GROUP_ID": dataG.GROUP_ID,
                                "MH_DF_ID": dataG.MH_DF_ID,
                                "ORD": dataG.ORD,
                                "GROUP_NAME": dataG.GROUP_NAME,
                                "ISENABLE": dataG.ISENABLE,
                                "CREATED_BY": dataG.CREATED_BY,
                                "Last_updated_by": dataG.Last_updated_by,
                                "USER_TYPE": dataG.USER_TYPE,
                                "line": []
                            });
                            var l = 0;
                            angular.forEach(data.lines, function (dataL, lIndex) {
                                if ($scope.info.headers[hIndex].group[g].GROUP_ID === dataL.GROUP_ID) {
                                    $scope.info.headers[hIndex].group[g].line.push({
                                        "PATIENT_ID": PATIENT_ID,
                                        "CAL_ID": CAL_ID,
                                        "MH_LINE_ID": dataL.MH_LINE_ID,
                                        "GROUP_ID": dataL.GROUP_ID,
                                        "MH_DF_ID": dataL.MH_DF_ID,
                                        "ORD": dataL.ORD,
                                        "QUESTION": dataL.QUESTION,
                                        "YES_NO": dataL.YES_NO,
                                        "ISCOMMENT_WHEN_YES": dataL.ISCOMMENT_WHEN_YES,
                                        "ISCOMMENT_WHEN_NO": dataL.ISCOMMENT_WHEN_NO,
                                        "Comments": dataL.Comments,
                                        "ISDETAILS_ANSWER_ONLY": dataL.ISDETAILS_ANSWER_ONLY,
                                        "ISENABLE": dataL.ISENABLE,
                                        "CREATED_BY": dataL.CREATED_BY,
                                        "Last_updated_by": dataL.Last_updated_by,
                                        "ISDetails_Answer_IfYes": dataL.ISDetails_Answer_IfYes,
                                        "subquestion": []
                                    });
                                    angular.forEach(data.subquestions, function (dataS) {
                                        if (dataS.MH_LINE_ID === $scope.info.headers[hIndex].group[g].line[l].MH_LINE_ID) {
                                            $scope.info.headers[hIndex].group[g].line[l].subquestion.push({
                                                "PATIENT_ID": PATIENT_ID,
                                                "CAL_ID": CAL_ID,
                                                "MH_LINE_SUB_ID": dataS.MH_LINE_SUB_ID,
                                                "MH_LINE_ID": dataS.MH_LINE_ID,
                                                "ORD": dataS.ORD,
                                                "QUESTION": dataS.QUESTION,
                                                "YES_NO": dataS.YES_NO,
                                                "ISCOMMENT_WHEN_YES": dataS.ISCOMMENT_WHEN_YES,
                                                "ISCOMMENT_WHEN_NO": dataS.ISCOMMENT_WHEN_NO,
                                                "Comments": dataS.Comments,
                                                "ISENABLE": dataS.ISENABLE,
                                                "CREATED_BY": dataS.CREATED_BY,
                                                "Last_updated_by": dataS.Last_updated_by
                                            });
                                        }
                                    });
                                    l++;
                                }
                            });
                            g++;
                        }
                    });
                });
                $scope.info.doctorInfo = $cookieStore.get('doctorInfo');
                $scope.info.apptInfo = localStorageService.get('tempAppt');
                $scope.info.patient = localStorageService.get('tempPatient');
                oriInfo = angular.copy($scope.info);
            });

            $scope.resetForm = function () {
                $scope.info = angular.copy(oriInfo);
                $scope.mhForm.$setPristine();
            }

            $scope.checkAbove = function () {
                if ($scope.info.asAbove == 1) {
                    $scope.info.Above = $scope.info.patient.Address1 || $scope.info.patient.Address2;
                }
                else {
                    $scope.info.Above = '';
                }
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }
            $scope.submit = function (mhForm) {
                //check validate
                if (mhForm.$error.required || mhForm.$error.maxlength || mhForm.$error.pattern) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
                    var info = angular.copy($scope.info);
                    if ($scope.isNew) {
                        /**
                         * new document
                         */
                        DocumentService.insertMH(info).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Add new success!", "Success");
                                $state.go('loggedIn.MH', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error("Add new fail!", "Error");
                            }
                        })
                    }

                    else {
                        /**
                         * edit document
                         */
                        console.log(info);
                        DocumentService.editMH(info).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Update success!", "Success");
                                $state.go('loggedIn.MH', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error("Update fail!", "Error");
                            }
                        });
                    }
                }
            }
        }
    });



