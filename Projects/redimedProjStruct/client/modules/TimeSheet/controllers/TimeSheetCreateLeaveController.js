angular.module("app.loggedIn.TimeSheet.CreateLeave.Controller", [])
    .controller("CreateLeaveController", function($scope, TimeSheetService, $cookieStore, $state, toastr, moment, $modal, StaffService, $stateParams) {
        $scope.info = {};
        $scope.info.standard = 1;
        // POPUP DATE
        $scope.dateOptions = {
            formatYear: "yy",
            startingDate: 1
        };
        //END POPUP
        if ($stateParams.id) {
            //EDIT
            TimeSheetService.LoadLeaveEdit($stateParams.id).then(function(response) {
                if (response !== undefined && response !== null &&
                    response.resultLeave !== undefined &&
                    response.resultLeave !== null &&
                    response.resultLeave[0] !== undefined && response.resultLeave[0] !== null) {
                    $scope.info = response.resultLeave[0];
                    //convert time
                    $scope.info.time_leave = StaffService.convertFromFullToShow($scope.info.time_leave);
                    //end
                }

                $scope.info.infoTypeLeave = response.resultLeaveDetail;
            });
        } else {
            //ADD NEW
            //LOAD INFO EMPLOYEE
            if ($cookieStore.get('userInfo') !== undefined && $cookieStore.get('userInfo') !== null &&
                $cookieStore.get("userInfo").id !== undefined && $cookieStore.get("userInfo").id !== null) {
                TimeSheetService.LoadInfoEmployee($cookieStore.get('userInfo').id).then(function(response) {
                    if (response.status === "success") {
                        //load employee
                        if (response !== undefined && response !== null &&
                            response.result !== undefined && response.result !== null &&
                            response.result[0] !== undefined && response.result[0] !== null) {
                            $scope.info = response.result[0];
                        }
                        //employee
                        $scope.info.application_date = new Date();
                    } else if (response.status === "error" || response.result.length === 0) {
                        $state.go("loggedIn.TimeSheetHome", null, {
                            "reload": true
                        });
                        toastr("Load infomation employee fail!", "Error");
                    } else {
                        //catch exception
                        $state.go("loggedIn.TimeSheetHome", null, {
                            "reload": true
                        });
                        toastr("Server not response!", "Error");
                    }
                });
            } else {
                $state.go('loggedIn.login', null, {
                    "reload": true
                });
                toastr.error("You not section!", "Error");
            }
            //END LOAD INFO
        }
        $scope.clickSendServer = function(statusID, formLeave) {
            if (formLeave.$invalid) {
                toastr.error("Please Input All Required Information!", "Error");
                $scope.isRequired = 1;
            } else {
                //SAVE LEAVE FORM IN SERVER
                $scope.info.statusID = statusID;
                $scope.info.USER_ID = $cookieStore.get('userInfo').id;
                TimeSheetService.UpLeaveServer($scope.info).then(function(response) {
                    if (response.status === "success") {
                        toastr.success("Apply for leave success!", "Success");
                        $state.go("loggedIn.LeaveHistory", null, {
                            "reload": true
                        });
                    } else if (response.status === "error") {
                        $state.go("loggedIn.TimeSheetHome", null, {
                            "reload": true
                        });
                        toastr.error("Apply for leave fail!", "Error");
                    } else {
                        $state.go("loggedIn.TimeSheetHome", null, {
                            "reload": true
                        });
                        toastr.error("Server not response!", "Error");
                    }
                });
                // END SAVE SERVER
            }
        };

        // LOAD TYPE LEAVE
        TimeSheetService.LoadTypeLeave().then(function(response) {
            if (response.status === "success") {
                $scope.info.infoTypeLeave = angular.copy(response.result);
            } else if (response.status === "error") {
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Load type leave fail!", "Error");
            } else {
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
        //END

        $scope.changeTime = function() {
            var total_time = 0;
            angular.forEach($scope.info.infoTypeLeave, function(time, index) {
                total_time += StaffService.convertShowToFull($scope.info.infoTypeLeave[index].time_leave);
                $scope.info.infoTypeLeave[index].time_leave_real = StaffService.convertShowToFull($scope.info.infoTypeLeave[index].time_leave);
            });
            $scope.info.time_leave = StaffService.convertFromFullToShow(total_time);
            $scope.info.time_leave_real = StaffService.convertShowToFull($scope.info.time_leave);
        };

        $scope.clickStandardChange = function(standardID) {
            if (standardID === 1) {
                if ($scope.info.infoTypeLeave !== undefined && $scope.info.infoTypeLeave !== null &&
                    $scope.info.infoTypeLeave[0] !== undefined && $scope.info.infoTypeLeave[0] !== null &&
                    $scope.info.infoTypeLeave[0].time_leave.length === 5) {
                    $scope.info.infoTypeLeave[0].time_leave = $scope.info.infoTypeLeave[0].time_leave.substr(1, $scope.info.infoTypeLeave[0].time_leave.length - 1);
                    //CALL CHANGETIME
                    $scope.changeTime();
                    //END CALL
                }
            } else if (standardID === 0) {
                if ($scope.info.infoTypeLeave !== undefined && $scope.info.infoTypeLeave !== null &&
                    $scope.info.infoTypeLeave[0] !== undefined && $scope.info.infoTypeLeave[0] !== null &&
                    $scope.info.infoTypeLeave[0].time_leave.length === 4) {
                    $scope.info.infoTypeLeave[0].time_leave = '0' + $scope.info.infoTypeLeave[0].time_leave;
                    //CALL CHANGETIME
                    $scope.changeTime();
                    //END CALL
                }
            }
        };
    });
