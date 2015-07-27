angular.module("app.loggedIn.timesheet.view.controller", [])

.controller("TimesheetViewController", function($rootScope, $scope, MODE_ROW, $filter, $cookieStore, ConfigService, $modal, calendarHelper, moment, StaffService, $state, toastr) {
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
        $scope.dateWeekFrom = null;

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
            userID: ($cookieStore.get('userInfo')!==undefined) ? $cookieStore.get('userInfo').id : null,
            week_no: null,
            order: {
                0: "DESC"
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
        $scope.searchObjectMap.dateFrom = dateFrom;
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
        var modalInstance = $modal.open({
            templateUrl: "modules/TimeSheet/views/itemModal.html",
            controller: 'ItemController',
            size: 'md'
        });
    };

    $scope.view = function(item) {
        var modalInstance = $modal.open({
            templateUrl: "modules/TimeSheet/views/viewTimesheetByHour.html",
            controller: "ViewTimesheetByHourController",
            size: 'lg',
            resolve: {
                infoWeek: function() {
                    return item;
                }
            }
        });
    };

    $scope.clickAsc = function() {
        $scope.searchObjectMap.order[0] = "ASC";
        $scope.loadList();
    };

    $scope.clickDesc = function() {
        $scope.searchObjectMap.order[0] = "DESC";
        $scope.loadList();
    };

    //CHECK MOTH AND WEEK
    StaffService.showWeek(); //    VIEW NOT DISABLE
    //END
})

