/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.SA2.controllers', [])
    .controller("SA2Controller", function ($scope, $state, DocumentService, $http, $cookieStore, toastr, $stateParams, localStorageService) {

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.today = new Date();
        $scope.info = [];
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go('loggedIn.SA2', null, {'reload': true});
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
            var oriInfo;
            $scope.info = {
                patient_id: $stateParams.PatientID,
                CAL_ID: $stateParams.CalID
            };
            var info = $scope.info;
            DocumentService.loadSA2(info).then(function (response) {
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
                $scope.info.patient = data.patient[0];
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        patient: response[0].patient[0],
                        apptInfo: localStorageService.get('tempAppt'),
                        doctorInfo: $cookieStore.get('doctorInfo'),
                        "patient_id": $stateParams.PatientID,
                        "CAL_ID": $stateParams.CalID,
                        "SA_ID": dataH.SA_ID,
                        "SA_NAME": dataH.SA_NAME,
                        "ISENABLE": dataH.ISENABLE,
                        "SA_CODE": dataH.SA_CODE,
                        "Created_by": dataH.Created_by,
                        "Last_updated_by": dataH.Last_updated_by,
                        "test_date": dataH.test_date || new Date(),
                        "tester": dataH.tester,
                        "report_type": dataH.report_type,
                        "RECIPIENT_NAME": dataH.RECIPIENT_NAME,
                        "DOCTOR_ID": dataH.DOCTOR_ID || $cookieStore.get('doctorInfo').doctor_id,
                        "Signature": dataH.Signature,
                        "LOCATION_ID": dataH.LOCATION_ID,
                        "sections": []
                    });
                    $scope.info.Signature = $scope.info.headers[hIndex].Signature;
                    $scope.info.test_date = $scope.info.headers[hIndex].test_date;
                    var j = 0;
                    angular.forEach(data.sections, function (dataS) {
                        if ($scope.info.headers[hIndex].SA_ID === dataS.SA_ID) {
                            $scope.info.headers[hIndex].sections.push({
                                "patient_id": $stateParams.PatientID,
                                "CAL_ID": $stateParams.CalID,
                                "SECTION_ID": dataS.SECTION_ID,
                                "SA_ID": dataS.SA_ID,
                                "SECTION_NAME": dataS.SECTION_NAME,
                                "ORD": dataS.ORD,
                                "USER_TYPE": dataS.USER_TYPE,
                                "ISENABLE": dataS.ISENABLE,
                                "Created_by": dataS.Created_by,
                                "Last_updated_by": dataS.Last_updated_by,
                                "lines": []
                            });
                            angular.forEach(data.lines, function (dataL) {
                                if ($scope.info.headers[hIndex].sections[j].SECTION_ID === dataL.SECTION_ID) {
                                    $scope.info.headers[hIndex].sections[j].lines.push({
                                        "patient_id": $stateParams.PatientID,
                                        "CAL_ID": $stateParams.CalID,
                                        "LINE_ID": dataL.LINE_ID,
                                        "SECTION_ID": dataL.SECTION_ID,
                                        "SA_ID": dataL.SA_ID,
                                        "Name": dataL.Name,
                                        "VALUE_RIGHT": dataL.VALUE_RIGHT,
                                        "VALUE_LEFT": dataL.VALUE_LEFT,
                                        "ISENABLE": dataL.ISENABLE,
                                        "Created_by": dataL.Created_by,
                                        "Last_updated_by": dataL.Last_updated_by
                                    });
                                }
                            });
                            j++;
                        }
                    });
                });
                oriInfo = angular.copy($scope.info);
            });

            $scope.resetForm = function () {
                $scope.info = angular.copy(oriInfo);
                $scope.SA2.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }

            $scope.submit = function (SA2) {

                if (SA2.$error.required || SA2.$error.maxlength) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
                    var info = $scope.info;
                    if ($scope.isNew === true) {
                        //add new sa2
                        DocumentService.insertSA2(info).then(function (response) {
                            if (response['status'] === 'fail') {
                                //add new fail
                                toastr.error("Add new fail!", "Error");
                            }
                            else if (response['status'] === 'success') {
                                //edit success
                                toastr.success("Add new success!", "Success");
                                $state.go('loggedIn.SA2', null, {"reload": true});
                            }
                            else {
                                //throw exception
                                $state.go('loggedIn.home', null, {'reload': true});
                            }
                        });
                    }
                    else if ($scope.isNew === false) {
                        //edit old sa2
                        DocumentService.editSA2(info).then(function (response) {
                            if (response['status'] === 'fail') {
                                //edit fail
                                toastr.error("Update fail!", "Error");
                            }
                            else if (response['status'] === 'success') {
                                //edit success
                                toastr.success("Update success!", "Success");
                                $state.go('loggedIn.SA2', null, {'reload': true});
                            }
                            else {
                                //throw exception
                                $state.go("loggedIn.home", null, {'reload': true});
                            }
                        });
                    }
                }
            }
        }
    });
