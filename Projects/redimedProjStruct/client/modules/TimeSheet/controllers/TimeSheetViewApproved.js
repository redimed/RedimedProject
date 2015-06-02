angular.module("app.loggedIn.TimeSheet.ViewApproved.Controller", [])
    .controller("ViewApprovedTimeSheet", function($scope, $modal, $timeout, MODE_ROW, MODE_WEEK, toastr, $state, TimeSheetService, $cookieStore, ConfigService) {
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba
        
        //setPage
        $scope.setPage = function() {
            $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
            $scope.loadList();
        };
        //end setPage

        //reset
        $scope.reset = function() {
            $scope.searchObjectMap = angular.copy($scope.searchObject);
            $scope.loadList();
        };
        //end reset 

        $scope.loadList = function() {
            //load list task
            TimeSheetService.LoadTaskApproved($scope.searchObjectMap).then(function(response) {
                if (response.status === "success") {
                    $scope.list = response;
                } else if (response.status === "error") {
                    $scope.list = response;
                    toastr.error("Loading fail!", "Error");
                    $state.go("loggedIn.ViewApprovedTimeSheet", null, {
                        "reload": true
                    });
                } else {
                    //catch exception
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server not response!", "Error");
                }
            });
        };

        var init = function() {
            $scope.searchObject = {
                offset: 0,
                limit: 10,
                currentPage: 1,
                maxSize: 5,
                USER_ID: $cookieStore.get("userInfo").id,
                order: {
                    "time_tasks_week.approved_date": null,
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
            $scope.weekNo = MODE_WEEK;
            $scope.currentWeek = ConfigService.getWeekOfYear(new Date()); //function defined in configService
            $scope.loadList();
        };
        //call init
        init();
        //end call init

        //SOME FUNCTION ORDER BY
        $scope.weekNoASC = function() {
            $scope.searchObjectMap.order['time_tasks_week.approved_date'] = null;
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = "ASC";
            $scope.loadList();
        };
        $scope.weekNoDESC = function() {
            $scope.searchObjectMap.order['time_tasks_week.approved_date'] = null;
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = "DESC";
            $scope.loadList();
        };
        $scope.dateApprovedASC = function() {
            $scope.searchObjectMap.order['time_tasks_week.approved_date'] = "ASC";
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = null;
            $scope.loadList();
        };
        $scope.dateApprovedDESC = function() {
            $scope.searchObjectMap.order['time_tasks_week.approved_date'] = "DESC";
            $scope.searchObjectMap.order['time_tasks_week.week_no'] = null;
            $scope.loadList();
        };
        //END SOME FUNCTION ORDER BY

        //FUNCTION DIALOG
        var dialogView = function(idView) {
            var modalInstance = $modal.open({
                templateUrl: "ViewDetailTask",
                controller: function($scope) {
                    $scope.clickCancel = function() {
                        modalInstance.close();
                    };
                    $scope.idTaskWeek = idView;
                },
                size: "lg"
            });
        };
        //END FUNCTION DIALOG

        $scope.showDetail = function(idTaskWeek) {
            dialogView(idTaskWeek);
        };
    });
