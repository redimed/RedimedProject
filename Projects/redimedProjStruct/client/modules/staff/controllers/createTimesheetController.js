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

        $scope.itemList = [];

        $scope.calendarDay = new Date();
        $scope.info.userID = $cookieStore.get("userInfo").id;

        var startWeek,endWeek,sum = 0;

        $scope.task={
            order: null,
            task : null,
            date : null,
            department_code_id: null,
            location_id: null,
            activity_id: null,
            time_charge: 0,
            time_spent: null,
            btnTitle: "Choose Item"

        };

        $scope.getWeekNumber = function(d) {
            d = new Date(+d);
            d.setHours(0,0,0);
            d.setDate(d.getDate() + 4 - (d.getDay()||7));
            var yearStart = new Date(d.getFullYear(),0,1);
            var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
            return weekNo;
        }

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
                                time_charge: 0,
                                time_spent: null,
                                btnTitle: "Choose Item"

                            };
                            $scope.tasks.push($scope.task);
                        })
                    }
                }
            })
            console.log($scope.isEdit)
        }

        $scope.checkFirstTaskWeek = function(){
            $scope.tasks=[];
            StaffService.checkFirstTaskWeek($scope.info).then(function(response){
                if(response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else
                {
                    $scope.isEdit = false;
                    if(response['status'] == 'success'){
                        $scope.nextDay = moment(response['maxDate']).add(7, 'day').toDate();
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
                                time_charge: null,
                                btnTitle: "Choose Item"
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
                isEdit: false,
                btnTitle: "Choose Item"
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

        $scope.addAllTask = function(status)
        {
            $scope.goOn = false;
            if(status == 2){
                sum = 0;
                angular.forEach($scope.tasks, function(task){
                    if(task.time_spent != null){
                        sum = sum * 1 + task.time_spent * 1 ;
                    }
                })
                console.log(sum > 38 ? 'yes' : 'no');
                if(sum > 38 || sum == 38){
                    $scope.goOn = true;
                }else{
                    toastr.error("Time spent of week must be than 38 hours", "Error");
                }
            }

            if($scope.goOn == true || status == 1){
                startWeek = $filter('date')($scope.viewWeek.startWeek, 'yyyy-MM-dd');
                endWeek = $filter('date')($scope.viewWeek.endWeek, 'yyyy-MM-dd');
                $scope.info.startWeek = startWeek;
                $scope.info.endWeek = endWeek;
                $scope.info.statusID = status;
                $scope.info.weekNo = $scope.getWeekNumber($scope.viewWeek.startWeek);
                StaffService.addAllTask($scope.tasks,$scope.info).then(function(response){
                    if(response['status'] == 'success'){
                        toastr.success("success","Success");
                        $state.go('loggedIn.staff.list', null, {'reload': true});
                    }else
                    {
                        toastr.error("Error", "Error");
                    }
                })
            }
        }

        $scope.isBillable = false;

        $scope.activityChange = function(task,index){
            // for(var i=0; i< $scope.activities.length ;i++)
            // {
            //     var activity = $scope.activities[i];
            //     if(task.activity_id == activity.activity_id)
            //     {
            //         if(activity.NAME.toLowerCase() == 'billable time')
            //         {
            //             $scope.isBillable = true;

            //             task.time_spent = null;
            //             task.time_charge = null;
            //             task.task = null;
            //         }
            //         else
            //         {
            //             $scope.isBillable = false;

            //             for(var i=0; i<$scope.itemList.length;i++)
            //             {
            //                 if($scope.itemList[i].key == index)
            //                 {
            //                     if($scope.itemList[i].value.length > 0)
            //                     {
            //                         $scope.itemList = $scope.itemList.filter(function(obj) {
            //                             return obj.key == index;
            //                         });
            //                     }
            //                 }
            //             }

            //             task.btnTitle = "Choose Item"

            //         }
            //     }
            // }
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

.controller("ItemController", function($rootScope,$scope, $filter, ConfigService,$modalInstance, $modal,calendarHelper, moment,StaffService,$state,toastr,itemArr){
        $scope.itemSearchPanel = {}

        $scope.onlyNumbers = /^\d+$/;

        $scope.itemList = [];

        if(itemArr != null)
            $scope.itemList = angular.copy(itemArr);

        $scope.itemObj = 
        {
            ITEM_CODE: null,
            ITEM_NAME: null,
            quantity: null,
            timeCharge: null
        }

         $scope.cancel = function(){
            if(itemArr != null)
                $modalInstance.close(itemArr);
            else
            {
                $scope.itemList = [];
                $modalInstance.close(itemArr);
            }
        }

        $scope.okClick = function(){
            $modalInstance.close($scope.itemList);
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
                            quantity: 1,
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
                        quantity: 1,
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

    

