angular.module("app.loggedIn.TimeSheet.ApproveLeave.Controller", [])
    .controller("ApproveLeaveController", function($scope, MODE_ROW, $modal, toastr, $state, TimeSheetService, $cookieStore) {
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

        //FUNCTION SET PAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //END SET PAGE

        //FUNCTION RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.loadList();
        };
        //END RESET

        //FUNCTION LOAD LIST
        $scope.loadList = function() {
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
        //END LOAD LIST

        //ORDER
        $scope.clickAsc = function() {
            $scope.searchObjectMap.order[0] = "ASC";
            $scope.loadList();
        };
        $scope.clickDesc = function() {
            $scope.searchObjectMap.order[0] = "DESC";
            $scope.loadList();
        };
        //END ORDER

        $scope.view = function(idView) {
            var modalInstance = $modal.open({
                templateUrl: "ViewLeaveApprove",
                controller: function($scope) {
                    $scope.idView = idView;
                    $scope.clickCancel = function(value) {
                        if (value !== undefined &&
                            value !== null &&
                            value.isReject === true) {
                            $scope.idView = value.leaveID;
                        } else {
                            modalInstance.close();
                        }
                    };
                    $scope.clickReject = function(value) {
                        if (value !== undefined &&
                            value !== null &&
                            value.isReject === false) {
                            $scope.idView = "clickReject";
                        } else if (value !== undefined &&
                            value !== null &&
                            value.isReject === true) {
                            //Reject leave
                            TimeSheetService.RejectLeave(value).then(function(response) {
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
                    $scope.clickApprove = function(value) {
                        TimeSheetService.ApproveLeave(value).then(function(response) {
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

        var init = function() {
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
            $scope.loadList();
        };

        //CALL INIT
        init();
        //END INIT
        //GET STYLE
        $scope.getStyle = function(timeLeave) {
            if (timeLeave >= 6000) {
                return {
                    "margin-right": "5px"
                };
            } else {
                return;
            }
        };
        //END

    });
