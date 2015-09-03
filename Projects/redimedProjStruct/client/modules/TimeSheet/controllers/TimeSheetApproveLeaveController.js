angular.module("app.loggedIn.TimeSheet.ApproveLeave.Controller", [])
    .controller("ApproveLeaveController", function($scope, MODE_ROW, $modal, toastr, $state, TimeSheetService, $cookieStore) {
        //status
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

        //set page
        $scope.SetPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.LoadList();
        };

        //reset
        $scope.Reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.LoadList();
        };

        /*
        LoadList: load list Leave form to approve
        input: information search, order, pagination,...
        output: list Leave form
        */
        $scope.LoadList = function() {
            TimeSheetService.LoadLeaveApprove($scope.searchObjectMap).then(function(response) {
                if (response.status === "success") {
                    $scope.list = response;
                    $scope.count = response.count;
                } else if (response.status === "error") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Loading leave fail!", "Error");
                } else {
                    //catch exception
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };

        //order
        $scope.ClickAsc = function() {
            $scope.searchObjectMap.order[0] = "ASC";
            $scope.LoadList();
        };
        $scope.ClickDesc = function() {
            $scope.searchObjectMap.order[0] = "DESC";
            $scope.LoadList();
        };

        $scope.View = function(idView) {
            var modalInstance = $modal.open({
                templateUrl: "ViewLeaveApprove",
                controller: function($scope) {
                    $scope.idView = idView;
                    $scope.ClickCancel = function(value) {
                        if (value !== undefined &&
                            value !== null &&
                            value.isReject === true) {
                            $scope.idView = value.leaveID;
                        } else {
                            modalInstance.close();
                        }
                    };

                    /*
                    clickReject: reject a leave form
                    input: information of Timesheet
                    output: - success: send message success
                            - fail: send message error
                    */
                    $scope.ClickReject = function(info) {
                        if (info !== undefined &&
                            info !== null &&
                            info.isReject === false) {
                            $scope.idView = "clickReject";
                        } else if (info !== undefined &&
                            info !== null &&
                            info.isReject === true) {
                            TimeSheetService.RejectLeave(info).then(function(response) {
                                if (response.status === "success") {
                                    modalInstance.close();
                                    $state.go("loggedIn.timesheetHome.leaveApprove", null, {
                                        "reload": true
                                    });
                                    toastr.success("Reject leave success!", "Success");
                                } else if (response.status === "error") {
                                    modalInstance.close();
                                    $state.go("loggedIn.timesheetHome.leaveApprove", null, {
                                        "reload": true
                                    });
                                    toastr.error("Reject leave fail!", "Error");
                                } else {
                                    //catch exception
                                    modalInstance.close();
                                    $state.go("loggedIn.timesheetHome.leaveApprove", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not response!", "Error");
                                }
                            });
                        }
                    };

                    /*
                    ClickApprove: approve a leave form
                    input: information of Timsheet
                    output: - success: send message success
                            - fail: send message error
                    */
                    $scope.ClickApprove = function(info) {
                        TimeSheetService.ApproveLeave(info).then(function(response) {
                            if (response.status === "success") {
                                modalInstance.close();
                                $state.go("loggedIn.timesheetHome.leaveApprove", null, {
                                    "reload": true
                                });
                                toastr.success("Approve leave success!", "Success");
                            } else if (response.status === "error") {
                                modalInstance.close();
                                $state.go("loggedIn.timesheetHome.leaveApprove", null, {
                                    "reload": true
                                });
                                toastr.error("Approve leave fail!", "Error");
                            } else {
                                //catch exception
                                modalInstance.close();
                                $state.go("loggedIn.timesheetHome.leaveApprove", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    };
                },
                size: "lg"
            });
        };

        /*
        init: load value default for list Leave form
        input: 
        output: list:  list Leave form
        */
        var Init = function() {
            $scope.searchObject = {
                limit: 5,
                offset: 0,
                currentPage: 1,
                maxSize: 5,
                USER_ID: ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null,
                search: {
                    0: null
                },
                order: {
                    0: 'DESC'
                },
                select: {
                    0: null
                }
            };
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.list = {};
            $scope.rows = MODE_ROW;
            $scope.LoadList();
        };

        Init();

        //GetStyle
        $scope.GetStyle = function(timeLeave) {
            if (timeLeave >= 6000) {
                return {
                    "margin-right": "5px"
                };
            } else {
                return;
            }
        };
    });
