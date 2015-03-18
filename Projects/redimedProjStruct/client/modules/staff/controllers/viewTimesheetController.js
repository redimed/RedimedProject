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
                toastr.error("no task", "Error");
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
        console.log(item);
        var modalInstance = $modal.open({
            templateUrl: "modules/staff/views/editTimesheet.html",
            controller: "EditTimesheetController",
            size: 'lg',
            resolve: {
                idWeek: function() {
                    return item.task_week_id;
                }
            }
        })
    }

    StaffService.showWeek();
})

.controller("EditTimesheetController", function($rootScope, $modalInstance, $modal, $scope, $cookieStore, $filter, ConfigService, calendarHelper, moment, StaffService, $state, toastr, idWeek) {
    if (!$scope.tasks) {
        $scope.tasks = [];
    }

    $scope.isEdit = false;

    $scope.itemList = [];

    if (!$scope.info) {
        $scope.info = {};
    }

    $scope.cancelClick = function() {
        $modalInstance.close();
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

    $scope.loadInfo = function(){
        $scope.tasks.loading = true;
        console.log(idWeek);
        StaffService.getTask(idWeek).then(function(response){
            if(response['status'] == 'fail' || response['status'] == 'error'){
                toastr.error("Error", "Error");
                $state.go('loggedIn.home', null, {'reload': true});
            }else if(response['status'] == 'success')
            {
                
                angular.forEach(response['data'], function(data){
                    data.item = [];
                    angular.forEach(response['item'], function(item){
                         if(data.tasks_id == item.tasks_id){
                            data.item.push(item); 
                         }
                    })       
                })
                $scope.tasks = response['data'];
                console.log($scope.tasks);
            }
        })
        $scope.tasks.loading = false;
    }

    $scope.loadInfo();

    $scope.delTask = function(index,order){
        if(order != 1)
        {
            swal({
                title: "Are you sure?",
                text: "This task will lost in list !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                if($scope.tasks[index].isAction == 'update'){
                    $scope.tasks[index].isAction = 'delete';
                }else{
                    $scope.tasks.splice(index,1);
                }
            })
        }
    }

    $scope.addRow = function(index,date,weekID){
        var j = 0;
        for(var i = index; i < $scope.tasks.length; i ++){
            if($scope.tasks[i].date == date){
                j++;
            }
        }
        task={
            order: 1 + j,
            task : null,
            date : date,
            task_week_id: weekID,
            department_code_id: null,
            location_id: null,
            activity_id: null,
            time_charge: null,
            isAction: 'insert',
            btnTitle: "Choose Item"
        };
        $scope.tasks.splice(index + j, 0,task) ;
    }

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