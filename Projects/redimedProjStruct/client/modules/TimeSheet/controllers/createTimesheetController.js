angular.module("app.loggedIn.timesheet.create.controller", [])

.controller("TimesheetCreateController", function($rootScope, ConfigService, $scope, $stateParams, $cookieStore, $filter, $modal, calendarHelper, moment, StaffService, $state, toastr, FileUploader, $timeout) {
    //popup input date
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    //set default value
    $scope.info = {};
    $scope.info.time_temp = 0;
    $scope.info.time_charge = 0;

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
    /*
    checkTimeInLieu: check time in lieu of employee for lastest 2 weeks from current date
    input:
    output: time in lieu of employee
    */
    $scope.CheckTimeInLieu = function() {
        var info = {
            date: new Date(),
            userId: ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null
        };

        StaffService.CheckTimeInLieu(info).then(function(response) {
            if (response.status === "error") {
                toastr.error("Check Time in Lieu fail!", "Fail");
            } else if (response.status === "success") {
                var timeInLieu = response.time_in_lieu;

                //convert format time charge to hh hours mm
                var hours = parseInt(timeInLieu / 60);
                var minutes = timeInLieu % 60;
                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }

                //notification
                var notification = "You have " + hours + " hours " + minutes + " minutes for Time in Lieu!";
                swal(notification);

            } else {
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Server not response!", "Error");
            }
        });
    };

    /*
      ChangeTimeCharge: check change of time charge
      input: 
      output: total time charge, total time in lieu choose
      */
    $scope.ChangeTimeCharge = function() {
        var sum = 0;
        var sumInLieu = 0;
        angular.forEach($scope.tasks, function(data, index) {
            //sum time charge
            $scope.tasks[index].time_temp = StaffService.ConvertShowToFull(data.time_charge);
            if (data.time_charge !== null &&
                data.time_charge !== undefined &&
                data.isAction !== "delete" &&
                data.activity_id !== null &&
                data.time_charge !== "" &&
                data.time_charge.length !== 0) {
                sum = sum + parseInt(StaffService.ConvertShowToFull(data.time_charge));
            }
            //sum time in lieu
            if (data.item !== undefined &&
                data.item !== null &&
                data.length !== 0) {
                angular.forEach(data.item, function(value, index) {
                    if (value !== undefined &&
                        value !== null &&
                        value.ITEM_ID == 22 &&
                        value.isAction !== "delete" &&
                        value.time_charge !== "" &&
                        value.time_charge.length !== 0) {
                        sumInLieu += StaffService.ConvertShowToFull(value.time_charge);
                    }
                });
            }
        });

        $scope.info.time_in_lieuFull = sumInLieu;
        $scope.info.time_temp = sum;
        $scope.info.time_charge = StaffService.ConvertFromFullToShow(sum);
        //show time charge
        if (sum === 0) {
            $scope.info.time_charge = null;
        }
    };

    /*
    ChangeActivity: set value default task for date is saturday and sunday, disabled and enable button choose item
    input: activity_id, index
    output: value default task
    */
    $scope.ChangeActivity = function(activity_id, index) {
        //value default
        $scope.tasks[index].time_charge = null;
        $scope.tasks[index].time_temp = null;
        $scope.tasks[index].item = [];
        $scope.tasks[index].task = null;

        //check weekend and activity non-charge
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
        //end

        $scope.ChangeTimeCharge();
    };
    //end

    /*
    GetWeekNumber: get week number of year
    input: date
    output: week number
    */
    $scope.GetWeekNumber = function(date) {
        var d = new Date(+date);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        var yearStart = new Date(d.getFullYear(), 0, 1);
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    };

    var info = {
        date: new Date(),
        userId: ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null
    };

    StaffService.CheckTimeInLieu(info).then(function(response) {
        if (response.status === "error") {
            toastr.error("Check Time in Lieu fail!", "Fail");
        } else if (response.status === "success") {
            $scope.info.time_in_lieuHas = response.time_in_lieu;

        } else {
            $state.go("loggedIn.home", null, {
                "reload": true
            });
            toastr.error("Server not response!", "Error");
        }
    });

    /*
    checkTaskWeek: check exist Timesheet
    input: start date of week
    output: data for timesheet
    */
    $scope.CheckTaskWeek = function(date) {
        startWeek = $filter('date')(date, 'yyyy-MM-dd');
        $scope.info.startWeek = startWeek;
        StaffService.CheckTaskWeek($scope.info).then(function(response) {
            if (response['status'] === 'fail' || response['status'] === 'error') {
                toastr.error("Error", "Error");
            } else {
                if (response['data'] !== 'no') {
                    //load data old timesheet
                    $scope.tasks = [];
                    angular.forEach(response['data'], function(data) {
                        data.isEdit = true;
                        $scope.tasks.push(data);
                    });
                } else {
                    //create new data for timesheet
                    $scope.CreateDataNewTimesheet();
                }
            }
        });
    };

    /*
    CreateDataNewTimesheet: create data for new timesheet
    input:
    output: Timesheet added new data
    */
    $scope.CreateDataNewTimesheet = function() {
        $scope.orgiTask = angular.copy($scope.tasks);
        $scope.tasks = [];
        $scope.viewWeek = calendarHelper.getWeekView(date, true);
        angular.forEach($scope.viewWeek.columns, function(data, index) {
            $scope.task = {
                order: $scope.orgiTask[index].order,
                task: $scope.orgiTask[index].task,
                date: data.dateChosen,
                department_code_id: $scope.orgiTask[index].department_code_id,
                location_id: $scope.orgiTask[index].location_id,
                activity_id: $scope.orgiTask[index].activity_id,
                time_charge: $scope.orgiTask[index].time_charge,
                isInputItem: $scope.orgiTask[index].isInputItem,
                isBillable: $scope.orgiTask[index].isBillable,
                isParent: $scope.orgiTask[index].isParent,
                item: $scope.orgiTask[index].item
            };
            $scope.tasks.push($scope.task);
        });
    };


    /*
    CheckFirstTaskWeek: get next week enter timesheet
    input:
    output: next week for employee enter Timesheet
    */
    $scope.CheckFirstTaskWeek = function() {
        $scope.tasks = [];
        StaffService.CheckFirstTaskWeek($scope.info).then(function(response) {
            if (response['status'] === 'error') {
                toastr.error("Error", "Error");
            } else {
                $scope.isEdit = false;
                if (response['status'] === 'success') {
                    $scope.nextDay = moment(response['maxDate']).add(7, 'day').toDate();
                } else if (response['status'] === 'no maxDate') {
                    $scope.nextDay = moment($scope.calendarDay).add(7, 'day').toDate();
                }
                //create new week to enter timesheet
                $scope.viewWeek = calendarHelper.getWeekView($scope.nextDay, true);
                //set value default for date of created week
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
            //show date for Week From on view create new Timesheet
            if ($scope.tasks !== undefined &&
                $scope.tasks !== null &&
                $scope.tasks.length !== 0 &&
                $scope.tasks[0] !== undefined) {
                $scope.dateWeekFrom = $filter('date')($scope.tasks[0].date, "dd/MM/yyyy");
            }
            $scope.SetValueDefaultWeekend();
        });
    };

    /*
    SetValueDefaultWeekend: set value default for saturday and sunday
    input:
    output: value default for weekend
    */
    $scope.SetValueDefaultWeekend = function() {
        //set value default for saturday and sunday
        if ($scope.tasks !== undefined &&
            $scope.tasks !== null &&
            $scope.tasks.length !== 0 &&
            $scope.tasks[$scope.tasks.length - 1] !== undefined &&
            $scope.tasks[$scope.tasks.length - 2] !== undefined) {
            $scope.tasks[$scope.tasks.length - 1].activity_id = 5; //set activity default for sun
            $scope.tasks[$scope.tasks.length - 2].activity_id = 5; //set activity default for sat

            //set default item for sun
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

            //set default item for sat
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
        }
    };

    /*
    AssignDataTimesheet: push data for old Timesheet
    input: - data for timehsheet
    output: - Timesheet is pushed data
    */
    $scope.AssignDataTimesheet = function(dataTimesheet) {
        angular.forEach(dataTimesheet['data'], function(data, indexData) {
            data.item = [];
            data.isEdit = true;
            data.time_temp = data.time_charge;
            data.isAction = 'update';
            if (data.time_charge !== null) {
                data.time_charge = StaffService.ConvertFromFullToShow(data.time_charge);
            }
            angular.forEach(dataTimesheet['item'], function(item) {
                //check status
                if (dataTimesheet['item'] !== undefined && dataTimesheet['item'][0] && dataTimesheet['item'][0].task_status_id !== undefined) {
                    $scope.checkStatus = dataTimesheet['item'][0].task_status_id;
                    $scope.afterStatusID = dataTimesheet['item'][0].after_status_id;
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
                    item.time_charge = StaffService.ConvertFromFullToShow(item.time_charge);
                    item.fileUpload = [];
                    //push file
                    angular.forEach(dataTimesheet['file'], function(valueFile, indexFile) {
                        if (valueFile.tasks_id === item.tasks_id &&
                            valueFile.ITEM_ID === item.ITEM_ID) {
                            item.fileUpload.push({
                                file_name: valueFile.file_name,
                                file_id: valueFile.file_id,
                                isAction: "update"
                            });
                        }
                    });
                    //end
                    data.item.push(item);
                }
            });
            //push data, refresh sum time charge
            $scope.tasks.push(data);
            $scope.ChangeTimeCharge();
            //end
        });
    };

    /*
    LoadOldTimesheet: load old Timesheet
    input: 
    output: Data for old Timesheet
    */
    $scope.LoadOldTimesheet = function() {
        var info = {
            idWeek: $stateParams.id,
            userId: $cookieStore.get("userInfo").id
        };
        //load information old Timesheet
        StaffService.ShowEdit(info).then(function(response) {
            if (response['data'] !== undefined &&
                response['data'][0] !== undefined &&
                response['data'][0].date !== undefined) {
                $scope.dateStart = response['data'][0].date;
            }
            if (response['status'] == 'fail') {
                angular.forEach(response['data'], function(data) {
                    data.item = [];
                    data.isEdit = true;
                    data.time_temp = data.time_charge;
                    data.isAction = 'update';
                    if (data.time_charge !== null) {
                        data.time_charge = StaffService.ConvertFromFullToShow(data.time_charge);
                    }
                    $scope.tasks.push(data);
                    $scope.ChangeTimeCharge();
                });
            } else if (response['status'] === 'success') {
                //uploader
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

                $scope.AssignDataTimesheet(response);

            } else if (response['status'] === 'error') {
                $state.go("loggedIn.home", null, {
                    "reload": true
                });
                toastr.error("Load fail!", "Error");
            }
        });
    };

    /*
      LoadInfo: Load information to create or edit Timesheet.
      input: 
      output: Data department, location, ... for Timesheet
    */
    $scope.LoadInfo = function() {
        $scope.tasks.loading = true;
        //load information department, location, activity for Timesheet
        StaffService.GetDepartmentLocationActivity().then(function(response) {
            if (response['status'] == 'fail' || response['status'] == 'error') {
                toastr.error("Error", "Error");
            } else {
                $scope.departments = response['department'];
                $scope.locations = response['location'];
                $scope.activities = response['activity'];
                //check update or create new Timesheet
                if ($stateParams.id) {
                    //edit old timesheet
                    $scope.isEdit = true;
                    $scope.LoadOldTimesheet();
                } else {
                    //create new timesheet
                    $scope.isEdit = false;
                    $scope.CheckFirstTaskWeek();
                }
            }

        });
        $scope.tasks.loading = false;
    };


    /*
    LoadTypeOfContract: Load contract of employee
    input: 
    output: contract of employee
    */
    $scope.LoadTypeOfContrack = function() {
        //check type of contract for employee
        var USER_ID = ($cookieStore.get('userInfo') !== undefined) ? $cookieStore.get('userInfo').id : null;
        StaffService.LoadContract(USER_ID).then(function(contruct) {
            if (contruct.status === "success" && contruct.result[0] !== undefined && contruct.result[0].TypeOfContruct !== undefined) {
                $scope.TypeOfContruct = contruct.result[0].TypeOfContruct;
            } else {
                toastr.error("User not type of contruct!, Please notification Admin", "Error");
            }
        });
    };

    $scope.LoadTypeOfContrack();
    
    $scope.LoadInfo();

    /*
    addRow: add a new row for Timesheet
    input: index, date of row user click
    output: Timesheet been added new row
    */
    $scope.AddRow = function(index, date) {
        //get index of row click
        var j = 0;
        for (var i = index; i < $scope.tasks.length; i++) {
            if ($scope.tasks[i].date == date) {
                j++;
            }
        }
        //set task with value default
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
        //add task for Timesheet.
        $scope.tasks.splice(index + j, 0, task);
        //update order for rows of Timesheet.
        angular.forEach($scope.tasks, function(data, index) {
            $scope.tasks[index].order = index + 1;
        });
    };

    //get date from
    var dateFrom;
    $scope.ChangeDate = function() {
        dateFrom = new Date($scope.dateWeekFrom.substr(6, 4), $scope.dateWeekFrom.substr(3, 2) - 1, $scope.dateWeekFrom.substr(0, 2));
        $scope.CheckTaskWeek(dateFrom);
    };

    /*
    delTask: delete a task on Timesheet.
    input: index, order task of Timesheet.
    output: Timesheet is deleted this task.
    */
    $scope.DelTask = function(index, order) {
        if (order != 1) {
            swal({
                title: "Are you sure delete this row?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                //delete task.
                if ($scope.tasks[index].isAction == 'insert') {
                    $scope.tasks.splice(index, 1);
                    //update order of rows.
                    angular.forEach($scope.tasks, function(data, index) {
                        $scope.tasks[index].order = index + 1;
                    });
                } else if ($scope.tasks[index].isAction == 'update') {
                    //update isAction row of Timesheet.
                    $scope.tasks[index].isAction = 'delete';
                    //update order rows of Timesheet.
                    for (var i = index + 1; i < $scope.tasks.length; i++) {
                        $scope.tasks[i].order -= 1;
                    }
                }
                $scope.ChangeTimeCharge();
            });
        }
    };

    /*
    ActionTimesheet: create or update Timesheet.
    input: status - status of Timesheet, formValid - validate form create new Timesheet.
    output: status - status when create new Timesheet.
    */
    $scope.ActionTimesheet = function(status, formValid) {
        //check enough time charge with employee full-time >= 38
        if ($scope.info.time_temp < (38 * 60) && $scope.TypeOfContruct === "Full-time" && status !== 1) {
            toastr.warning("Please check time charge(>=38)", "Error");
        } else if ($scope.info.time_in_lieuFull > $scope.info.time_in_lieuHas && status !== 1) {
            //check time in lieu
            toastr.warning("Please check time in lieu use larger time in lieu you have!", "Fail");
        } else if (formValid.$invalid) {
            toastr.error("Please Input All Required Information!", "Error");
        } else {
            if ($scope.isEdit === false) {
                $scope.AddAllTask(status);

            } else if ($scope.isEdit === true) {
                $scope.EditTask(status);
            }
        }

    };

    /*
    addAllTask: create new Timesheet
    input: status: status of Timesheet
    output: - success: send message success
            - fail: send message error
    */
    $scope.AddAllTask = function(status) {
        startWeek = $filter('date')($scope.viewWeek.startWeek, 'yyyy-MM-dd');
        endWeek = $filter('date')($scope.viewWeek.endWeek, 'yyyy-MM-dd');
        $scope.info.startWeek = startWeek;
        $scope.info.endWeek = endWeek;
        $scope.info.statusID = status;
        $scope.info.weekNo = $scope.GetWeekNumber($scope.viewWeek.startWeek);

        StaffService.AddAllTask($scope.tasks, $scope.info).then(function(response) {
            if (response['status'] == 'success') {
                toastr.success("success", "Success");
                $state.go('loggedIn.timesheetHome.timesheetHistory', null, {
                    "reload": true
                });
            } else {
                toastr.error("Error", "Error");
            }
        });
    };

    /*
    editTask: update Timesheet
    input: status of Timesheet
    output: - success: send message success
            - fail: send message error
    */
    $scope.EditTask = function(status) {
        $scope.info.idWeek = $stateParams.id;
        $scope.info.statusID = status;
        StaffService.EditTask($scope.tasks, $scope.info).then(function(response) {
            if (response['status'] == 'success') {
                toastr.success("Update Timesheet success!", "Success");
                $state.go('loggedIn.timesheetHome.timesheetHistory', null, {
                    "reload": true
                });
            } else {
                toastr.error("Update Timesheet fail!", "Error");
            }
        });
    };

    /*
    ChooseItem: Popup choose item code for Timesheet's task.
    input: - task: task you click, uploadder a object for attech files, statusEdit - is edit or update,
           - taskIndex: index task you click.
    output: task added item
    */
    $scope.ChooseItem = function(task, uploader, statusEdit, taskIndex) {
        if (task !== undefined && task.activity_id === 1) {
            //get location name
            if ($scope.locations !== undefined &&
                $scope.locations !== null &&
                $scope.locations.length !== 0) {
                angular.forEach($scope.locations, function(location, index) {
                    if (location.location_id === task.location_id) {
                        task.locationName = location.NAME;
                    }
                });
            }

            //get department name
            if ($scope.departments !== undefined &&
                $scope.departments !== null &&
                $scope.departments.length !== 0) {
                angular.forEach($scope.departments, function(department, index) {
                    if ($scope.departments[index].departmentid === task.department_code_id) {
                        task.departmentName = $scope.departments[index].departmentName;
                    }
                });
            }
            //builable
            var modalInstance = $modal.open({
                templateUrl: "ItemCode",
                controller: function($scope) {
                    $scope.items = angular.copy(task);
                    //click cancel
                    $scope.ClickCancel = function() {
                        modalInstance.close({
                            type: "cancel"
                        });
                    };

                    //click save
                    $scope.ClickSave = function(info, formValid) {
                        if (formValid.$invalid === true) {
                            toastr.warning("Please Input All Required Information!", "Error");
                        } else {
                            if (info !== undefined && info !== null) {
                                for (var i = 0; i < info.length; i++) {
                                    info[i].time_temp = StaffService.ConvertShowToFull(info[i].time_charge);
                                }
                            }
                            modalInstance.close({
                                type: "ok",
                                value: info
                            });
                        }
                    };
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
                                c = c + StaffService.ConvertShowToFull(list[i].time_charge);
                            }
                        }
                        task.task = t.join(' , ');
                        task.time_charge = StaffService.ConvertFromFullToShow(c);
                        task.time_temp = c;
                        $scope.ChangeTimeCharge();
                    } else {
                        task.task = null;
                        task.time_charge = null;
                        $scope.ChangeTimeCharge();
                    }
                }
            });

        } else if (task !== undefined) {
            //get location name
            if ($scope.locations !== undefined &&
                $scope.locations !== null &&
                $scope.locations.length !== 0) {
                angular.forEach($scope.locations, function(location, index) {
                    if (location.location_id === task.location_id) {
                        task.locationName = location.NAME;
                    }
                });
            }

            //get department name
            if ($scope.departments !== undefined &&
                $scope.departments !== null &&
                $scope.departments.length !== 0) {
                angular.forEach($scope.departments, function(department, index) {
                    if ($scope.departments[index].departmentid === task.department_code_id) {
                        task.departmentName = $scope.departments[index].departmentName;
                    }
                });
            }

            //activity
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
                    $scope.ClickCancel = function() {
                        modalInstanceAC.close({
                            type: "cancel"
                        });
                    };

                    //click save
                    $scope.ClickSave = function(info, formValid, upload) {
                        if (formValid.$invalid === true) {
                            toastr.warning("Please Input All Required Information!", "Error");
                        } else {
                            if (info !== undefined && info !== null) {
                                for (var i = 0; i < info.length; i++) {
                                    info[i].time_temp = StaffService.ConvertShowToFull(info[i].time_charge);
                                }
                            }
                            modalInstanceAC.close({
                                type: "ok",
                                value: info,
                                valueUpload: upload
                            });
                        }
                    };
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
                                c = c + StaffService.ConvertShowToFull(list[i].time_charge);
                            }
                        }
                        task.task = t.join(' , ');
                        task.time_charge = StaffService.ConvertFromFullToShow(c);
                        task.time_temp = c;
                        $scope.ChangeTimeCharge();
                    } else {
                        task.task = null;
                        task.time_charge = null;
                        $scope.ChangeTimeCharge();
                    }
                }
            });
        }

    };

    //set calendar today
    $scope.SetCalendarToToday = function() {
        $scope.calendarDay = new Date();
    };

    //toggle
    $scope.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();

        event[field] = !event[field];
    };

    //show week
    StaffService.ShowWeek($scope.info.userID);
});
