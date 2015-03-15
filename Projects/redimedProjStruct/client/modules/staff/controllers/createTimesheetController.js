angular.module("app.loggedIn.timesheet.create.controller", [])

    .controller("TimesheetCreateController", function($rootScope,$scope, $cookieStore,$filter, ConfigService, $modal,calendarHelper, moment,StaffService,$state,toastr){
        $('body').addClass("page-sidebar-closed");
        $('ul').addClass("page-sidebar-menu-closed");

        if(!$scope.tasks){
            $scope.tasks = [];
        }

        if(!$scope.info){
            $scope.info = {};
        }

        $scope.isEdit = false;
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
            time_charge: null
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
                        $scope.isEdit = true;
                        angular.forEach(response['data'], function(data){
                            data.isEdit = true;
                            $scope.tasks.push(data);
                        })
                    }else{
                        $scope.isEdit = false;
                        $scope.viewWeek = calendarHelper.getWeekView(date, true);
                        angular.forEach($scope.viewWeek.columns, function(data){
                            $scope.task={
                                order: 1,
                                task : null,
                                date : data.dateChosen,
                                department_code_id: null,
                                location_id: null,
                                activity_id: null,
                                time_charge: null
                            };
                            $scope.tasks.push($scope.task);
                        })
                    }
                }
            })
        }

        $scope.checkFirstTaskWeek = function(){
            $scope.tasks=[];
            StaffService.checkFirstTaskWeek($scope.info).then(function(response){
                if(response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else
                {
                    if(response['status'] == 'success'){
                        $scope.nextDay = moment(response['maxDate']).add(7, 'day').toDate();
                        console.log(response['maxDate']);
                        console.log($scope.nextDay);
                    }else if(response['status'] == 'no maxDate'){
                        
                        $scope.nextDay = moment($scope.calendarDay).add(7, 'day').toDate();
                    }
                    $scope.viewWeek = calendarHelper.getWeekView($scope.nextDay, true);
                        angular.forEach($scope.viewWeek.columns, function(data){
                            $scope.task={
                                order: 1,
                                task : null,
                                date : data.dateChosen,
                                department_code_id: null,
                                location_id: null,
                                activity_id: null,
                                time_charge: null
                            };
                            $scope.tasks.push($scope.task);
                        })
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
                    $scope.checkFirstTaskWeek();
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
            console.log(j);
            task={
                order: 1 + j,
                task : null,
                date : date,
                department_code_id: null,
                location_id: null,
                activity_id: null,
                time_charge: null,
                isEdit: false
            };
            $scope.tasks.splice(index + j, 0,task) ;
        }

        var dateFrom;
        $scope.changeDate = function(){
            dateFrom = new Date($scope.dateWeekFrom.substr(6,4),$scope.dateWeekFrom.substr(3,2) - 1,$scope.dateWeekFrom.substr(0,2));
            $scope.checkTaskWeek(dateFrom);
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
                    $scope.tasks.splice(index,1);
                })
            }
        }

        $scope.addAllTask = function()
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

        $scope.chooseItem = function(task)
        {
            var modalInstance = $modal.open({
                templateUrl: "modules/staff/views/itemModal.html",
                controller:'ItemController',
                size:'lg'
            })
        }

        $scope.setCalendarToToday = function() {
            $scope.calendarDay = new Date();
        };

        $scope.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();

            event[field] = !event[field];
        };

        StaffService.showWeek();

        
    })

    .controller("ItemController", function($rootScope,$scope, $filter, ConfigService,$modalInstance, $modal,calendarHelper, moment,StaffService,$state,toastr){
        $scope.itemSearchPanel = {}

        $scope.onlyNumbers = /^\d+$/;

        $scope.itemList = [];

        $scope.itemObj = 
        {
            ITEM_CODE: null,
            ITEM_NAME: null,
            quantity: null,
            timeCharge: null
        }

         $scope.cancel = function(){
            $modalInstance.close();
        }

        $scope.okClick = function(){
            console.log($scope.itemList);
        }

         $scope.delItem = function(index){
            swal({
                title: "Are you sure?",
                text: "This item will delete from the list !",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function() {
                $scope.itemList.splice(index,1);
            })
        }

       $scope.itemSearch = {
            is_show: false,
            itemPerPage: 10,
            click: function(item) {
                if($scope.itemList.length > 0)
                {
                    var isExist = false;
                    for(var i=0; i<$scope.itemList.length; i++)
                    {
                        if(item.ITEM_CODE == $scope.itemList[i].ITEM_CODE)
                        {
                            isExist = true;
                            $scope.itemList[i].quantity = parseInt($scope.itemList[i].quantity) + 1;
                        }
                    }

                    if(!isExist)
                    {
                        $scope.itemObj = 
                        {
                            ITEM_CODE: item.ITEM_CODE,
                            ITEM_NAME: item.ITEM_NAME,
                            quantity: 0,
                            timeCharge: 0
                        }

                        $scope.itemList.push($scope.itemObj);
                    }
                }
                else
                {
                    $scope.itemObj = 
                    {
                        ITEM_CODE: item.ITEM_CODE,
                        ITEM_NAME: item.ITEM_NAME,
                        quantity: 0,
                        timeCharge: 0
                    }

                    $scope.itemList.push($scope.itemObj);
                }

            }
        }

        $scope.itemSearchOption = {
            api:'api/erm/v2/items/search',
            method:'post',
            scope: $scope.itemSearchPanel,
            columns: [
                {field: 'ITEM_ID', is_hide: true},
                {field: 'ITEM_CODE', label: 'Item Code', width:"10%"},
                {field: 'ITEM_NAME', label: 'Item Name'},
            ],
            use_filters:true,
            filters:{
                ITEM_CODE: {type: 'text'},
                ITEM_NAME: {type: 'text'}
            }
        }

    })

