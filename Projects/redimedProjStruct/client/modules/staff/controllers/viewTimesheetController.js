angular.module("app.loggedIn.timesheet.view.controller", [])

.controller("TimesheetViewController", function($rootScope, $scope, MODE_ROW, $filter, $cookieStore, ConfigService, $modal, calendarHelper, moment, StaffService, $state, toastr) {

    //close siderba
    $('body').addClass("page-sidebar-closed");
    $('body').find('ul').addClass("page-sidebar-menu-closed");
    //end close siderba

    //SELECT STATUS
    $scope.listStatus = [{
        code: 1,
        name: "Awaiting for Submit"
    }, {
        code: 2,
        name: "Submitted"
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
    //END SELECT STATUS

    //FUNCTION SETPAGE
    $scope.setPage = function() {
        $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
        $scope.loadList();
    };
    //END FUNCTION SETPAGE

    //FUNCTION RESET
    $scope.reset = function() {
        $scope.searchObjectMap = angular.copy($scope.searchObject);
        $scope.loadList();
    };
    //END FUNCTION RESET

    //FUNCTION LOADLIST
    $scope.loadList = function() {
        StaffService.getAllTaskAMonth($scope.searchObjectMap).then(function(response) {
            if (response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else if (response['status'] == 'no task') {
                $scope.list = response;
            } else {
                $scope.list = response;
            }
        });
    };
    //END FUNCTION LOADLIST

    //FUNCTION FORMAT TIME
    $scope.getFortMatTimeCharge = function(val) {
        return StaffService.getFortMatTimeCharge(val);
    };
    //END FUNCTION FORMAT TIME

    //FUNCTION GET WEEK
    $scope.getWeekNumber = function(d) {
        d = new Date(+d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };
    //END FUNCTION GET WEEK

    //FUNCTION INIT
    var init = function() {
        $scope.rows = MODE_ROW;
        $scope.searchObject = {
            limit: 10,
            offset: 0,
            maxSize: 5,
            currentPage: 1,
            userID: $cookieStore.get('userInfo').id,
            week_no: null,
            order: {
                "time_tasks_week.week_no": "DESC"
            },
            select: {
                "time_tasks_week.task_status_id": null
            }
        };

        //SEARCH FUNCTION
        $scope.searchObjectMap = angular.copy($scope.searchObject);
        //END SEARCH FUNCTION

        $scope.list = {};
        $scope.loadList();
        //format date
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //end format date
    };
    //END FUNCTION INIT

    //CALL INIT FUNCTION
    init();
    //END CAL INIT FUNCTION

    $scope.changeDate = function(dateValue) {
        var dateFrom = new Date(dateValue.substr(6, 4), dateValue.substr(3, 2) - 1, dateValue.substr(0, 2));
        $scope.searchObjectMap.week_no = $scope.getWeekNumber(dateFrom);
        $scope.loadList();
    };

    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    $scope.isEdit = false;

    var startWeek, endWeek;

    $scope.task = {
        order: null,
        task: null,
        date: null,
        department_code_id: null,
        location_id: null,
        activity_id: null,
        time_charge: null
    };

    $scope.calendarDay = new Date();


    $scope.orderWeek = function(type) {
        if (type == 'desc') {
            $scope.list.result = $filter('orderBy')($scope.list.result, 'week_no', true);
            $scope.isAsc = false;
        } else {
            $scope.list.result = $filter('orderBy')($scope.list.result, 'week_no', false);
            $scope.isAsc = true;
        }
    };

    $scope.chooseItem = function(task) {
        console.log(task);
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/itemModal.html",
            controller: 'ItemController',
            size: 'md'
        });
    };

    $scope.view = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/viewTimesheetByHour.html",
            controller: "ViewTimesheetByHourController",
            size: 'lg',
            resolve: {
                infoWeek: function() {
                    return item;
                }
            }
        });
    };


    StaffService.showWeek();
})

.controller("ViewDetailController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, infoWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    $scope.getDay = function(day) {
        var date = new Date(day);
        return date.getDay() === 0 ? 7 : date.getDay();
    };

    $scope.employee_name = $cookieStore.get("userInfo").Booking_Person;
    $scope.week = infoWeek;

    $scope.getFortMatTimeCharge = function(val) {
        return StaffService.getFortMatTimeCharge(val);
    };

    $scope.cancelClick = function() {
        $modalInstance.close();
    };

    $scope.okClick = function() {
        $modalInstance.close();
        $state.go('loggedIn.timesheet.create', {
            id: infoWeek.task_week_id
        });
    };

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.getTask(infoWeek.task_week_id).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
                // $state.go('loggedIn.home', null, {'reload': true});
            } else if (response['status'] == 'success') {
                if (infoWeek.date != 'full') {
                    $scope.one = true;
                    $scope.tasks = _.filter(response['data'], function(data) {
                        return data.date == infoWeek.date;
                    });
                } else {
                    $scope.one = false;
                    $scope.tasks = response['data'];
                }
            }
        });
        $scope.tasks.loading = false;
    };

    $scope.loadInfo();

    $scope.chooseItem = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/itemModal.html",
            controller: 'ItemController',
            size: 'lg',
            resolve: {
                itemArr: function() {
                    var arr = [];
                    arr = item;
                    return arr.length > 0 ? arr : null;
                },
                isView: function() {
                    return true;
                }
            }
        });
    };
})

.controller("ViewTimesheetByHourController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, infoWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    if (!$scope.info) {
        $scope.info = {};
    }

    $scope.getFortMatTimeCharge = function(val) {
        return StaffService.getFortMatTimeCharge(val);
    };

    $scope.cancelClick = function() {
        $modalInstance.close();
    };

    $scope.employee_name = $cookieStore.get("userInfo").Booking_Person;
    $scope.week = infoWeek;

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.showDetailDate(infoWeek.task_week_id).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else if (response['status'] == 'success') {
                $scope.tasks = _.chain(response['data'])
                    .groupBy("date")
                    .map(function(value, key) {
                        return _.object(_.zip(["date", "rows"], [key, _.chain(value)
                            .groupBy("activity_id")
                            .map(function(value1, activity_id) {
                                var time_charge = _.reduce(value1, function(result, currentObject) {
                                    return result.time_charge + currentObject.time_charge;
                                });
                                if (typeof time_charge == 'object') {
                                    time_charge = time_charge.time_charge;
                                }
                                return _.object(_.zip(["activity_id", "time_charge"], [activity_id, time_charge]));
                            })
                            .value()
                        ]));
                    })
                    .value();
                var sum = 0;
                angular.forEach($scope.tasks, function(data) {
                    data.arrActivity = ['00:00', '00:00', '00:00', '00:00', '00:00'];
                    sum = 0;
                    angular.forEach(data.rows, function(row) {
                        sum = sum + row.time_charge;
                        row.time_charge = StaffService.getFortMatTimeCharge(row.time_charge);
                        data.arrActivity[row.activity_id - 1] = row.time_charge;
                    });
                    data.total = StaffService.getFortMatTimeCharge(sum);
                });
            }
        });
        $scope.tasks.loading = false;
    };

    $scope.loadInfo();

    $scope.viewDetailDate = function(infoWeek, date) {
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/viewDetail.html",
            controller: 'ViewDetailController',
            size: 'lg',
            resolve: {
                infoWeek: function() {
                    infoWeek.date = date;
                    return infoWeek;
                }
            }
        });
    };
});
