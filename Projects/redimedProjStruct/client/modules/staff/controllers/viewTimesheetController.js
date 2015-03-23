angular.module("app.loggedIn.timesheet.view.controller", [])

.controller("TimesheetViewController", function($rootScope, $scope, MODE_ROW, $filter, $cookieStore, ConfigService, $modal, calendarHelper, moment, StaffService, $state, toastr) {

    //close siderba
    $('body').addClass("page-sidebar-closed");
    $('body').find('ul').addClass("page-sidebar-menu-closed");
    //end close siderba

    //FUNCTION SETPAGE
    $scope.setPage = function() {
        $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
        $scope.loadList();
    };
    //END FUNCTION SETPAGE

    //FUNCTION RESET
    $scope.reset = function() {
        $scope.searchObjectMap = angular.copy($scope.searchDepartmentsObject);
        $scope.loadList();
    };
    //END FUNCTION RESET

    $scope.loadList = function() {
        $scope.searchObjectMap.userID = $cookieStore.get("userInfo").id;
        StaffService.getAllTaskAMonth($scope.searchObjectMap).then(function(response) {
            if (response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else if (response['status'] == 'no task') {
                $scope.list.result = [];
            } else {
                $scope.list.result = response;
                $scope.list.count = response.length;
                $scope.listTemp = angular.copy($scope.list.result);
            }
        });
    };

    //FUNCTION INIT
    var init = function() {
        $scope.searchObject = {
            limit: 10,
            offset: 0,
            maxSize: 5,
            currentPage: 1,
            data: {
                NAME: "",
                Email: "",
                phone: null
            }
        };
        $scope.rows = MODE_ROW;
        $scope.searchDepartmentsObject = {
            limit: 10,
            offset: 0,
            maxSize: 5,
            currentPage: 1,
            order: "DESC",
            GROUP_TYPE: "Time Sheet",
            data: {
                GROUP_NAME: ""
            }
        };

        //SEARCH FUNCTION
        $scope.searchObjectMap = angular.copy($scope.searchDepartmentsObject);
        //END SEARCH FUNCTION

        $scope.list = {};
        $scope.loadList();
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
    };
    //END FUNCTION INIT

    //CALL INIT FUNCTION
    init();
    //END CAL INIT FUNCTION

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
    }

    $scope.chooseItem = function(task) {
        console.log(task);
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/itemModal.html",
            controller: 'ItemController',
            size: 'md'
        })
    }

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
        })
    }
    

    StaffService.showWeek();
})

.controller("ViewDetailController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr,infoWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    $scope.getDay = function(day){
        var date = new Date(day);
       return date.getDay() == 0 ? 7 : date.getDay();
    }

    $scope.employee_name = $cookieStore.get("userInfo").Booking_Person;
    $scope.week = infoWeek;

    $scope.cancelClick = function() {
        $modalInstance.close();
    }

    $scope.okClick = function() {
        $modalInstance.close();
        $state.go('loggedIn.timesheet.create', {
            id: infoWeek.task_week_id
        });
    }

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.getTask(infoWeek.task_week_id).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
                // $state.go('loggedIn.home', null, {'reload': true});
            } else if (response['status'] == 'success') {
                if(infoWeek.date != 'full'){
                    $scope.one = true;
                    $scope.tasks = _.filter(response['data'], function(data) {
                    return data.date == infoWeek.date;
                    });
                }else{
                    $scope.one = false;
                    $scope.tasks = response['data'];
                }
            }
        })
        $scope.tasks.loading = false;
    }

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
    }
})

.controller("ViewTimesheetByHourController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, infoWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    if (!$scope.info) {
        $scope.info = {};
    }

    $scope.cancelClick = function() {
        $modalInstance.close();
    }

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
                        return _.object(_.zip(["date", "rows"], [key,_.chain(value)
                            .groupBy("activity_id")
                            .map(function(value1, activity_id) {
                                var time_charge = _.reduce(value1, function(result, currentObject) {
                                    return result.time_charge + currentObject.time_charge;})
                                if(typeof time_charge ==  'object'){
                                    time_charge = time_charge.time_charge;
                                }
                                return _.object(_.zip(["activity_id", "time_charge"], [activity_id, time_charge]));
                            })
                            .value()]
                            )) 
                    })
                    .value();
                var sum = 0;
                angular.forEach($scope.tasks, function(data) {
                    data.arrActivity = ['00:00','00:00','00:00','00:00','00:00'];
                    sum = 0;
                    angular.forEach(data.rows, function(row) {
                        sum = sum + row.time_charge;
                        row.time_charge = $StaffService.getFortMatTimeCharge(row.time_charge);
                        data.arrActivity[row.activity_id - 1] = row.time_charge;
                    })
                    data.total = $scope.getFortMatTimeCharge(sum);
                })
            }
        })
        $scope.tasks.loading = false;
    }

    $scope.loadInfo();

    $scope.viewDetailDate = function(infoWeek,date) {
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
    }
})