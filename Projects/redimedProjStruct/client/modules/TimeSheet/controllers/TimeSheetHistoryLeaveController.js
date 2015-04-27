angular.module("app.loggedIn.TimeSheet.HistoryLeave.Controller", [])
    .controller("HistoryLeaveController", function($scope, TimeSheetService, $cookieStore, toastr, $state, MODE_ROW, $modal) {
        // FUNCTION RESET
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.loadList();
        };
        // END RESET

        // FUNCTION SET PAGE
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        // END SET PAGE

        // FUNCTION LOAD LIST
        $scope.loadList = function() {
            TimeSheetService.LoadHistoryLeave($scope.searchObjectMap).then(function(response) {
                $scope.list = response;
                $scope.count = (response.count !== undefined && response.count !== null) ? response.count : 0;
                $scope.listStatus = response.resultStatus;
            });
        };
        // END LOAD LIST

        // FUNCTION INIT
        var init = function() {
            $scope.searchObject = {
                limit: 5,
                offset: 0,
                currentPage: 1,
                maxSize: 5,
                USER_ID: $cookieStore.get('userInfo').id,
                select: {
                    "hr_leave.status_id": ""
                }
            };
            $scope.rows = MODE_ROW;
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.list = {};
            $scope.loadList();
        };
        // END INIT

        // CALL INIT
        init();
        // END CALL

        //FUNCTION VIEW LEAVE
        $scope.view = function(id) {
            var modalInstance = $modal.open({
                templateUrl: "ViewLeave",
                controller: function($scope) {
                    $scope.idView = id;
                    $scope.clickCancel = function(value) {
                        modalInstance.close();
                    };
                },
                size: "lg"
            });
        };
        //END VIEW
    });
