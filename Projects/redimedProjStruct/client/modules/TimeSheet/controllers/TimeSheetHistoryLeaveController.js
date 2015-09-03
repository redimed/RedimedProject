angular.module("app.loggedIn.TimeSheet.HistoryLeave.Controller", [])
    .controller("HistoryLeaveController", function($scope, TimeSheetService, $cookieStore, toastr, $state, MODE_ROW, $modal, $stateParams) {
        //reset
        $scope.Reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.LoadList();
        };

        //set page
        $scope.SetPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };

        /*
        LoadList: load list history Leave form
        input: 
        output: list Leave form
        */
        $scope.LoadList = function() {
            TimeSheetService.LoadHistoryLeave($scope.searchObjectMap).then(function(response) {
                $scope.list = response;
                $scope.count = (response.count !== undefined && response.count !== null) ? response.count : 0;
                $scope.listStatus = response.resultStatus;
            });
        };

        /*
        Init: load list history Leave form default
        input: information as: pagination, order, search,...
        output: list Leave form
        */
        var Init = function() {
            $scope.searchObject = {
                limit: 5,
                offset: 0,
                currentPage: 1,
                maxSize: 5,
                USER_ID: ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null,
                select: {
                    "hr_leave.status_id": ""
                },
                order: {
                    0: "DESC"
                }
            };
            $scope.rows = MODE_ROW;
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.list = {};
            $scope.LoadList();
        };

        Init();

        /*
        View: show details of Leave form
        input: id of leave form
        output: defails of Leave form
        */
        $scope.View = function(id) {
            var modalInstance = $modal.open({
                templateUrl: "ViewLeave",
                controller: function($scope) {
                    $scope.idView = id;
                    $scope.ClickCancel = function(value) {
                        modalInstance.close();
                    };
                    $scope.SubmitOnViewLeave = function(statusID, leaveID) {
                        var info = {
                            statusID: statusID,
                            leaveID: leaveID,
                            userID: $cookieStore.get("userInfo").id
                        };
                        /*
                        SubmitOnViewLeave: submit leave form on view detail
                        input: information leave form
                        output: - success: send message success
                                - fail: send message error
                        */
                        TimeSheetService.SubmitOnViewLeave(info).then(function(response) {
                            if (response.status === "success") {
                                modalInstance.close();
                                $state.go("loggedIn.timesheetHome.leaveHistory", null, {
                                    "reload": true
                                });
                                toastr.success("Submit success!", "Success");
                            } else if (response.status === "error") {
                                $state.go("loggedIn.home", null, {
                                    "reload": true
                                });
                                toastr.error("Submit fail!", "Error");
                            } else {
                                $state.go("loggedIn.home", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    };

                    $scope.ClickEdit = function(leaveID) {
                        modalInstance.close();
                        $state.go("loggedIn.timesheetHome.leaveCreate", {
                            id: leaveID
                        });
                    };
                },
                size: "lg"
            });
        };

        $scope.ClickAsc = function() {
            $scope.searchObjectMap.order[0] = "ASC";
            $scope.LoadList();
        };

        $scope.ClickDesc = function() {
            $scope.searchObjectMap.order[0] = "DESC";
            $scope.LoadList();
        };

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
