angular.module("app.loggedIn.TimeSheet.CreateLeave.Controller", [])
    .controller("CreateLeaveController", function($scope, TimeSheetService, $cookieStore, $state, toastr, $modal, StaffService, $stateParams) {
        $scope.info = {};

        // POPUP DATE
        $scope.dateOptions = {
            formatYear: "yy",
            startingDate: 1
        };
        //END POPUP

        if ($stateParams.id) {

            //SET FIELD EDIT
            $scope.isEdit = true;
            //END SET
            var info = {
                idLeave: $stateParams.id,
                userId: $cookieStore.get("userInfo").id
            };
            //EDIT
            TimeSheetService.LoadLeaveEdit(info).then(function(response) {
                if (response.status === "success") {

                    if (response !== undefined && response !== null &&
                        response.resultLeave !== undefined &&
                        response.resultLeave !== null &&
                        response.resultLeave.length !== 0 &&
                        response.resultLeave[0] !== undefined && response.resultLeave[0] !== null) {
                        $scope.info = response.resultLeave[0];
                        $scope.is_reject = response.resultLeave[0].is_reject;
                        $scope.status_id = response.resultLeave[0].status_id;

                        //convert time
                        $scope.info.time_leave = StaffService.convertFromFullToShow($scope.info.time_leave);
                        //end
                    }

                    $scope.info.infoTypeLeave = response.resultLeaveDetail;

                    //convert time
                    angular.forEach($scope.info.infoTypeLeave, function(leave, index) {
                        if ($scope.info.infoTypeLeave[index] !== undefined &&
                            $scope.info.infoTypeLeave[index] !== null &&
                            $scope.info.infoTypeLeave[index].time_leave !== undefined &&
                            $scope.info.infoTypeLeave[index].time_leave !== null &&
                            $scope.info.infoTypeLeave[index].time_leave !== 0 &&
                            !(isNaN($scope.info.infoTypeLeave[index].time_leave))) {
                            $scope.info.infoTypeLeave[index].time_leave = StaffService.convertFromFullToShow($scope.info.infoTypeLeave[index].time_leave);
                            if (index === 0 &&
                                $scope.info.infoTypeLeave[index].time_leave.length === 4 &&
                                $scope.info.standard === 0) {
                                $scope.info.infoTypeLeave[index].time_leave = '0' + $scope.info.infoTypeLeave[index].time_leave;
                            }
                        }
                    });
                    //end convert

                    //CALL CHANGE TIME - INIT TIME CHARGE
                    $scope.changeTime();
                    //END CALL
                } else {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Load fail!", "Error");
                }
            });
        } else {
            $scope.isEdit = false;
            //ADD NEW
            //LOAD INFO EMPLOYEE
            if ($cookieStore.get('userInfo') !== undefined && $cookieStore.get('userInfo') !== null &&
                $cookieStore.get("userInfo").id !== undefined && $cookieStore.get("userInfo").id !== null) {
                TimeSheetService.LoadInfoEmployee($cookieStore.get('userInfo').id).then(function(response) {
                    if (response.status === "success") {
                        //load employee
                        if (response !== undefined && response !== null &&
                            response.resultEmployee !== undefined && response.resultEmployee !== null &&
                            response.resultEmployee[0] !== undefined && response.resultEmployee[0] !== null) {
                            $scope.info = response.resultEmployee[0];
                            $scope.info.standard = 1;
                            $scope.info.application_date = new Date();
                            $scope.info.infoTypeLeave = angular.copy(response.resultTypeLeave);
                        }
                        //employee
                    } else if (response.status === "error" || response.result.length === 0) {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr("Load infomation employee fail!", "Error");
                    } else {
                        //catch exception
                        $state.go("loggedIn.home", null, {
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
            $scope.isRequired = 1; //SET REQUIRED

            //ERROR INPUT
            if (formLeave.$invalid) {
                toastr.error("Please Input All Required Information!", "Error");
            }
            //END ERROR

            //ERROR NOT SIGN TIME LEAVE
            else if ($scope.info.time_leave_real === 0 ||
                $scope.info.time_leave === undefined ||
                $scope.info.time_leave === null ||
                $scope.info.time_leave.length === 0) {
                toastr.error("You must sign time leave!", "Error");
            } else if (($scope.info.time_leave_real !== undefined &&
                    $scope.info.standard !== undefined &&
                    (($scope.info.time_leave_real > 4560 &&
                            $scope.info.standard === 1) ||
                        ($scope.info.time_leave_real <= 4560 &&
                            $scope.info.standard === 0)))) {
                toastr.warning("Please make sure you have chosen the right type of Leave Form (Standard/Non-Standard).", "Warning");
            }
            //END SIGN TIME LEAVE

            //NOT ERROR INPUT
            else {
                $scope.info.statusID = statusID;
                $scope.info.USER_ID = $cookieStore.get('userInfo').id;
                if ($scope.isEdit === false) {
                    //ADD NEW

                    //SAVE LEAVE FORM IN SERVER
                    TimeSheetService.UpLeaveServer($scope.info).then(function(response) {
                        if (response.status === "success") {
                            toastr.success("Apply for leave success!", "Success");
                            $state.go("loggedIn.timesheetHome.leaveHistory", null, {
                                "reload": true
                            });
                        } else if (response.status === "error") {
                            $state.go("loggedIn.home", null, {
                                "reload": true
                            });
                            toastr.error("Apply for leave fail!", "Error");
                        } else {
                            $state.go("loggedIn.home", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    // END SAVE SERVER

                } else if ($scope.isEdit === true) {

                    //UPDATE
                    TimeSheetService.UpdateLeave($scope.info).then(function(response) {
                        if (response.status === "success") {
                            $state.go("loggedIn.timesheetHome.leaveHistory", null, {
                                "reload": true
                            });
                            toastr.success("Update leave success!", "Success");
                        } else if (response.status === "error") {
                            toastr.error("Update leave fail!", "Error");
                        } else {

                            //catch exception
                            $state.go("loggedIn.home", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                }

            }
            //END NOT ERROR
        };

        //FUNCTION CHANGE TIME LEAVE
        $scope.changeTime = function() {
            var total_time = 0;
            angular.forEach($scope.info.infoTypeLeave, function(time, index) {
                total_time += StaffService.convertShowToFull($scope.info.infoTypeLeave[index].time_leave);
                $scope.info.infoTypeLeave[index].time_leave_real = StaffService.convertShowToFull($scope.info.infoTypeLeave[index].time_leave);
            });
            $scope.info.time_leave = StaffService.convertFromFullToShow(total_time);
            $scope.info.time_leave_real = StaffService.convertShowToFull($scope.info.time_leave);
            //SHOW __ 
            if (total_time === 0) {
                $scope.info.time_leave = null;
            }
            //END SHOW __
        };
        //END CHANGE TIME LEAVE

        // FUNCTION CHANGE STANDARD
        $scope.clickStandardChange = function(standardID) {
            if (standardID === 1) {
                if ($scope.info.infoTypeLeave !== undefined && $scope.info.infoTypeLeave !== null &&
                    $scope.info.infoTypeLeave[0] !== undefined && $scope.info.infoTypeLeave[0] !== null &&
                    $scope.info.infoTypeLeave[0].time_leave !== undefined &&
                    $scope.info.infoTypeLeave[0].time_leave !== null &&
                    $scope.info.infoTypeLeave[0].time_leave.length === 5) {
                    $scope.info.infoTypeLeave[0].time_leave = $scope.info.infoTypeLeave[0].time_leave.substr(1, $scope.info.infoTypeLeave[0].time_leave.length - 1);

                    //CALL CHANGETIME
                    $scope.changeTime();
                    //END CALL
                }
            } else if (standardID === 0) {
                if ($scope.info.infoTypeLeave !== undefined &&
                    $scope.info.infoTypeLeave !== null &&
                    $scope.info.infoTypeLeave[0] !== undefined &&
                    $scope.info.infoTypeLeave[0] !== null &&
                    $scope.info.infoTypeLeave[0].time_leave !== undefined &&
                    $scope.info.infoTypeLeave[0].time_leave !== null &&
                    $scope.info.infoTypeLeave[0].time_leave.length === 4) {
                    $scope.info.infoTypeLeave[0].time_leave = '0' + $scope.info.infoTypeLeave[0].time_leave;

                    //CALL CHANGETIME
                    $scope.changeTime();
                    //END CALL
                }
            }
        };
        //END CHANGE STANDARD

        //FUNCTION CHECK LEAVE EXIST
        $scope.checkLeaveExist = function() {
            if ($scope.info.start_date !== undefined &&
                $scope.info.start_date !== null &&
                $scope.info.start_date.length !== 0 &&
                $scope.info.finish_date !== undefined &&
                $scope.info.finish_date !== null &&
                $scope.info.finish_date.length !== 0) {
                TimeSheetService.CheckLeave($cookieStore.get("userInfo").id).then(function(response) {
                    if (response.status === "success") {
                        var currentStartDate = moment(moment($scope.info.start_date).format("YYYY-MM-DD")).format("X");
                        var currentFinishDate = moment(moment($scope.info.finish_date).format("YYYY-MM-DD")).format("X");
                        var arrayTime = angular.copy(response.result);
                        angular.forEach(arrayTime, function(timeRange, index) {
                            var startDate = moment(moment(timeRange.start_date).format("YYYY-MM-DD")).format("X");
                            var finishDate = moment(moment(timeRange.finish_date).format("YYYY-MM-DD")).format("X");
                            if (currentStartDate >= startDate &&
                                currentStartDate <= finishDate &&
                                currentFinishDate <= finishDate &&
                                currentFinishDate >= startDate) {
                                swal({
                                    title: "Time leave is exist!",
                                    text: "Do you want view history!",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Yes",
                                    closeOnConfirm: true
                                }, function(isConfirm) {
                                    if (isConfirm) {
                                        $state.go("loggedIn.timesheetHome.leaveHistory", null, {
                                            "reload": true
                                        });
                                    } else {
                                        $scope.info.start_date = null;
                                        $scope.info.finish_date = null;
                                    }
                                });
                            }
                        });
                    }
                });
            }
        };
        //END CHECK LEAVE
    });
