angular.module('app.loggedIn.document.IDS.controllers', [])
    .controller("IDSController", function ($scope, $state, DocumentService, $http, $cookieStore, $stateParams, toastr, localStorageService, $state) {
        // Start Signature
        var tempSignature;
        $scope.isSignature = false;
        $scope.showSignature = function () {
            $scope.isSignature = !$scope.isSignature;
        };

        $scope.cancelClick = function () {
            $scope.isSignature = !$scope.isSignature;
            $scope.info.headers[0].SIGNATURE = tempSignature;
        };
        $scope.clearClick = function () {
            $scope.info.headers[0].SIGNATURE = '';
        };
        $scope.okClick = function () {
            $scope.isSignature = !$scope.isSignature;
            tempSignature = $scope.info.headers[0].SIGNATURE;
        };
        // End Signature

        var patientInfo = localStorageService.get('tempPatient');
        var Patient_ID = patientInfo.Patient_id;
        var CalID = -1; // $scope.apptInfo.CAL_ID;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        //set value loadIDS
        $scope.info = {
            PATIENT_ID: Patient_ID,
            CAL_ID: CalID
        };
        var info = $scope.info;
        var oriInfo;
        DocumentService.loadIDS(info)
            .then(function (response) {
                if (response['status'] == 'fail') {
                    $state.go('loggedIn.IDS', null, {
                        "reload": true
                    });
                    toastr.error("Load information fail!", "Error");
                } else if (response[0].status == 'findNull') {
                    //add new
                    $scope.isNew = true;
                } else if (response[0].status == 'findFound') {
                    //update
                    $scope.isNew = false;
                } else {
                    $state.go("loggedIn.IDS", null, {"reload": true});
                    toastr.error("Error not status!", "Error");
                }
                var data = response[0];
                $scope.info.headers = [];
                $scope.patientInfo = response[0].patient;
                angular.forEach(data.headers, function (dataH, hIndex) {
                    $scope.info.headers.push({
                        "IDAS_ID": dataH.IDAS_DF_ID || dataH.IDAS_ID,
                        "PATIENT_ID": Patient_ID,
                        "CAL_ID": CalID,
                        "DOCTOR_ID": response[0].doctor.doctor_id,
                        "DF_CODE": dataH.DF_CODE,
                        "NAME": dataH.NAME,
                        "IDAS_DATE": dataH.IDAS_DATE || new Date(),
                        "Temperature": dataH.Temperature,
                        "Creatinine": dataH.Creatinine,
                        "Drug_Test_Time": dataH.Drug_Test_Time,
                        "Expiry_Date": dataH.Expiry_Date || new Date(),
                        "Notes": dataH.Notes,
                        "Alcohol_Test_Time": dataH.Alcohol_Test_Time,
                        "Reading": dataH.Reading,
                        "Positive_Negative": dataH.Positive_Negative,
                        "Reading2": dataH.Reading2,
                        "ITEM_ID": dataH.ITEM_ID,
                        "Created_by": dataH.Created_by,
                        "Last_updated_by": dataH.Last_updated_by,
                        "NAME_COMMENT": dataH.NAME_COMMENT,
                        "ISENABLE": dataH.ISENABLE,
                        "SIGNATURE": dataH.SIGNATURE,
                        "TesterName": response[0].doctor.NAME,
                        "TesterSign": response[0].doctor.Signature,
                        "TesterDate": dataH.TesterDate || new Date(),
                        "groups": []
                    });
                    //set some value out foreach
                    var i = 0;
                    angular.forEach(data.groups, function (dataG, gIndex) {
                        if ($scope.info.headers[hIndex].IDAS_ID == dataG.IDAS_ID || $scope.info.headers[hIndex].IDAS_ID == dataG.IDAS_DF_ID) {
                            $scope.info.headers[hIndex].groups.push({
                                "IDAS_GROUP_ID": dataG.IDAS_GROUP_ID,
                                "IDAS_ID": dataG.IDAS_DF_ID || dataG.IDAS_ID,
                                "PATIENT_ID": Patient_ID,
                                "CAL_ID": CalID,
                                "ORD": dataG.ORD,
                                "GROUP_NAME": dataG.GROUP_NAME,
                                "USER_TYPE": dataG.USER_TYPE,
                                "Created_by": dataG.Created_by,
                                "Last_updated_by": dataG.Last_updated_by,
                                "ISENABLE": dataG.ISENABLE,
                                "lines": []
                            });
                            angular.forEach(data.lines, function (dataL, lIndex) {
                                if ($scope.info.headers[hIndex].groups[i].IDAS_GROUP_ID == dataL.IDAS_GROUP_ID) {
                                    $scope.info.headers[hIndex].groups[i].lines.push({
                                        "IDAS_LINE_ID": dataL.IDAS_LINE_ID,
                                        "IDAS_GROUP_ID": dataL.IDAS_GROUP_ID,
                                        "IDAS_ID": dataL.IDAS_DF_ID || dataL.IDAS_ID,
                                        "PATIENT_ID": Patient_ID,
                                        "CAL_ID": CalID,
                                        "ORD": dataL.ORD,
                                        "QUESTION": dataL.QUESTION,
                                        "YES_NO": dataL.YES_NO,
                                        "Created_by": dataL.Created_by,
                                        "Last_updated_by": dataL.Last_updated_by,
                                        "ISENABLE": dataL.ISENABLE
                                    });
                                }
                            });
                            i++;
                        }
                    });
                });
                oriInfo = angular.copy($scope.info);
            });
        $scope.resetForm = function () {
            $scope.info = angular.copy(oriInfo);
            $scope.mhForm.$setPristine();
        };
        $scope.infoChanged = function () {
            return !angular.equals(oriInfo, $scope.info);
        };
        $scope.submitIDS = function (IDSForm) {
            var info = $scope.info;
            if (IDSForm.$error.required || IDSForm.$error.maxlength || IDSForm.pattern) {
                toastr.error("Please Input All Required Information!", "Error");
            } else {
                if ($scope.isNew === true) {
                    //add new
                    DocumentService.insertIDS(info).then(function (response) {
                        if (response['status'] == 'success') {
                            toastr.success("Add new success!", "Success");
                            $state.go("loggedIn.IDS", null, {"reload": true});
                        }
                        else if (response['status'] === 'fail') {
                            toastr.error("Add new fail!", "Error");
                        }
                    });
                } else if ($scope.isNew === false) {
                    //update
                    DocumentService.updateIDS(info).then(function (response) {
                        if (response['status'] == 'success') {
                            toastr.success("Update success!", "Success");
                            $state.go("loggedIn.IDS", null, {"reload": true});
                        }
                        else if (response['status'] === 'fail') {
                            toastr.error("Update fail!", "Error");
                        }
                    });
                }
            }
        };
    });