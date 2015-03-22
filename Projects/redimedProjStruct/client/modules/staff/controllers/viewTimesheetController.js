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

    $scope.delTask = function(index) {
        $scope.tasks.splice(index, 1);
    }

    $scope.addAllTask = function() {
        if (!$scope.isEdit) {
            startWeek = $filter('date')($scope.viewWeek.startWeek, 'yyyy-MM-dd');
            endWeek = $filter('date')($scope.viewWeek.endWeek, 'yyyy-MM-dd');
            StaffService.addAllTask($scope.tasks, startWeek, endWeek).then(function(response) {
                if (response['status'] == 'success') {
                    toastr.success("success", "Success");
                    $state.go('loggedIn.staff.list', null, {
                        'reload': true
                    });
                } else {
                    toastr.error("Error", "Error");
                }
            })
        } else {
            StaffService.editTask($scope.tasks).then(function(response) {
                if (response['status'] == 'success') {
                    toastr.success("Edit Success");
                    $state.go('loggedIn.staff.list', null, {
                        'reload': true
                    });
                } else {
                    toastr.error("Error", "Error");
                }
            })
        }
    }

    $scope.changeDate = function(dateWeekFrom) {

        if (dateWeekFrom === '') {
            $scope.list.result = angular.copy($scope.listTemp);
        } else {
            $scope.list.result = [];

            for (var i = 0; i < $scope.listTemp.length; i++) {
                var rs = $scope.listTemp[i];
                var sDate = $filter('date')(rs.start_date, "dd-MM-yyyy");

                if (dateWeekFrom === sDate) {
                    $scope.list.result.push(rs);
                }
            }
        }

    }

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
                idWeek: function() {
                    return item.task_week_id;
                }
            }
        })
    }
    $scope.getFortMatTimeCharge = function(time_charge) {
        if (time_charge === 0 || time_charge === null || time_charge === "" || time_charge === undefined) {
            return "00:00";
        } else {
            var hour = parseInt(time_charge);
            var minute = (time_charge - hour) * 60;
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            var result = hour + ":" + minute;
            result = result.substring(0, result.length);
            return result;
        }
    };

    StaffService.showWeek();
})

.controller("EditTimesheetController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, idWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    $scope.itemList = [];

    if (!$scope.info) {
        $scope.info = {};
    }

    $scope.cancelClick = function() {
        $modalInstance.close();
    }

    $scope.okClick = function() {
        $modalInstance.close();
        $state.go('loggedIn.timesheet.create', {
            id: idWeek
        });
    }

    $scope.calendarDay = new Date();
    $scope.info.userID = $cookieStore.get("userInfo").id;

    var startWeek, endWeek;

    $scope.task = {
        order: null,
        task: null,
        date: null,
        department_code_id: null,
        location_id: null,
        activity_id: null,
        time_charge: null,
        btnTitle: "Choose Item"
    };

    $scope.getFortMatTimeCharge = function(time_charge) {
        if (time_charge === 0) {
            return "00:00";
        } else {
            var hour = parseInt(time_charge);
            var minute = (time_charge - hour) * 60;
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            var result = hour + ":" + minute;
            result = result.substring(0, result.length);
            return result;
        }
    };

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.getTask(idWeek).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
                // $state.go('loggedIn.home', null, {'reload': true});
            } else if (response['status'] == 'success') {

                angular.forEach(response['data'], function(data) {
                    data.item = [];
                    data.time_charge = $scope.getFortMatTimeCharge(data.time_charge);
                    angular.forEach(response['item'], function(item) {
                        if (data.tasks_id == item.tasks_id) {
                            item.time_charge = $scope.getFortMatTimeCharge(item.time_charge);
                            data.item.push(item);
                        }
                    })
                })
                $scope.tasks = response['data'];
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

.controller("ViewTimesheetByHourController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, idWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    if (!$scope.info) {
        $scope.info = {};
    }

    $scope.cancelClick = function() {
        $modalInstance.close();
    }

    $scope.okClick = function() {
        $modalInstance.close();
        $state.go('loggedIn.timesheet.create', {
            id: idWeek
        });
    }

    $scope.calendarDay = new Date();
    $scope.info.userID = $cookieStore.get("userInfo").id;

    var startWeek, endWeek;

    $scope.getFortMatTimeCharge = function(time_charge) {
        if (time_charge === 0) {
            return "00:00";
        } else {
            var hour = parseInt(time_charge);
            var minute = (time_charge - hour) * 60;
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            var result = hour + ":" + minute;
            result = result.substring(0, result.length);
            return result;
        }
    };

    $scope.task = {
        date : null,
        time1: 0,
        time2: 0,
        time3: 0,
        time4: 0,
        time5: 0,
        timeTotal: 0
    };

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.showDetailDate(idWeek).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else if (response['status'] == 'success') {
                $scope.tasks = _.chain(response['data'])
                    .groupBy("date")
                    .map(function(value, key) {
                        return _.object(_.zip(["date", "rows"], [key,_.chain(value)
                            .groupBy("activity_id")
                            .map(function(value1, activity_id) {
                                return _.object(_.zip(["activity_id", "time_charge"], [activity_id, 
                                    _.reduce(value1, function(result, currentObject) {
                                    return result.time_charge + currentObject.time_charge;
                            })]));
                            })
                            .value()]
                            )) 
                    })
                    .value();

                console.log($scope.tasks);
                // angular.forEach(response['data'], function(data) {
                    
                // })
                // data.time_charge = $scope.getFortMatTimeCharge(data.time_charge);
                // $scope.tasks = response['data'];
            }
        })
        $scope.tasks.loading = false;
    }

    $scope.loadInfo();

    $scope.viewDetailDate = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/editTimesheet.html",
            controller: 'EditTimesheetController',
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