.controller("ViewDetailController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, infoWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    //FUNCTION GET WEEK NUMBER
    $scope.getWeekNumber = function(d) {
        d = new Date(+d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };
    //FUNCTION GET WEEK NUMBER

    // GET TIME IN LIEU TO CHECK SUBMIT
    var info = {
        date: new Date(),
        userId: ($cookieStore.get('userInfo')!==undefined) ? $cookieStore.get('userInfo').id : null
    };
    StaffService.checkTimeInLieu(info).then(function(response) {
        if (response.status === "error") {
            toastr.error("Check Time in Lieu fail!", "Fail");
        } else if (response.status === "success") {
            var timeInLieu = 0;
            angular.forEach(response.result, function(data, index) {
                timeInLieu += data.time_in_lieu;
            });
            $scope.time_in_lieuHas = timeInLieu;

        } else {
            $state.go("loggedIn.home", null, {
                "reload": true
            });
            toastr.error("Server not response!", "Error");
        }
    });
    //END

    $scope.getDay = function(day) {
        var date = new Date(day);
        return date.getDay() === 0 ? 7 : date.getDay();
    };

    $scope.week = infoWeek;

    $scope.getFortMatTimeCharge = function(val) {
        return StaffService.getFortMatTimeCharge(val);
    };

    $scope.cancelClick = function() {
        $modalInstance.close();
    };

    $scope.okClick = function() {
        $modalInstance.close();
        $state.go('loggedIn.timesheetHome.timesheetCreate', {
            id: infoWeek.task_week_id
        });
    };
    //summit on date
    $scope.submitClick = function(value) {
        if ($scope.week.time_charge < (38 * 60)) {
            toastr.warning("Please check time charge(>=38)", "Error");
        } else if ($scope.time_in_lieuChoose > $scope.time_in_lieuHas) {
            toastr.warning("Please check time in lieu use larger time in lieu you have!", "Fail");
        } else {
            value.status = 0;
            if (value.STATUS == 'Awaiting for Submit') {
                value.status = 2;
            } else if (value.STATUS == 'Rejected') {
                value.status = 5;
            }
            StaffService.SubmitOnView(value).then(function(response) {
                if (response.status === 'error') {
                    toastr.error("Submit fail!", "Error");
                    $modalInstance.close();
                } else if (response.status === 'success') {
                    $modalInstance.close();
                    $state.go("loggedIn.timesheetHome.timesheetHistory", null, {
                        "reload": true
                    });
                    toastr.success("Submit success", "Success");
                }

            });
        }
    };
    //end

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.getTask(infoWeek.task_week_id).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else if (response['status'] == 'success') {
                var result = response.data;
                //get status and employee name
                if (result !== undefined &&
                    result[0] !== undefined) {
                    $scope.ID_WEEK = result[0].tasks_week_id;
                    $scope.STATUS = result[0].STATUS;
                    $scope.USER_ID = ($cookieStore.get('userInfo')!==undefined) ? $cookieStore.get('userInfo').id : null;
                    $scope.after_status_id = result[0].after_status_id;
                    $scope.time_in_lieuChoose = result[0].time_in_lieuChoose;
                    //TRACKER
                    $scope.submitOnView = {};
                    $scope.submitOnView.STATUS = $scope.STATUS;
                    $scope.submitOnView.ID_WEEK = $scope.ID_WEEK;
                    $scope.submitOnView.USER_ID = $scope.USER_ID;
                    //END
                    $scope.employee_name = (result[0].FirstName === null || result[0].FirstName === "") ? ((result[0].LastName === null || result[0].LastName === "") ? " " : result[0].LastName) : (result[0].FirstName + " " + ((result[0].LastName === null || result[0].LastName === "") ? " " : result[0].LastName));
                }
                //end get
                if (infoWeek.date != 'full') {
                    $scope.one = true;
                    $scope.Title = "Timesheet Detail"; //seet title TimeSheet Detail
                    $scope.tasks = _.filter(response['data'], function(data) {
                        return data.date == infoWeek.date;
                    });
                    //PUSH FILE
                    angular.forEach($scope.tasks, function(valueTask, indexTask) {
                        $scope.tasks[indexTask].files = [];
                        angular.forEach(response['file'], function(valueFile, indexFile) {
                            if (valueTask.tasks_id === valueFile.tasks_id &&
                                valueTask.ITEM_ID === valueFile.ITEM_ID) {
                                $scope.tasks[indexTask].files.push({
                                    file_id: valueFile.file_id,
                                    file_name: valueFile.file_name
                                });
                            }
                        });
                    });
                    //END PUSH
                } else {
                    $scope.Title = "Full Timesheet"; //set title Full Timesheet
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
            templateUrl: "modules/TimeSheet/views/itemModal.html",
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
    //FUNCTION GET WEEK NUMBER
    $scope.getWeekNumber = function(d) {
        d = new Date(+d);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };
    //FUNCTION GET WEEK NUMBER
    // GET TIME IN LIEU TO CHECK SUBMIT
    var info = {
        date: new Date(),
        userId: ($cookieStore.get('userInfo')!==undefined) ? $cookieStore.get('userInfo').id : null
    };
    StaffService.checkTimeInLieu(info).then(function(response) {
        if (response.status === "error") {
            toastr.error("Check Time in Lieu fail!", "Fail");
        } else if (response.status === "success") {
            var timeInLieu = 0;
            angular.forEach(response.result, function(data, index) {
                timeInLieu += data.time_in_lieu;
            });
            $scope.time_in_lieuHas = timeInLieu;

        } else {
            $state.go("loggedIn.home", null, {
                "reload": true
            });
            toastr.error("Server not response!", "Error");
        }
    });
    //END

    $scope.getFortMatTimeCharge = function(val) {
        return StaffService.getFortMatTimeCharge(val);
    };

    $scope.cancelClick = function() {
        $modalInstance.close();
    };
    $scope.submitClick = function(value) {
        if ($scope.week.time_charge < (38 * 60)) {
            toastr.warning("Please check time charge(>=38)", "Error");
        } else if ($scope.time_in_lieuChoose > $scope.time_in_lieuHas) {
            toastr.warning("Please check time in lieu use larger time in lieu you have!", "Fail");
        } else {
            value.status = 0;
            if (value.STATUS == 'Awaiting for Submit') {
                value.status = 2;
            } else if (value.STATUS == 'Rejected') {
                value.status = 5;
            }
            StaffService.SubmitOnView(value).then(function(response) {
                if (response.status === 'error') {
                    toastr.error("Submit fail!", "Error");
                    $modalInstance.close();
                } else if (response.status === 'success') {
                    $modalInstance.close();
                    $state.go("loggedIn.timesheetHome.timesheetHistory", null, {
                        "reload": true
                    });
                    toastr.success("Submit success", "Success");
                }

            });
        }
    };
    $scope.okClick = function() {
        $modalInstance.close();
        $state.go('loggedIn.timesheetHome.timesheetCreate', {
            id: infoWeek.task_week_id
        });
    };
    $scope.week = infoWeek;

    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.showDetailDate(infoWeek.task_week_id).then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else if (response['status'] == 'success') {

                //SET SOME VALUE CHECK STATUS AND BUTTON
                var result = response.data;
                if (result !== undefined && result[0] !== undefined) {
                    $scope.STATUS = result[0].status;
                    $scope.ID_WEEK = result[0].tasks_week_id;
                    $scope.time_in_lieuChoose = result[0].time_in_lieuChoose;
                    $scope.USER_ID = ($cookieStore.get('userInfo')!==undefined) ? $cookieStore.get('userInfo').id : null;
                    //TRACKER
                    $scope.submitOnView = {};
                    $scope.submitOnView.STATUS = $scope.STATUS;
                    $scope.submitOnView.ID_WEEK = $scope.ID_WEEK;
                    $scope.submitOnView.USER_ID = $scope.USER_ID;
                    //END
                    $scope.afterStatusID = result[0].after_status_id;
                    $scope.employee_name = (result[0].FirstName === null || result[0].FirstName === "") ? ((result[0].LastName === null || result[0].LastName === "") ? " " : result[0].LastName) : (result[0].FirstName + " " + ((result[0].LastName === null || result[0].LastName === "") ? " " : result[0].LastName));
                }
                // END
                var arrayDate = [];
                var arrayActivity = [];
                //PUSH DATE
                angular.forEach(response['data'], function(valueData, indexData) {
                    var isFoundDate = false;
                    angular.forEach(arrayDate, function(valueDate, indexDate) {
                        if (valueData.date === valueDate.date) {
                            isFoundDate = true;
                        }
                    });
                    if (isFoundDate === false) {
                        arrayDate.push({
                            date: valueData.date
                        });
                    }
                });
                //END
                angular.forEach(arrayDate, function(valueDate, indexDate) {
                    var timeChargeDate = 0;
                    var timeChargeActivity = 0;
                    arrayDate[indexDate].timeActivity = [{
                        time_charge: 0
                    }, {
                        time_charge: 0
                    }, {
                        time_charge: 0
                    }, {
                        time_charge: 0
                    }, {
                        time_charge: 0
                    }];
                    angular.forEach(response['data'], function(valueData, indexData) {
                        var time_charge = (valueData.time_charge !== undefined && valueData.time_charge !== null) ? valueData.time_charge : 0;
                        if (valueData.date === valueDate.date) {
                            timeChargeDate += time_charge;
                            arrayDate[indexDate].timeActivity[valueData.activity_id - 1].time_charge += time_charge;
                        }
                    });
                    arrayDate[indexDate].time_charge_date = timeChargeDate;
                });

                $scope.tasks = angular.copy(arrayDate);
            }
        });
        $scope.tasks.loading = false;
    };

    $scope.loadInfo();

    $scope.viewDetailDate = function(infoWeek, date) {
        var modalInstance = $modal.open({
            templateUrl: "modules/TimeSheet/views/viewDetail.html",
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
