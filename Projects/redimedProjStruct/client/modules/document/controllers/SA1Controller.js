/**
 * Created by HUYNHAN on 10/1/2014.
 */
angular.module('app.loggedIn.document.SA1.controllers', [])
    .controller("SA1Controller", function ($scope, $state, DocumentService, $http, $cookieStore, toastr, $stateParams, localStorageService) {
        $scope.patientInfo = localStorageService.get('tempPatient');
        //var CalID = -1;//$scope.apptInfo.CAL_ID;
        var CalID = $stateParams.cal_id; 
        var Patient_ID = $scope.patientInfo.Patient_id;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.today = new Date();
        $scope.info = [];
        var userInfo = $cookieStore.get('userInfo');
        if (userInfo === undefined) {
            console.log("ERROR: Cookies not exist!");
            $state.go('loggedIn.SA1', null, {'reload': true});
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
                patient_id: Patient_ID,
                CAL_ID: CalID
            };
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
                $scope.info.patient = response[0].patient;
                $scope.info.doctor = response[0].doctor;
                $scope.info.appt = response[0].appt;
                $scope.info.site = response[0].site;
                $scope.info.company = response[0].company;
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "patient_id": Patient_ID,
                        "CAL_ID": CalID,
                        "SA_ID": dataH.SA_ID,
                        "SA_NAME": dataH.SA_NAME,
                        "ISENABLE": dataH.ISENABLE,
                        "SA_CODE": dataH.SA_CODE,
                        "test_date": dataH.test_date || new Date(),
                        "tester": dataH.tester,
                        "report_type": dataH.report_type,
                        "RECIPIENT_NAME": dataH.RECIPIENT_NAME,
                        "DOCTOR_ID": dataH.DOCTOR_ID || response[0].doctor.doctor_id,
                        "Signature": dataH.Signature,
                        "LOCATION_ID": dataH.LOCATION_ID,
                        "Created_by": $scope.isNew ? userInfo.id : dataH.Created_by,
                        "Last_updated_by": $scope.isNew ? dataH.Last_updated_by : userInfo.id,
                        "sections": []
                    });
                    $scope.info.Signature = $scope.info.headers[hIndex].Signature;
                    $scope.info.test_date = $scope.info.headers[hIndex].test_date;
                    $scope.info.RECIPIENT_NAME = $scope.info.headers[hIndex].RECIPIENT_NAME;
                    $scope.info.tester = $scope.info.headers[hIndex].tester;
                    var j = 0;
                    angular.forEach(data.sections, function (dataS) {
                        if ($scope.info.headers[hIndex].SA_ID === dataS.SA_ID) {
                            $scope.info.headers[hIndex].sections.push({
                                "patient_id": Patient_ID,
                                "CAL_ID": CalID,
                                "SECTION_ID": dataS.SECTION_ID,
                                "SA_ID": dataS.SA_ID,
                                "SECTION_NAME": dataS.SECTION_NAME,
                                "ORD": dataS.ORD,
                                "USER_TYPE": dataS.USER_TYPE,
                                "ISENABLE": dataS.ISENABLE,
                                "Created_by": $scope.isNew ? userInfo.id : dataS.Created_by,
                                "Last_updated_by": $scope.isNew ? dataS.Last_updated_by : userInfo.id,
                                "lines": []
                            });
                            angular.forEach(data.lines, function (dataL) {
                                if ($scope.info.headers[hIndex].sections[j].SECTION_ID === dataL.SECTION_ID) {
                                    $scope.info.headers[hIndex].sections[j].lines.push({
                                        "patient_id": Patient_ID,
                                        "CAL_ID": CalID,
                                        "LINE_ID": dataL.LINE_ID,
                                        "SECTION_ID": dataL.SECTION_ID,
                                        "SA_ID": dataL.SA_ID,
                                        "NAME": dataL.NAME || dataL.Name,
                                        "VALUE_RIGHT": dataL.VALUE_RIGHT,
                                        "VALUE_LEFT": dataL.VALUE_LEFT,
                                        "ISENABLE": dataL.ISENABLE,
                                        "Created_by": $scope.isNew ? userInfo.id : dataL.Created_by,
                                        "Last_updated_by": $scope.isNew ? dataL.Last_updated_by : userInfo.id
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
                $scope.SA1.$setPristine();
            }

            $scope.infoChanged = function () {
                return !angular.equals(oriInfo, $scope.info);
            }
            $scope.submit = function (SA1) {
                var info = $scope.info;
                if (SA1.$error.required || SA1.$error.maxlength || SA1.$error.pattern) {
                    toastr.error("Please Input All Required Information!", "Error");
                }
                else {
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
                                toastr.error("Update fail!", "Error");
                            }
                            else if (response['status'] === 'success') {
                                //edit success
                                toastr.success("Update success!", "Success");
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
        }
    })
