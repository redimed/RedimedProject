/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.MRS.controllers', [])
    .controller("MRSController", function ($scope, DocumentService, $http, $cookieStore, $state, toastr, $stateParams, localStorageService) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go("loggedIn.MRS", null, {"reload": true});
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
                $scope.info.practitionSign = tempSignature;
            };
            $scope.clearClick = function () {
                $scope.info.practitionSign = '';
            };
            $scope.okClick = function () {
                $scope.isSignature = !$scope.isSignature;
                tempSignature = $scope.info.practitionSign;
            }
            //end signature
            $scope.info = {
                PATIENT_ID: $stateParams.PatientID,
                CAL_ID: $stateParams.CalID
            };
            $scope.info.headers = [];
            /**
             * exist cookies
             */
            var oriInfo;
            var info = $scope.info;
            DocumentService.loadMRS(info).then(function (response) {
                if (response['status'] === 'fail') {
                    $state.go('loggedIn.MRS', null, {raw: true});
                }
                else if (response[0].status === 'findNull') {
                    //add new mrs
                    $scope.isNew = true;
                }
                else if (response[0].status === 'findFound') {
                    $scope.isNew = false;
                }
                /**
                 * load data to input
                 */
                var PATIENT_ID = $stateParams.PatientID;
                var CAL_ID = $stateParams.CalID;
                var data = response[0];
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "MRS_DF_ID": dataH.MRS_DF_ID,
                        "PATIENT_ID": PATIENT_ID,
                        "CAL_ID": CAL_ID,
                        "DF_CODE": dataH.DF_CODE,
                        "ITEM_ID": dataH.ITEM_ID,
                        "DESCRIPTION": dataH.DESCRIPTION,
                        "ISENABLE": dataH.ISENABLE,
                        "Created_by": dataH.Created_by,
                        "Last_updated_by": dataH.Last_updated_by,
                        "practitioner": dataH.practitioner,
                        "practitionSign": dataH.practitionSign,
                        "practitionDate": dataH.practitionDate || new Date(),
                        "isReview": dataH.isReview, "group": []
                    })

                    $scope.info.practitionSign = $scope.info.headers[hIndex].practitionSign;
                    $scope.info.practitionDate = $scope.info.headers[hIndex].practitionDate;
                    $scope.info.isReview = $scope.info.headers[hIndex].isReview;
                    $scope.info.practitioner = $scope.info.headers[hIndex].practitioner;

                    angular.forEach(data.groups, function (dataG, gIndex) {
                        if (dataG.MRS_DF_ID === $scope.info.headers[hIndex].MRS_DF_ID) {
                            $scope.info.headers[hIndex].group.push({
                                "MRS_GROUP_ID": dataG.MRS_GROUP_ID,
                                "MRS_DF_ID": dataG.MRS_DF_ID,
                                "PATIENT_ID": PATIENT_ID,
                                "CAL_ID": CAL_ID,
                                "ORD": dataG.ORD,
                                "GROUP_NAME": dataG.GROUP_NAME,
                                "USER_TYPE": dataG.USER_TYPE,
                                "ISENABLE": dataG.ISENABLE,
                                "Created_by": dataG.Created_by,
                                "Last_updated_by": dataG.Last_updated_by,
                                "line": []
                            })
                        }
                        angular.forEach(data.lines, function (dataL, lIndex) {
                            if (dataL.MRS_GROUP_ID === $scope.info.headers[hIndex].group[gIndex].MRS_GROUP_ID) {
                                $scope.info.headers[hIndex].group[gIndex].line.push({
                                    "MRS_LINE_ID": dataL.MRS_LINE_ID,
                                    "MRS_GROUP_ID": dataL.MRS_GROUP_ID,
                                    "MRS_DF_ID": dataL.MRS_DF_ID,
                                    "PATIENT_ID": PATIENT_ID,
                                    "CAL_ID": CAL_ID,
                                    "ORD": dataL.ORD,
                                    "COMP_TYPE": dataL.COMP_TYPE,
                                    "QUEST_LABEL": dataL.QUEST_LABEL,
                                    "QUEST_VALUE": dataL.QUEST_VALUE,
                                    "ISCOMMENT": dataL.ISCOMMENT,
                                    "COMMENT_LABEL": dataL.COMMENT_LABEL,
                                    "comments": dataL.comments,
                                    "ISREQ_COMMENT": dataL.ISREQ_COMMENT,
                                    "ISENABLE": dataL.ISENABLE,
                                    "Created_by": dataL.Created_by,
                                    "Last_updated_by": dataL.Last_updated_by
                                });
                            }
                        });
                    });
                });
                $scope.info.doctorInfo = $cookieStore.get('doctorInfo');
                $scope.info.apptInfo = localStorageService.get('tempAppt');
                $scope.info.patient = localStorageService.get('tempPatient');


                oriInfo = angular.copy($scope.info);
            });
            $scope.checkChange = function (hIndex, gIndex, lIndex) {
                if ($scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments == 1) {
                    $scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments.checked = true;
                }
                else if ($scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments == 0) {
                    $scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments.checked = false;
                    $scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments = 0;
                }
            }
            $scope.resetForm = function () {
                $scope.info = angular.copy(oriInfo);
                $scope.mrsForm.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }
            $scope.submit = function (mrsForm) {
                if (mrsForm.$error.pattern || mrsForm.$error.maxlength) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
                    var info = $scope.info;
                    console.log(info);
                    if ($scope.isNew == true) {
                        //add new mrs
                        DocumentService.insertMRS(info).then(function (response) {
                            if (response['status'] === 'fail') {
                                //insert error
                                toastr.error("Add new fail", "Error");
                            }
                            else if (response['status'] === 'success') {
                                toastr.success("Add new success", "Success");
                                $state.go('loggedIn.MRS', null, {"reload": true});
                            }
                            else {
                                //throw exception
                                $state.go('loggedIn.MRS', null, {"reload": true});
                            }
                        })
                    }
                    else if ($scope.isNew == false) {
                        //edit old mrs
                        DocumentService.editMRS(info).then(function (response) {
                            if (response['status'] === 'fail') {
                                //edit error
                                toastr.error("Update fail!", "Error");
                            }
                            else if (response['status'] === 'success') {
                                toastr.success("Update success!", "Success");
                                $state.go('loggedIn.MRS', null, {"reload": true});
                            }
                        });
                    }
                }
            }
        }
    });
