/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.MRS.controllers', [])
    .controller("MRSController", function ($scope, DocumentService, $http, $cookieStore, $state, toastr) {
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
            /**
             * exist cookies
             */
            var PATIENT_ID = userInfo.id;
            $scope.info = {
                PATIENT_ID: PATIENT_ID
            };
            var info = $scope.info;
            DocumentService.loadMRS(info).then(function (response) {
                if (response['status'] === 'fail') {
                    $state.go('loggedIn.MRS', null, {raw: true});
                }
                else if (response[0].status === 'findNull') {
                    //add new mrs
                    $scope.isNew = true;
                    alert("NEW");
                }
                else if (response[0].status === 'findFound') {
                    $scope.isNew = false;
                    alert("EDIT");
                }
                /**
                 * load data to input
                 */
                $scope.info = [];
                $scope.info.headers = [];
                var PATIENT_ID = 999;
                var CAL_ID = 999;
                var data = response[0];
                if (data.headers[0].PATIENT_ID !== undefined) {
                    PATIENT_ID = data.headers[0].PATIENT_ID;
                    CAL_ID = data.headers[0].CAL_ID;
                }
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "MRS_DF_ID": dataH.MRS_DF_ID, "PATIENT_ID": PATIENT_ID, "CAL_ID": CAL_ID, "DF_CODE": dataH.DF_CODE, "ITEM_ID": dataH.ITEM_ID,
                        "DESCRIPTION": dataH.DESCRIPTION, "ISENABLE": dataH.ISENABLE, "Created_by": dataH.Created_by,
                        "Creation_date": dataH.Creation_date, "Last_updated_by": dataH.Last_updated_by,
                        "Last_update_date": dataH.Last_update_date, "practitioner": dataH.practitioner,
                        "practitionSign": dataH.practitionSign, "practitionDate": dataH.practitionDate, "isReview": dataH.isReview, "group": []
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
                                    "MRS_LINE_ID": dataL.MRS_LINE_ID, "MRS_GROUP_ID": dataL.MRS_GROUP_ID,
                                    "MRS_DF_ID": dataL.MRS_DF_ID, "PATIENT_ID": PATIENT_ID,
                                    "CAL_ID": CAL_ID, "ORD": dataL.ORD, "COMP_TYPE": dataL.COMP_TYPE,
                                    "QUEST_LABEL": dataL.QUEST_LABEL,
                                    "ISCOMMENT": dataL.ISCOMMENT, "COMMENT_LABEL": dataL.COMMENT_LABEL,
                                    "ISREQ_COMMENT": dataL.ISREQ_COMMENT, "ISENABLE": dataL.ISENABLE,
                                    "Created_by": dataL.Created_by, "Creation_date": dataL.Creation_date,
                                    "Last_updated_by": dataL.Last_updated_by, "Last_update_date": dataL.Last_update_date
                                })
                            }
                        })
                    })
                })
            })
        }
        $scope.checkChange = function (hIndex, gIndex, lIndex) {
            if ($scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments == 1) {
                $scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments.checked = true;
            }
            else if ($scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments == 0) {
                $scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments.checked = false;
                $scope.info.headers[hIndex].group[gIndex].line[lIndex].checkComments = 0;
            }
        }
        $scope.submit = function (mrsForm) {
            var info = $scope.info;
            if ($scope.isNew == true) {
                //add new mrs
                DocumentService.insertMRS(info.headers).then(function (response) {
                    if (response['status'] === 'fail') {
                        //insert error
                        toastr.error("Add new medical results summary fail", "Error");
                    }
                    else if (response['status'] === 'success') {
                        toastr.success("Add new medical results summary success", "Success");
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
                DocumentService.editMRS(info.headers).then(function (response) {
                    if (response['status'] === 'fail') {
                        //edit error
                        toastr.error("Edit medical results summary fail!", "Error");
                    }
                    else if (response['status'] === 'success') {
                        toastr.success("Edit medical results summary success!", "Success");
                        $state.go('loggedIn.MRS', null, {"reload": true});
                    }
                })
            }
        };
    });
