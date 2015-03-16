angular.module("app.loggedIn.timesheet.view.controller", [])

    .controller("TimesheetViewController", function($rootScope,$scope,MODE_ROW, $filter,$cookieStore, ConfigService, $modal,calendarHelper, moment,StaffService,$state,toastr){

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
                if(response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else if(response['status'] == 'no task' ){
                    toastr.error("no task", "Error");
                }else
                {
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

        if(!$scope.tasks){
            $scope.tasks = [];
        }

        $scope.isEdit = false;

        var startWeek,endWeek;

        $scope.task={
            order: null,
            task : null,
            date : null,
            department_code_id: null,
            location_id: null,
            activity_id: null,
            time_charge: null
        };

        $scope.calendarDay = new Date();

        $scope.delTask = function(index){
            $scope.tasks.splice(index,1);
        }

        $scope.addAllTask = function()
        {
            if(!$scope.isEdit)
            {
                startWeek = $filter('date')($scope.viewWeek.startWeek, 'yyyy-MM-dd');
                endWeek = $filter('date')($scope.viewWeek.endWeek, 'yyyy-MM-dd');
                StaffService.addAllTask($scope.tasks,startWeek, endWeek).then(function(response){
                    if(response['status'] == 'success'){
                        toastr.success("success","Success");
                        $state.go('loggedIn.staff.list', null, {'reload': true});
                    }else
                    {
                        toastr.error("Error", "Error");
                    }
                })
            }
            else
            {
                StaffService.editTask($scope.tasks).then(function(response){
                    if(response['status'] == 'success'){
                        toastr.success("Edit Success");
                        $state.go('loggedIn.staff.list', null, {'reload': true});
                    }else
                    {
                        toastr.error("Error", "Error");
                    }
                })
            }
        }

         $scope.changeDate = function(dateWeekFrom){

            if(dateWeekFrom === '')
            {
                $scope.list.result = angular.copy($scope.listTemp);
            }
            else
            {
                $scope.list.result = [];

                for(var i = 0;i< $scope.listTemp.length;i++)
                {
                    var rs = $scope.listTemp[i];
                    var sDate = $filter('date')(rs.start_date,"dd-MM-yyyy");

                    if(dateWeekFrom === sDate)
                    {
                        $scope.list.result.push(rs);
                    }
                }
            }
            
        }

        $scope.orderWeek = function(type)
        {
            if(type == 'desc')
            {
                $scope.list.result = $filter('orderBy')($scope.list.result,'week_no',true);
                $scope.isAsc = false;
            }
            else
            {
                $scope.list.result = $filter('orderBy')($scope.list.result,'week_no',false);
                $scope.isAsc = true;
            }
        }

        $scope.chooseItem = function(task)
        {
            console.log(task);
            var modalInstance = $modal.open({
                templateUrl: "modules/staff/views/itemModal.html",
                controller:'ItemController',
                size:'md'
            })
        }

        $scope.view = function(item){
            console.log(item);
            var modalInstance = $modal.open({
                templateUrl: "modules/staff/views/editTimesheet.html",
                controller: "EditTimesheetController",
                size:'lg',
                resolve: {
                    startDate: function(){
                        return item.start_date;
                    }
                }
            })
        }

        StaffService.showWeek();
    })

    .controller("EditTimesheetController",function($rootScope,$modalInstance,$modal, $scope, $cookieStore,$filter, ConfigService,calendarHelper, moment,StaffService,$state,toastr,startDate){
        if(!$scope.tasks){
            $scope.tasks = [];
        }

        $scope.isEdit = false;

        $scope.itemList = [];

        if(!$scope.info){
            $scope.info = {};
        }

        $scope.cancelClick = function(){
            $modalInstance.close();
        }

        $scope.okClick = function(){
            $scope.isEdit = !$scope.isEdit;
            if(!$scope.isEdit){
                console.log($scope.tasks);
                StaffService.editTask($scope.tasks).then(function(response){
                    if(response['status'] == 'success'){
                        toastr.success("success","Success");
                        $state.go('loggedIn.timesheet.view', null, {'reload': true});
                    }else
                    {
                        toastr.error("Error", "Error");
                    }
                })
            }
        }

        
        $scope.calendarDay = new Date();
        $scope.info.userID = $cookieStore.get("userInfo").id;

        var startWeek,endWeek;

        $scope.task={
            order: null,
            task : null,
            date : null,
            department_code_id: null,
            location_id: null,
            activity_id: null,
            time_charge: null,
            btnTitle: "Choose Item"
        };

        $scope.checkTaskWeek= function(date){
            $scope.tasks=[];
            startWeek = $filter('date')(date, 'yyyy-MM-dd');
            $scope.info.startWeek = startWeek;
            StaffService.checkTaskWeek($scope.info).then(function(response){
                if(response['status'] == 'fail' || response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else
                {
                    if(response['data'] != 'no'){
                        angular.forEach(response['data'], function(data){
                            data.isAction = 'update';
                            data.btnTitle = "Choose Item";
                            $scope.tasks.push(data);
                        })
                    }
                    console.log($scope.tasks);
                }
            })
        }

        $scope.loadInfo = function(){
            $scope.tasks.loading = true;
            StaffService.getDepartmentLocation().then(function(response){
                if(response['status'] == 'fail' || response['status'] == 'error'){
                    toastr.error("Error", "Error");
                    $state.go('loggedIn.home', null, {'reload': true});
                }else
                {
                    $scope.departments = response['department'];
                    $scope.locations = response['location'];
                    $scope.activities = response['activity'];
                    $scope.checkTaskWeek(startDate);
                }
            })
            $scope.tasks.loading = false;
        }

        $scope.loadInfo();
        
        $scope.addRow = function(index,date){
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
                department_code_id: null,
                location_id: null,
                activity_id: null,
                time_charge: null,
                isAction: 'insert',
                btnTitle: "Choose Item"
            };
            $scope.tasks.splice(index + j, 0,task) ;
        }

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


        $scope.chooseItem = function(task,index)
        {
            var modalInstance = $modal.open({
                templateUrl: "modules/staff/views/itemModal.html",
                controller:'ItemController',
                size:'lg',
                resolve: {
                    itemArr: function(){
                        var check = false;
                        var arr = [];
                        for(var i=0; i<$scope.itemList.length;i++)
                        {
                            if($scope.itemList[i].key == index)
                            {
                                if($scope.itemList[i].value.length > 0)
                                {
                                    check = true;
                                    arr = angular.copy($scope.itemList[i].value);
                                }
                            }
                        }

                        return check == true && arr.length > 0 ? arr : null;
                    }
                }
            })

            modalInstance.result.then(function(list){
                if(list != null && list.length > 0)
                {
                    $scope.itemList.push({key: index, value: list});

                    if(list.length > 0)
                    {
                        task.btnTitle = list[0].ITEM_CODE + "," + (list[1]== null || typeof list[1] === 'undefined' ? '' : list[1].ITEM_CODE+",")+"...";
                    }
                }
                else
                {
                    task.btnTitle = "Choose Item"
                }
            })
        }
    })

    

