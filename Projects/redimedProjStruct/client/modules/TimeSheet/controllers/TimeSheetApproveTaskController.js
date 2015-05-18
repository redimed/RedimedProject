angular.module("app.loggedIn.TimeSheet.ApproveTask.Controller", [])
    .controller("ApproveTask", function($scope, $modal, TimeSheetService, toastr, $state, MODE_ROW, $cookieStore) {
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba
        //STATUS
        $scope.listStatus = [{
            code: 2,
            name: "Awaiting for Approve"
        }, {
            code: 3,
            name: "Approved"
        }, {
            code: 4,
            name: "Rejected"
        }, {
            code: 5,
            name: "Re-submitted"
        }];
        //END STATUS

        //SET PAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //END SET PAGE

        //RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.loadList();
        };
        //END RESET

        //LOAD LIST
        $scope.loadList = function() {
            TimeSheetService.LoadTimeSheetApprove($scope.searchObjectMap).then(function(response) {
                if (response.status == "success") {
                    $scope.list = response;
                } else if (response.status === "error") {
                    $state.go("loggedIn.TimeSheetHome", null, {
                        "reload": true
                    });
                    toastr.error("Loading fail!", "Error");
                } else {
                    //catch exception
                    $state.go("loggedIn.TimeSheetHome", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };
        //END LOAD LIST

        //INIT
        var init = function() {
            $scope.searchObject = {
                offset: 0,
                limit: 10,
                currentPage: 1,
                maxSize: 5,
                USER_ID: $cookieStore.get("userInfo").id,
                order: {
                    "time_tasks_week.date_submited": null,
                    "time_tasks_week.week_no": "DESC"
                },
                select: {
                    "time_tasks_week.week_no": null,
                    "hr_employee.Employee_ID": null
                },
                data: {
                    "hr_employee.Employee_Code": null
                },
                name: {
                    nameEmployee: null
                }
            };
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.list = {};
            $scope.rows = MODE_ROW;
            $scope.loadList();
        };
        init(); //call init
        //END INIT

        //SOME FUNCTION ORDER BY
        $scope.weekNoASC = function() {
            $scope.searchObjectMap.order['time_tasks_week.date_submited'] = null;
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = "ASC";
            $scope.loadList();
        };
        $scope.weekNoDESC = function() {
            $scope.searchObjectMap.order['time_tasks_week.date_submited'] = null;
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = "DESC";
            $scope.loadList();
        };
        $scope.dateSubmitedASC = function() {
            $scope.searchObjectMap.order['time_tasks_week.date_submited'] = "ASC";
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = null;
            $scope.loadList();
        };
        $scope.dateSubmitedDESC = function() {
            $scope.searchObjectMap.order['time_tasks_week.date_submited'] = "DESC";
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = null;
            $scope.loadList();
        };
        //END SOME FUNCTION ORDER BY

        //DIALOG VIEWTASK APPROVE
        var dialogViewTask = function(idTaskWeek) {
            var modalInstance = $modal.open({
                templateUrl: "ViewTask",
                controller: function($scope) {
                    $scope.infoTaskWeek = idTaskWeek;
                    $scope.clickCancel = function(info) {
                        if ((info.clickCancel === undefined || info.clickCancel === null) && (info.isReject === undefined || info.isReject === null) && info.isApprove !== true) {
                            modalInstance.close({
                                status: "cancel"
                            });
                        } else {
                            $scope.infoTaskWeek = "cancelOn";
                        }
                    };
                    $scope.clickReject = function(info) {
                        if (info.isReject === undefined || info.isReject === null) {
                            $scope.infoTaskWeek = "reject";
                        } else if (info.isReject === true) {
                            //update task week
                            TimeSheetService.RejectTaskWeek(info).then(function(response) {
                                if (response.status === "success") {
                                    modalInstance.close();
                                    $state.go("loggedIn.ApproveTask", null, {
                                        "reload": true
                                    });
                                    toastr.success("Reject success!", "Success");
                                } else if (response.status === "error") {
                                    modalInstance.close();
                                    $state.go("loggedIn.ApproveTask", null, {
                                        "reload": true
                                    });
                                    toastr.error("Reject fail!", "Error");
                                } else {
                                    //catch exception
                                    modalInstance.close();
                                    $state.go("loggedIn.TimeSheetHome", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not response!", "Error");
                                }
                            });
                        }
                    };

                    $scope.clickApprove = function(info) {
                        if (info.time_rest !== null && info.time_rest != 0.00 && info.time_rest !== "" && info.isApprove !== true) {
                            $scope.infoTaskWeek = "chooseApprove";
                        } else {
                            if (info.forPermission === false) {
                                //NOTIFICATION
                                swal({
                                    title: "Warning!",
                                    text: "Please noted that the Leave Form has not yet been submitted/approved. Do you want to approve this Timesheet?",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Yes",
                                    closeOnConfirm: true

                                }, function(isConfirm) {
                                    //update approve
                                    if (isConfirm) {
                                        TimeSheetService.ApproveTaskWeek(info).then(function(response) {
                                            if (response.status === "success") {
                                                modalInstance.close();
                                                $state.go("loggedIn.ApproveTask", null, {
                                                    "reload": true
                                                });
                                                toastr.success("Approve success!", "Success");
                                            } else if (response.status === "error") {
                                                modalInstance.close();
                                                $state.go("loggedIn.ApproveTask", null, {
                                                    "reload": true
                                                });
                                                toastr.error("Approve fail!", "Error");
                                            } else {
                                                //catch exception
                                                modalInstance.close();
                                                $state.go("loggedIn.TimeSheetHome", null, {
                                                    "reload": true
                                                });
                                                toastr.error("Server not response!", "Error");
                                            }
                                        });
                                    }
                                });
                                //END 
                            } else {
                                //update approve
                                TimeSheetService.ApproveTaskWeek(info).then(function(response) {
                                    if (response.status === "success") {
                                        modalInstance.close();
                                        $state.go("loggedIn.ApproveTask", null, {
                                            "reload": true
                                        });
                                        toastr.success("Approve success!", "Success");
                                    } else if (response.status === "error") {
                                        modalInstance.close();
                                        $state.go("loggedIn.ApproveTask", null, {
                                            "reload": true
                                        });
                                        toastr.error("Approve fail!", "Error");
                                    } else {
                                        //catch exception
                                        modalInstance.close();
                                        $state.go("loggedIn.TimeSheetHome", null, {
                                            "reload": true
                                        });
                                        toastr.error("Server not response!", "Error");
                                    }
                                });
                            }

                        }
                    };
                },
                size: "lg"
            });
        };
        //END DIALOG VIEWTASK APPROVE

        $scope.viewTask = function(idTaskWeek) {
            dialogViewTask(idTaskWeek);
        };
    });
