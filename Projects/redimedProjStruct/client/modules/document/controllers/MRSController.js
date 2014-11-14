/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.MRS.controllers', [])
    .controller("MRSController", function ($scope, DocumentService, $http, $cookieStore, $state, toastr,$stateParams) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        var CalID = $stateParams.CalID;
        var Patient_ID = $stateParams.PatientID;
        console.log("MRS: " + CalID + " patient: " + Patient_ID);

        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go("loggedIn.MRS", null, {"reload": true});
        }
        else {
            $scope.info = [];
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
                var PATIENT_ID = 999;
                var CAL_ID = 999;
                var data = response[0];
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "MRS_DF_ID": dataH.MRS_DF_ID, "PATIENT_ID": PATIENT_ID, "CAL_ID": CAL_ID, "DF_CODE": dataH.DF_CODE, "ITEM_ID": dataH.ITEM_ID,
                        "DESCRIPTION": dataH.DESCRIPTION, "ISENABLE": dataH.ISENABLE, "Created_by": dataH.Created_by,
                        "Creation_date": dataH.Creation_date, "Last_updated_by": dataH.Last_updated_by,
                        "Last_update_date": dataH.Last_update_date, "practitioner": dataH.practitioner,
                        "practitionSign": dataH.practitionSign, "practitionDate": dataH.practitionDate || new Date(), "isReview": dataH.isReview, "group": []
                    })
                    angular.forEach(data.groups, function (dataG, gIndex) {
                        if (dataG.MRS_DF_ID === $scope.info.headers[hIndex].MRS_DF_ID) {
                            $scope.info.headers[hIndex].group.push({
                                "MRS_GROUP_ID": dataG.MRS_GROUP_ID, "MRS_DF_ID": dataG.MRS_DF_ID,
                                "PATIENT_ID": PATIENT_ID, "CAL_ID": CAL_ID,
                                "ORD": dataG.ORD, "GROUP_NAME": dataG.GROUP_NAME, "USER_TYPE": dataG.USER_TYPE,
                                "ISENABLE": dataG.ISENABLE, "Created_by": dataG.Created_by,
                                "Creation_date": dataG.Creation_date, "Last_updated_by": dataG.Last_updated_by,
                                "Last_update_date": dataG.Last_update_date, "line": []
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
                                    "Creation_date": dataL.Creation_date,
                                    "Last_updated_by": dataL.Last_updated_by,
                                    "Last_update_date": dataL.Last_update_date
                                });
                            }
                        });
                    });
                });
                oriInfo = angular.copy($scope.info.headers);
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
                $scope.info.headers = angular.copy(oriInfo);
                $scope.mrsForm.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info.headers);
            }
            $scope.submit = function (mrsForm) {
                var info = $scope.info.headers;
                if ($scope.isNew == true) {
                    //add new mrs
                    DocumentService.insertMRS(info).then(function (response) {
                        if (response['status'] === 'fail') {
                            //insert error
                            toastr.error("Add fail", "Error");
                        }
                        else if (response['status'] === 'success') {
                            toastr.success("Add success", "Success");
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
                            toastr.error("Edit fail!", "Error");
                        }
                        else if (response['status'] === 'success') {
                            toastr.success("Edit success!", "Success");
                            $state.go('loggedIn.MRS', null, {"reload": true});
                        }
                    });
                }
            }
        }
    });
