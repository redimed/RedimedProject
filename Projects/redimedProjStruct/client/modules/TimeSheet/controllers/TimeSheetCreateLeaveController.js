angular.module("app.loggedIn.TimeSheet.CreateLeave.Controller", [])
    .controller("CreateLeaveController", function($scope, TimeSheetService, $cookieStore, $state, toastr, $modal, StaffService, $stateParams) {
        $scope.info = {};

        //popup date
        $scope.dateOptions = {
            formatYear: "yy",
            startingDate: 1
        };

        /*
        LoadLeaveEdit: load a Leave form to edit
        input: information Leave form
        output: Leave form
        */
        $scope.LoadLeaveEdit = function(info) {
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
                        //convert format time
                        $scope.info.time_leave = StaffService.ConvertFromFullToShow($scope.info.time_leave);
                    }
                    $scope.info.infoTypeLeave = response.resultLeaveDetail;
                    //convert format time
                    angular.forEach($scope.info.infoTypeLeave, function(leave, index) {
                        if ($scope.info.infoTypeLeave[index] !== undefined &&
                            $scope.info.infoTypeLeave[index] !== null &&
                            $scope.info.infoTypeLeave[index].time_leave !== undefined &&
                            $scope.info.infoTypeLeave[index].time_leave !== null &&
                            $scope.info.infoTypeLeave[index].time_leave !== 0 &&
                            !(isNaN($scope.info.infoTypeLeave[index].time_leave))) {
                            $scope.info.infoTypeLeave[index].time_leave = StaffService.ConvertFromFullToShow($scope.info.infoTypeLeave[index].time_leave);
                            if (index === 0 &&
                                $scope.info.infoTypeLeave[index].time_leave.length === 4 &&
                                $scope.info.standard === 0) {
                                $scope.info.infoTypeLeave[index].time_leave = '0' + $scope.info.infoTypeLeave[index].time_leave;
                            }
                        }
                    });
                    $scope.ChangeTime();
                } else {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Load fail!", "Error");
                }
            });
        };

        /*
        LoadLeaveAddNew: load information to create new Timesheet
        input:
        output: new Timesheet
        */
        $scope.LoadLeaveAddNew = function() {
            //load information employee
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
        };

        /*
        CreateLeaveForm: create new Leave form
        input: new Leave form data
        output: 
            - success: send message success
            - fail: send message error
        */
        $scope.CreateLeaveForm = function(info) {
            TimeSheetService.UpLeaveServer(info).then(function(response) {
                if (response.status === "success") {
                    toastr.success("Apply leave success!", "Success");
                    $state.go("loggedIn.timesheetHome.leaveHistory", null, {
                        "reload": true
                    });
                } else if (response.status === "error") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Apply leave fail!", "Error");
                } else {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };

        /*
        UpdateLeave: update a Leave form
        input: data leave form update
        output: - success: send message success
                - error: send message error
        */
        $scope.UpdateLeave = function(info) {
            TimeSheetService.UpdateLeave(info).then(function(response) {
                if (response.status === "success") {
                    $state.go("loggedIn.timesheetHome.leaveHistory", null, {
                        "reload": true
                    });
                    toastr.success("Update leave success!", "Success");
                } else if (response.status === "error") {
                    toastr.error("Update leave fail!", "Error");
                } else {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };

        if ($stateParams.id) {
            $scope.isEdit = true;
            var info = {
                idLeave: $stateParams.id,
                userId: $cookieStore.get("userInfo").id
            };
            $scope.LoadLeaveEdit(info);

        } else {
            $scope.isEdit = false;
            $scope.LoadLeaveAddNew();
        }

        /*
        ClickSendServer: validate Leave form and call create new leave or update leave function
        input: - statusID: status id of leave form
               - formLeave: form enter leave form
        output: - success: call function create, update leave form
                - error: send message error
        */
        $scope.ClickSendServer = function(statusID, formLeave) {
            $scope.isRequired = 1;
            //validate input required
            if (formLeave.$invalid) {
                toastr.error("Please Input All Required Information!", "Error");
            }

            //validate enter time leave
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
            } else {
                $scope.info.statusID = statusID;
                //check exist cookieStore userInfo and get userId
                $scope.info.USER_ID = ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null;

                if ($scope.isEdit === false) {
                    //create
                    $scope.CreateLeaveForm($scope.info);
                } else if ($scope.isEdit === true) {
                    //update
                    $scope.UpdateLeave($scope.info);
                }

            }
        };

        /*
        ChangeTime: sum time charge when enter time charge
        input: 
        output: total time charge
        */ 
        $scope.ChangeTime = function() {
            var total_time = 0;
            angular.forEach($scope.info.infoTypeLeave, function(time, index) {
                total_time += StaffService.ConvertShowToFull($scope.info.infoTypeLeave[index].time_leave);
                $scope.info.infoTypeLeave[index].time_leave_real = StaffService.ConvertShowToFull($scope.info.infoTypeLeave[index].time_leave);
            });
            $scope.info.time_leave = StaffService.ConvertFromFullToShow(total_time);
            $scope.info.time_leave_real = StaffService.ConvertShowToFull($scope.info.time_leave);
            //show __ 
            if (total_time === 0) {
                $scope.info.time_leave = null;
            }
        };

        /*
        ClickStandardChange: convert format time charge hh-mm or hhh-mm when time charge change
        input: id of standard
        output: format time chagre changed
        */
        $scope.ClickStandardChange = function(standardID) {
            if (standardID === 1) {
                if ($scope.info.infoTypeLeave !== undefined && $scope.info.infoTypeLeave !== null &&
                    $scope.info.infoTypeLeave[0] !== undefined && $scope.info.infoTypeLeave[0] !== null &&
                    $scope.info.infoTypeLeave[0].time_leave !== undefined &&
                    $scope.info.infoTypeLeave[0].time_leave !== null &&
                    $scope.info.infoTypeLeave[0].time_leave.length === 5) {
                    $scope.info.infoTypeLeave[0].time_leave = $scope.info.infoTypeLeave[0].time_leave.substr(1, $scope.info.infoTypeLeave[0].time_leave.length - 1);

                    $scope.ChangeTime();
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

                    $scope.ChangeTime();
                }
            }
        };

        /*
        CheckLeaveExist: Check user exist leave form from start date to finish date
        input: 
        output: - exist: notification and load that Leave form
        */
        $scope.CheckLeaveExist = function() {
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
    });
