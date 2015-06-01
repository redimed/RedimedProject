angular.module("app.loggedIn.timesheet.create.controller", [])

.controller("TimesheetCreateController", function($rootScope, ConfigService, $scope, $stateParams, $cookieStore, $filter, $modal, calendarHelper, moment, StaffService, $state, toastr, FileUploader) {
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

                //NOTIFICATION TIME IN LIEU
                var notification = "You have " + hours + " hours " + minutes + " minutes for Time in Lieu!";
                swal(notification);
                //END NOTIFICATION
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
        //SHOW __
        if (sum === 0) {
            $scope.info.time_charge = null;
        }
        //END SHOW __
    };
    //END FUNCTION TOTAL TIME CHARGE

    //CHANGE ACTIVITY
    $scope.ChangeActivity = function(activity_id, index) {
        //DEFAULT VALUE
        $scope.tasks[index].time_charge = null;
        $scope.tasks[index].time_temp = null;
        $scope.tasks[index].item = [];
        $scope.tasks[index].task = null;
        //END DEFAULT VALUE

        //CHECK DEFAULT WEEKEND
        if (activity_id === 5) {
            if ($scope.tasks[index].date.getDay() === 6 ||
                $scope.tasks[index].date.getDay() === 0) {
                var item = {};
                item.isAction = 'insert';
                item.time_temp = 0;
                item.totalUnits = 0;
                item.ratio = 0;
                item.time_charge = '0000';
                item.ITEM_ID = 18;
                item.ITEM_NAME = "Weekend Leave";
                $scope.tasks[index].item.push(item);
                $scope.tasks[index].time_charge = '0000';
                $scope.tasks[index].time_temp = 0;
                $scope.tasks[index].notPopup = true;
            } else {
                $scope.tasks[index].notPopup = false;
            }

        } else {
            $scope.tasks[index].notPopup = false;
        }
        //END CHECK DEFAULT WEEKEND

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
                timeInLieu += data.time_in_lieu;
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
                $scope.dateWeekFrom = $filter('date')($scope.tasks[0].date, "dd/MM/yyyy");
            }
            //END SHOW

            //SET DEFAULT WEEKEND
            if ($scope.tasks !== undefined &&
                $scope.tasks !== null &&
                $scope.tasks.length !== 0 &&
                $scope.tasks[$scope.tasks.length - 1] !== undefined &&
                $scope.tasks[$scope.tasks.length - 2] !== undefined) {
                $scope.tasks[$scope.tasks.length - 1].activity_id = 5; //SET ATIVITY_ID DEFAULT FOR SUN
                $scope.tasks[$scope.tasks.length - 2].activity_id = 5; //SET ATIVITY_ID DEFAULT FOR SAT

                //SET DEFAULT ITEM FOR SUN
                if ($scope.tasks[$scope.tasks.length - 1].item !== undefined && $scope.tasks[$scope.tasks.length - 1].item !== null) {
                    var item = {};
                    item.isAction = 'insert';
                    item.time_temp = 0;
                    item.totalUnits = 0;
                    item.ratio = 0;
                    item.time_charge = '0000';
                    item.ITEM_ID = 18;
                    item.ITEM_NAME = "Weekend Leave";
                    $scope.tasks[$scope.tasks.length - 1].item.push(item);
                    $scope.tasks[$scope.tasks.length - 1].time_charge = '0000';
                    $scope.tasks[$scope.tasks.length - 1].time_temp = 0;
                    $scope.tasks[$scope.tasks.length - 1].notPopup = true;
                }
                //END SUN

                //SET DEFAULT ITEM FOR SAT
                if ($scope.tasks[$scope.tasks.length - 2].item !== undefined && $scope.tasks[$scope.tasks.length - 2].item !== null) {
                    var item = {};
                    item.isAction = 'insert';
                    item.time_temp = 0;
                    item.totalUnits = 0;
                    item.ratio = 0;
                    item.time_charge = '0000';
                    item.ITEM_ID = 18;
                    item.ITEM_NAME = "Weekend Leave";
                    $scope.tasks[$scope.tasks.length - 2].item.push(item);
                    $scope.tasks[$scope.tasks.length - 2].time_charge = '0000';
                    $scope.tasks[$scope.tasks.length - 2].time_temp = 0;
                    $scope.tasks[$scope.tasks.length - 2].notPopup = true;
                }
                //EN SAT
            }
            //END SET
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
                            //UPLOADER
                            $scope.uploader = new FileUploader({
                                url: "/api/TimeSheet/post-upload-file",
                                method: "POST",
                                autoUpload: true,
                                formData: [{
                                    userId: $cookieStore.get("userInfo").id
                                }],
                                isHTML5: true,
                                isUploading: true
                            });
                            //END UPLOADER
                            angular.forEach(response['data'], function(data, indexData) {
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
                                        item.isAction = 'update';
                                        item.time_temp = item.time_charge;
                                        item.deleted = item.deleted;
                                        item.totalUnits = item.units;
                                        item.ratio = item.ratio;
                                        item.task_id = item.task_id;
                                        item.time_charge = StaffService.convertFromFullToShow(item.time_charge);
                                        item.fileUpload = [];
                                        //PUSH FILE
                                        angular.forEach(response['file'], function(valueFile, indexFile) {
                                            if (valueFile.tasks_id === item.tasks_id &&
                                                valueFile.ITEM_ID === item.ITEM_ID) {
                                                item.fileUpload.push({
                                                    file_name: valueFile.file_name,
                                                    file_id: valueFile.file_id,
                                                    isAction: "update"
                                                });
                                            }
                                        });
                                        //END FILE
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

    //CHOOSE ITEM
    $scope.chooseItem = function(task, uploader, statusEdit, taskIndex) {
        if (task !== undefined && task.activity_id === 1) {
            //GET LOCAION NAME
            if ($scope.locations !== undefined &&
                $scope.locations !== null &&
                $scope.locations.length !== 0) {
                angular.forEach($scope.locations, function(location, index) {
                    if (location.location_id === task.location_id) {
                        task.locationName = location.NAME;
                    }
                });
            } //END

            //GET DEPARTMENT NAME
            if ($scope.departments !== undefined &&
                $scope.departments !== null &&
                $scope.departments.length !== 0) {
                angular.forEach($scope.departments, function(department, index) {
                    if ($scope.departments[index].departmentid === task.department_code_id) {
                        task.departmentName = $scope.departments[index].departmentName;
                    }
                });
            }
            //END
            //MODAL BILLABLE
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
                            if (list[i].isAction !== 'delete' && list[i].show === true) {
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
            //END
        } else if (task !== undefined) {
            //GET LOCAION NAME
            if ($scope.locations !== undefined &&
                $scope.locations !== null &&
                $scope.locations.length !== 0) {
                angular.forEach($scope.locations, function(location, index) {
                    if (location.location_id === task.location_id) {
                        task.locationName = location.NAME;
                    }
                });
            } //END

            //GET DEPARTMENT NAME
            if ($scope.departments !== undefined &&
                $scope.departments !== null &&
                $scope.departments.length !== 0) {
                angular.forEach($scope.departments, function(department, index) {
                    if ($scope.departments[index].departmentid === task.department_code_id) {
                        task.departmentName = $scope.departments[index].departmentName;
                    }
                });
            }
            //END
            //NOT BILLABLE
            var modalInstanceAC = $modal.open({
                templateUrl: "ActivityDetail",
                controller: function($scope) {
                    $scope.activities = angular.copy(task);
                    $scope.activities.uploader = uploader;

                    $scope.activities.taskIndex = taskIndex;
                    if (statusEdit === true) {
                        $scope.activities.id_task_week = $stateParams.id;
                    }
                    //click cancel
                    $scope.clickCancel = function() {
                        modalInstanceAC.close({
                            type: "cancel"
                        });
                    };
                    //end click cancel

                    //click save
                    $scope.clickSave = function(info, formValid, upload) {
                        if (formValid.$invalid === true) {
                            toastr.warning("Please Input All Required Information!", "Error");
                        } else {
                            if (info !== undefined && info !== null) {
                                for (var i = 0; i < info.length; i++) {
                                    info[i].time_temp = StaffService.convertShowToFull(info[i].time_charge);
                                }
                            }
                            modalInstanceAC.close({
                                type: "ok",
                                value: info,
                                valueUpload: upload
                            });
                        }
                    };
                    //end click save
                },
                size: 'lg',
            });

            modalInstanceAC.result.then(function(obj) {
                if (obj.type == "ok") {
                    var list = [];
                    list = obj.value;
                    task.item = list;

                    if (list.length > 0) {
                        var t = [];
                        var c = 0;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i].isAction !== 'delete' && list[i].show === true) {
                                t.push(list[i].ITEM_NAME);
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
                    //PROCESSING FOR UPLOAD FILE
                    $scope.uploader = obj.valueUpload; //INPUT FILE CAN NOT COPY BY ANGULAR.COPY
                    task.fileUpload = [];
                    angular.forEach($scope.uploader.queue, function(value, index) {
                        task.fileUpload.push({
                            file_id: value.file_id,
                            item_id: value.itemId,
                            isAction: "update"
                        });
                    });
                    //END
                }
            });
            //END

        }

    };
    //END CHOOSE ITEM

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
