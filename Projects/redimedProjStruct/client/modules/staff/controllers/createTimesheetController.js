angular.module("app.loggedIn.timesheet.create.controller", [])

.controller("TimesheetCreateController", function($rootScope, ConfigService, $scope, $stateParams, $cookieStore, $filter, $modal, calendarHelper, moment, StaffService, $state, toastr) {
    //CLOSE MEMU
    $('body').addClass("page-sidebar-closed");
    $('ul').addClass("page-sidebar-menu-closed");
    //END CLOSE

    // DATE
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    //END DATE

    // SET DEFAULT VALUE
    $scope.info = {};
    $scope.info.time_temp = 0;
    $scope.info.time_charge = 0;
    //END

    // CHECK ITEM 
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    if (!$scope.info) {
        $scope.info = {};
    }

    $scope.itemList = [];

    $scope.calendarDay = new Date();
    $scope.info.userID = $cookieStore.get("userInfo").id;

    var startWeek, endWeek, sum = 0;

    $scope.task = {
        order: null,
        task: null,
        date: null,
        department_code_id: null,
        location_id: null,
        activity_id: null,
        time_charge: null,
        time_temp: 0,
        isInputItem: false,
        isBillable: false,
        item: []

    };
    //END CHECK ITEM

    //CHECK TIME IN LIEU
    $scope.checkTimeInLieu = function() {
        var toDate = new Date();
        var weekNo = $scope.getWeekNumber(toDate);
        StaffService.checkTimeInLieu(weekNo, $cookieStore.get('userInfo').id).then(function(response) {
            if (response.status === "error") {
                toastr.error("Check Time in Lieu fail!", "Fail");
            } else if (response.status === "success") {
                var timeInLieu = 0;
                angular.forEach(response.result, function(data, index) {
                    timeInLieu += data.time_in_lieu;
                });
                //conver to hours-minute
                var hours = parseInt(timeInLieu / 60);
                var minutes = timeInLieu % 60;
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                //end convert
                toastr.info("You have " + hours + " hours " + minutes + " minutes for Time in Lieu!", "Notification");
            } else {
                $state.go("loggedIn.TimeSheetHome", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
    };
    //END CHECK

    //FUNCTION SUM TOTAL TIME CHARGE
    $scope.changeTimeCharge = function() {
        var sum = 0;
        var sumInLieu = 0;
        angular.forEach($scope.tasks, function(data, index) {
            $scope.tasks[index].time_temp = StaffService.convertShowToFull(data.time_charge);
            if (data.time_charge !== null &&
                data.time_charge !== undefined &&
                data.isAction !== "delete" &&
                data.activity_id !== null &&
                data.time_charge !== "" &&
                data.time_charge.length !== 0) {
                //SUM TIME CHARGE
                sum = sum + parseInt(StaffService.convertShowToFull(data.time_charge));
                //END
                if (data.activity_id === 22) {
                    //SUM IN LIEU
                    sumInLieu = sumInLieu + parseInt(StaffService.convertShowToFull(data.time_charge));
                    //END  
                }
            }
        });

        $scope.info.time_in_lieuFull = sumInLieu;
        $scope.info.time_temp = sum;
        $scope.info.time_charge = StaffService.convertFromFullToShow(sum);
    };
    //END FUNCTION TOTAL TIME CHARGE

    //CHANGE ACTIVITY
    $scope.ChangeActivity = function(activity_id, index) {
        if (activity_id === null || activity_id === undefined || activity_id === "" || activity_id === 18) {
            $scope.tasks[index].time_charge = null;
            $scope.tasks[index].time_temp = null;
        }

        //SET TIME CHARGE-INLIEU
        $scope.changeTimeCharge();
        //END
    };
    //END CHANGE

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

    //GET TIM IN LIEU
    // GET TIME IN LIEU TO CHECK SUBMIT
    var toDate = new Date();
    var weekNo = $scope.getWeekNumber(toDate);
    StaffService.checkTimeInLieu(weekNo, $cookieStore.get('userInfo').id).then(function(response) {
        if (response.status === "error") {
            toastr.error("Check Time in Lieu fail!", "Fail");
        } else if (response.status === "success") {
            var timeInLieu = 0;
            angular.forEach(response.result, function(data, index) {
                timeInLieu += StaffService.fortMatFullTime(data.time_in_lieu);
            });
            $scope.info.time_in_lieuHas = timeInLieu;

        } else {
            $state.go("loggedIn.TimeSheetHome", null, {
                "reload": true
            });
            toastr.error("Server not response!", "Error");
        }
    });
    //END
    //END

    //FUNCTION CHECK TASK WEEK
    $scope.checkTaskWeek = function(date) {
        $scope.tasks = [];
        startWeek = $filter('date')(date, 'yyyy-MM-dd');
        $scope.info.startWeek = startWeek;
        StaffService.checkTaskWeek($scope.info).then(function(response) {
            if (response['status'] === 'fail' || response['status'] === 'error') {
                toastr.error("Error", "Error");
            } else {
                if (response['data'] !== 'no') {
                    angular.forEach(response['data'], function(data) {
                        data.isEdit = true;
                        $scope.tasks.push(data);
                    });
                } else {
                    $scope.viewWeek = calendarHelper.getWeekView(date, true);
                    angular.forEach($scope.viewWeek.columns, function(data) {
                        $scope.task = {
                            order: 1,
                            task: null,
                            date: data.dateChosen,
                            department_code_id: null,
                            location_id: null,
                            activity_id: null,
                            time_charge: null,
                            isInputItem: false,
                            isBillable: false,
                            isParent: 1,
                            item: []
                        };
                        $scope.tasks.push($scope.task);
                    });
                }
            }
        });
    };
    //END FUNCTION CHECK TASK WEEK

    //FUNCTION CHECK TASK WEEK
    $scope.checkFirstTaskWeek = function() {
        $scope.tasks = [];
        StaffService.checkFirstTaskWeek($scope.info).then(function(response) {
            if (response['status'] === 'error') {
                toastr.error("Error", "Error");
            } else {
                $scope.isEdit = false;
                if (response['status'] === 'success') {
                    $scope.nextDay = moment(response['maxDate']).add(7, 'day').toDate();
                } else if (response['status'] === 'no maxDate') {

                    $scope.nextDay = moment($scope.calendarDay).add(7, 'day').toDate();
                }
                $scope.viewWeek = calendarHelper.getWeekView($scope.nextDay, true);
                angular.forEach($scope.viewWeek.columns, function(data, index) {
                    $scope.task = {
                        order: index + 1,
                        task: null,
                        date: data.dateChosen,
                        department_code_id: null,
                        location_id: null,
                        activity_id: null,
                        time_charge: null,
                        isInputItem: false,
                        isBillable: false,
                        isParent: 1,
                        item: []
                    };
                    $scope.tasks.push($scope.task);
                });

            }
            //SHOW WEEK WHEN CREATE
            if ($scope.tasks !== undefined &&
                $scope.tasks !== null &&
                $scope.tasks.length !== 0 &&
                $scope.tasks[0] !== undefined) {
                $scope.dateWeekFrom = $filter('date')($scope.tasks[0].date, "dd-MM-yyyy");
            }
            //END SHOW
        });
    };
    // END FUNCTION CHECK TASK WEEK

    //FUNCTION LOAD INFO
    $scope.loadInfo = function() {
        $scope.tasks.loading = true;
        StaffService.getDepartmentLocation().then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else {
                $scope.departments = response['department'];
                $scope.locations = response['location'];
                $scope.activities = response['activity'];
                if ($stateParams.id) {
                    //EDIT TIMESHEET
                    $scope.isEdit = true;
                    $scope.idWeek = $stateParams.id;
                    StaffService.showEdit($scope.idWeek).then(function(response) {
                        if (response['data'] !== undefined &&
                            response['data'][0] !== undefined &&
                            response['data'][0].date !== undefined) {
                            // SHOW START DATE ON EDIT
                            $scope.dateStart = response['data'][0].date;
                            //END
                        }
                        if (response['status'] == 'fail' || response['status'] == 'error') {
                            angular.forEach(response['data'], function(data) {
                                data.item = [];
                                data.isEdit = true;
                                data.time_temp = data.time_charge;
                                data.isAction = 'update';
                                if (data.time_charge !== null) {
                                    data.time_charge = StaffService.convertFromFullToShow(data.time_charge);
                                }
                                $scope.tasks.push(data);
                                $scope.changeTimeCharge();
                            });
                        } else if (response['status'] === 'success') {
                            angular.forEach(response['data'], function(data) {
                                data.item = [];
                                data.isEdit = true;
                                data.time_temp = data.time_charge;
                                data.isAction = 'update';
                                if (data.time_charge !== null) {
                                    data.time_charge = StaffService.convertFromFullToShow(data.time_charge);
                                }
                                angular.forEach(response['item'], function(item) {
                                    //check status
                                    if (response['item'] !== undefined && response['item'][0] && response['item'][0].task_status_id !== undefined) {
                                        $scope.checkStatus = response['item'][0].task_status_id;
                                        $scope.afterStatusID = response['item'][0].after_status_id;
                                    }
                                    //end
                                    if (data.tasks_id === item.tasks_id &&
                                        item.ITEM_ID !== null &&
                                        item.deleted === 0) {

                                        data.isInputItem = 1;
                                        data.isBillable = 1;
                                        item.isAction = 'update';
                                        item.time_temp = item.time_charge;
                                        item.deleted = item.deleted;
                                        item.time_charge = StaffService.convertFromFullToShow(item.time_charge);
                                        data.item.push(item);
                                    }
                                });

                                //PUSH DATA AND REFRESH
                                $scope.tasks.push(data);
                                $scope.changeTimeCharge();
                                //END PUSH AND REFRESH

                            });
                        }
                    });
                } else {
                    //ADD TIMESHEET
                    $scope.isEdit = false;
                    $scope.checkFirstTaskWeek();
                }
            }
            //CHECK TYPE OF CONTRACT
            StaffService.LoadContract($cookieStore.get('userInfo').id).then(function(conTract) {
                if (conTract.status === "success" && conTract.result[0] !== undefined && conTract.result[0].TypeOfContruct !== undefined) {
                    $scope.TypeOfContruct = conTract.result[0].TypeOfContruct;
                } else {
                    toastr.error("User not type of contruct!, Please notification Admin", "Error");
                }
            });
            //END
        });
        $scope.tasks.loading = false;
    };
    //END FUNCTION LOAD INFO

    //CALL LOAD INFO
    $scope.loadInfo();
    //END CALL

    //FUNCTION ADD NEW ROW
    $scope.addRow = function(index, date) {
        var j = 0;
        for (var i = index; i < $scope.tasks.length; i++) {
            if ($scope.tasks[i].date == date) {
                j++;
            }
        }
        task = {
            order: 1 + j,
            task: null,
            date: date,
            department_code_id: null,
            location_id: null,
            activity_id: null,
            time_charge: null,
            isEdit: false,
            isInputItem: false,
            isBillable: false,
            isAction: 'insert',
            item: []
        };
        $scope.tasks.splice(index + j, 0, task);
        //UP ORDER 1
        angular.forEach($scope.tasks, function(data, index) {
            $scope.tasks[index].order = index + 1;
        });
        //END
    };
    //END CHECK NEW ROW

    //GET DATE FROM
    var dateFrom;
    $scope.changeDate = function() {
        dateFrom = new Date($scope.dateWeekFrom.substr(6, 4), $scope.dateWeekFrom.substr(3, 2) - 1, $scope.dateWeekFrom.substr(0, 2));
        $scope.checkTaskWeek(dateFrom);
    };
    //END FROM

    //DEL TASK
    $scope.delTask = function(index, order) {
        if (order != 1) {
            swal({
                title: "Are you sure delete this row?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                if ($scope.tasks[index].isAction == 'insert') {
                    $scope.tasks.splice(index, 1);
                    //UP ORDER 1
                    angular.forEach($scope.tasks, function(data, index) {
                        $scope.tasks[index].order = index + 1;
                    });
                    //END
                } else if ($scope.tasks[index].isAction == 'update') {
                    $scope.tasks[index].isAction = 'delete';
                    //DOWN ORDER 1
                    for (var i = index + 1; i < $scope.tasks.length; i++) {
                        $scope.tasks[i].order -= 1;
                    }
                    //END
                }
                $scope.changeTimeCharge();
            });
        }
    };
    //END TASK

    //ADD ALL TASK OF WEEK
    $scope.addAllTask = function(status) {
        //CHECK ENOUGH 38 TIME CHARGE - FULL TIME
        if ($scope.info.time_temp < (38 * 60) && $scope.TypeOfContruct === "Full-time" && status !== 1) {
            toastr.warning("Please check time charge(>=38)", "Error");
        } else if ($scope.info.time_in_lieuFull > $scope.info.time_in_lieuHas && status !== 1) {
            //CHECK TIME IN LIEU
            toastr.warning("Please check time in lieu use larger time in lieu you have!", "Fail");
        } else {
            if (!$scope.isEdit) {
                //ADD NEW TIMESHEET
                startWeek = $filter('date')($scope.viewWeek.startWeek, 'yyyy-MM-dd');
                endWeek = $filter('date')($scope.viewWeek.endWeek, 'yyyy-MM-dd');
                $scope.info.startWeek = startWeek;
                $scope.info.endWeek = endWeek;
                $scope.info.statusID = status;
                $scope.info.weekNo = $scope.getWeekNumber($scope.viewWeek.startWeek);

                StaffService.addAllTask($scope.tasks, $scope.info).then(function(response) {
                    if (response['status'] == 'success') {
                        toastr.success("success", "Success");
                        $state.go('loggedIn.timesheet.view', null, {
                            'reload': true
                        });
                    } else {
                        toastr.error("Error", "Error");
                    }
                });
            } else {
                //EDIT TIMESHEET
                $scope.info.idWeek = $scope.idWeek;
                $scope.info.statusID = status;
                StaffService.editTask($scope.tasks, $scope.info).then(function(response) {
                    if (response['status'] == 'success') {
                        toastr.success("Edit Success");
                        $state.go('loggedIn.timesheet.view', null, {
                            'reload': true
                        });
                    } else {
                        toastr.error("Error", "Error");
                    }
                });
            }
        }

    };
    //END ADD ALL TASK OF WEEK

    //CHOOSE ITEM THANH
    $scope.chooseItem = function(task) {
        var modalInstance = $modal.open({
            templateUrl: "ItemCode",
            controller: function($scope) {
                $scope.items = angular.copy(task);
                //click cancel
                $scope.clickCancel = function() {
                    modalInstance.close({
                        type: "cancel"
                    });
                };
                //end click cancel

                //click save
                $scope.clickSave = function(info, formValid) {
                    if (formValid.$invalid === true) {
                        toastr.warning("Please Input All Required Information!", "Error");
                    } else {
                        if (info !== undefined && info !== null) {
                            for (var i = 0; i < info.length; i++) {
                                info[i].time_temp = StaffService.convertShowToFull(info[i].time_charge);
                            }
                        }
                        modalInstance.close({
                            type: "ok",
                            value: info
                        });
                    }
                };
                //end click save
            },
            size: 'lg',
        });

        modalInstance.result.then(function(obj) {
            if (obj.type == "ok") {
                var list = [];
                list = obj.value;
                task.item = list;

                if (list.length > 0) {
                    var t = [];
                    var c = 0;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].isAction !== 'delete') {
                            t.push(list[i].ITEM_ID);
                            c = c + StaffService.convertShowToFull(list[i].time_charge);
                        }
                    }
                    task.task = t.join(' , ');
                    task.time_charge = StaffService.convertFromFullToShow(c);
                    task.time_temp = c;
                    $scope.changeTimeCharge();
                } else {
                    task.task = null;
                    task.time_charge = null;
                    $scope.changeTimeCharge();
                }
            }

        });
    };
    //END CHOOSE ITEM THANH

    //SET CALENDAR TODAY
    $scope.setCalendarToToday = function() {
        $scope.calendarDay = new Date();
    };
    //END SET CALENDAR TODAY

    //TOGGLE
    $scope.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();

        event[field] = !event[field];
    };
    //END TOGLE

    //SHOW WEEK
    StaffService.showWeek($scope.info.userID);
    //END SHOW WEEK
});
