/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.SA1.controllers', [])
    .controller("SA1Controller", function ($scope, $state, DocumentService, $http, $cookieStore, toastr) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.info = [];
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go('loggedIn.SA1', null, {'reload': true});
        }
        else {
            $scope.info = {
                PATIENT_ID: 999,
                CAL_ID: 999
            }
            var info = $scope.info;
            DocumentService.loadSA1(info).then(function (response) {
                if (response['status'] === 'fail') {
                    $state.go('loggedIn.home', null, {'reload': true});
                }
                else if (response[0].status === 'findNull') {
                    //add new
                    $scope.isNew = true;
                }
                else if (response[0].status === 'findFound') {
                    //edit
                    $scope.isNew = false;
                }
                /**
                 * load input normal
                 */
                var data = response[0];
                $scope.info.headers = [];
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "PATIENT_ID": dataH.PATIENT_ID,
                        "CAL_ID": dataH.CAL_ID,
                        "SA_ID": dataH.SA_ID,
                        "SA_NAME": dataH.SA_NAME,
                        "ISENABLE": dataH.ISENABLE,
                        "SA_CODE": dataH.SA_CODE,
                        "CREATED_BY": dataH.CREATED_BY,
                        "CREATION_DATE": dataH.CREATION_DATE,
                        "LAST_UPDATED_BY": dataH.LAST_UPDATED_BY,
                        "LAST_UPDATE_DATE": dataH.LAST_UPDATE_DATE,
                        "TEST_DATE": dataH.TEST_DATE,
                        "TESTER": dataH.TESTER,
                        "REPORT_TYPE": dataH.REPORT_TYPE,
                        "RECIPIENT_NAME": dataH.RECIPIENT_NAME,
                        "DOCTOR_ID": dataH.DOCTOR_ID,
                        "SIGNATURE": dataH.SIGNATURE,
                        "LOCATION_ID": dataH.LOCATION_ID,
                        "sections": []
                    });
                    var j = 0;
                    angular.forEach(data.sections, function (dataS) {
                        if ($scope.info.headers[hIndex].SA_ID === dataS.SA_ID) {
                            $scope.info.headers[hIndex].sections.push({
                                "PATIENT_ID": dataS.PATIENT_ID,
                                "CAL_ID": dataS.CAL_ID,
                                "SECTION_ID": dataS.SECTION_ID,
                                "SA_ID": dataS.SA_ID,
                                "SECTION_NAME": dataS.SECTION_NAME,
                                "ORD": dataS.ORD,
                                "USER_TYPE": dataS.USER_TYPE,
                                "ISENABLE": dataS.ISENABLE,
                                "CREATED_BY": dataS.CREATED_BY,
                                "CREATION_DATE": dataS.CREATION_DATE,
                                "LAST_UPDATED_BY": dataS.LAST_UPDATED_BY,
                                "LAST_UPDATE_DATE": dataS.LAST_UPDATE_DATE,
                                "lines": []
                            });
                            angular.forEach(data.lines, function (dataL) {
                                if ($scope.info.headers[hIndex].sections[j].SECTION_ID === dataL.SECTION_ID) {
                                    $scope.info.headers[hIndex].sections[j].lines.push({
                                        "PATIENT_ID": dataL.PATIENT_ID,
                                        "CAL_ID": dataL.CAL_ID,
                                        "LINE_ID": dataL.LINE_ID,
                                        "SECTION_ID": dataL.SECTION_ID,
                                        "SA_ID": dataL.SA_ID,
                                        "NAME": dataL.NAME,
                                        "VALUE_RIGHT": dataL.VALUE_RIGHT,
                                        "VALUE_LEFT": dataL.VALUE_LEFT,
                                        "ISENABLE": dataL.ISENABLE,
                                        "CREATED_BY": dataL.CREATED_BY,
                                        "CREATION_DATE": dataL.CREATION_DATE,
                                        "LAST_UPDATED_BY": dataL.LAST_UPDATED_BY,
                                        "LAST_UPDATE_DATE": dataL.LAST_UPDATE_DATE
                                    });
                                }
                            });
                            j++;
                        }
                    });
                });
            });
        }
        $scope.submit = function (SA1) {
            if (SA1.$error.required||SA1.$error.maxlength) {
                toastr.error("Please Input All Required Information!", "Error");
            }
            else {
                var info = $scope.info;
                if ($scope.isNew === true) {
                    //add new sa1
                    DocumentService.insertSA1(info).then(function (response) {
                        if (response['status'] === 'fail') {
                            //add new fail
                            toastr.error("Add fail!", "Error");
                        }
                        else if (response['status'] === 'success') {
                            //edit success
                            toastr.success("Add success!", "Success");
                            $state.go('loggedIn.SA1', null, {"reload": true});
                        }
                        else {
                            //throw exception
                            $state.go('loggedIn.home', null, {'reload': true});
                        }
                    });
                }
                else if ($scope.isNew === false) {
                    //edit old sa1
                    DocumentService.editSA1(info).then(function (response) {
                        if (response['status'] === 'fail') {
                            //edit fail
                            toastr.error("Edit fail!", "Error");
                        }
                        else if (response['status'] === 'success') {
                            //edit success
                            toastr.success("Edit success!", "Success");
                            $state.go('loggedIn.SA1', null, {'reload': true});
                        }
                        else {
                            //throw exception
                            $state.go("loggedIn.home", null, {'reload': true});
                        }
                    })
                }
            }
        }
    });
