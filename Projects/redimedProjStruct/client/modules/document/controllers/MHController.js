/**
 * Created by thanh on 9/27/2014.
 */
angular.module('app.loggedIn.document.MH.controllers', [])
    .controller("MHController", function ($scope, DocumentService, $http, $cookieStore, toastr, $state,$stateParams) {

        var CalID = $stateParams.CalID;
        var Patient_ID = $stateParams.PatientID;
        console.log("MH: " + CalID + " patient: " + Patient_ID);

        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
        }
        else {
            $scope.info = [];
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
                var i = 0;
                angular.forEach(data.headers, function (dataH) {
                    $scope.info.headers.push({
                        "MH_DF_ID": dataH.MH_DF_ID, "DF_CODE": dataH.DF_CODE, "DESCRIPTION": dataH.DESCRIPTION,
                        "ISENABLE": dataH.ISENABLE, "CREATED_BY": dataH.CREATED_BY,
                        "CREATION_DATE": dataH.CREATION_DATE, "Last_updated_by": dataH.Last_updated_by,
                        "Last_update_date": dataH.Last_update_date, "group": []
                    });
                    var j = 0;
                    angular.forEach(data.groups, function (dataG) {
                        if (dataG.MH_DF_ID === $scope.info.headers[i].MH_DF_ID) {
                            $scope.info.headers[i].group.push({
                                "GROUP_ID": dataG.GROUP_ID, "MH_DF_ID": dataG.MH_DF_ID, "ORD": dataG.ORD,
                                "GROUP_NAME": dataG.GROUP_NAME, "ISENABLE": dataG.ISENABLE,
                                "CREATED_BY": dataG.CREATED_BY, "CREATION_DATE": dataG.CREATION_DATE,
                                "Last_updated_by": dataG.Last_updated_by, "Last_update_date": dataG.Last_update_date,
                                "USER_TYPE": dataG.USER_TYPE,
                                "line": []
                            });
                            var k = 0;
                            angular.forEach(data.lines, function (dataL) {
                                if (dataL.GROUP_ID === $scope.info.headers[i].group[j].GROUP_ID) {
                                    $scope.info.headers[i].group[j].line.push({
                                        "MH_LINE_ID": dataL.MH_LINE_ID, "GROUP_ID": dataL.GROUP_ID,
                                        "MH_DF_ID": dataL.MH_DF_ID, "ORD": dataL.ORD,
                                        "QUESTION": dataL.QUESTION, "YES_NO": dataL.YES_NO,
                                        "ISCOMMENT_WHEN_YES": dataL.ISCOMMENT_WHEN_YES,
                                        "ISCOMMENT_WHEN_NO": dataL.ISCOMMENT_WHEN_NO, "Comments": dataL.Comments,
                                        "ISDETAILS_ANSWER_ONLY": dataL.ISDETAILS_ANSWER_ONLY, "ISENABLE": dataL.ISENABLE,
                                        "CREATED_BY": dataL.CREATED_BY, "CREATION_DATE": dataL.CREATION_DATE,
                                        "Last_updated_by": dataL.Last_updated_by,
                                        "Last_update_date": dataL.Last_update_date,
                                        "ISDetails_Answer_IfYes": dataL.ISDetails_Answer_IfYes, "subquestion": []
                                    });
                                    angular.forEach(data.subquestions, function (dataS) {
                                        if (dataS.MH_LINE_ID === $scope.info.headers[i].group[j].line[k].MH_LINE_ID) {
                                            $scope.info.headers[i].group[j].line[k].subquestion.push({
                                                "MH_LINE_SUB_ID": dataS.MH_LINE_SUB_ID, "MH_LINE_ID": dataS.MH_LINE_ID,
                                                "ORD": dataS.ORD, "QUESTION": dataS.QUESTION, "YES_NO": dataS.YES_NO,
                                                "ISCOMMENT_WHEN_YES": dataS.ISCOMMENT_WHEN_YES,
                                                "ISCOMMENT_WHEN_NO": dataS.ISCOMMENT_WHEN_NO, "Comments": dataS.Comments,
                                                "ISENABLE": dataS.ISENABLE, "CREATED_BY": dataS.CREATED_BY,
                                                "CREATION_DATE": dataS.CREATION_DATE,
                                                "Last_updated_by": dataS.Last_updated_by,
                                                "Last_update_date": dataS.Last_update_date
                                            });
                                        }
                                    });
                                    k++;
                                }
                            });
                            j++;
                        }
                    });
                    i++;
                });
                oriInfo = angular.copy($scope.info.headers);
            });

            $scope.resetForm = function () {
                $scope.info.headers = angular.copy(oriInfo);
                $scope.mhForm.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info.headers);
            }
            $scope.submit = function (mhForm) {
                //check validate
                if (mhForm.$error.required || mhForm.$error.maxlength || mhForm.$error.pattern) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
                    if ($scope.isNew) {
                        /**
                         * new document
                         */
                        var info = $scope.info;
                        DocumentService.insertMH(info.headers).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Add success!", "Success");
                                $state.go('loggedIn.MH', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error("Add fail!", "Error");
                            }
                        })
                    }

                    else {
                        /**
                         * edit document
                         */
                        var info = $scope.info;
                        DocumentService.editMH(info.headers).then(function (response) {
                            if (response['status'] === 'success') {
                                toastr.success("Edit success!", "Success");
                                $state.go('loggedIn.MH', null, {"reload": true});
                            }
                            else if (response['status'] === 'fail') {
                                toastr.error("Edit fail!", "Error");
                            }
                        });
                    }
                }
            }
        }
    });



