angular.module("app.loggedIn.timesheet.view.controller", [])

    .controller("TimesheetViewController", function($rootScope,$scope,MODE_ROW, $filter, ConfigService, $modal,calendarHelper, moment,StaffService,$state,toastr){

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
            StaffService.getAllTaskAMonth($scope.searchObjectMap).then(function(response) {
                if(response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else if(response['status'] == 'no task' ){
                    toastr.error("no task", "Error");
                }else
                {
                    $scope.list.result = response;
                    $scope.list.count = response.length;
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

        $(function() {
            var startDate;
            var endDate;

            var selectCurrentWeek = function () {
                window.setTimeout(function () {
                    $('.ui-weekpicker').find('.ui-datepicker-current-day a').addClass('ui-state-active').removeClass('ui-state-default');
                }, 1);
            }

            var setDates = function (input) {
                var $input = $(input);
                var date = $input.datepicker('getDate');
                var firstDay = $input.datepicker( "option", "firstDay");
                $input.datepicker( "option", "dateFormat", "dd-mm-yy" );
                $input.datepicker('option', 'firstDay', 1);
                if (date !== null) {
                    var dayAdjustment = date.getDay() - firstDay;
                    if (dayAdjustment < 0) {
                        dayAdjustment += 7;
                    }
                    startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment);
                    endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment + 6);
                    $input.datepicker("setDate", startDate);
                }
            }

            $('.week-picker').datepicker({
                beforeShow: function () {
                    $('#ui-datepicker-div').addClass('ui-weekpicker');
                    selectCurrentWeek();
                },
                onClose: function () {
                    $('#ui-datepicker-div').removeClass('ui-weekpicker');
                },
                showOtherMonths: true,
                selectOtherMonths: true,
                onSelect: function (dateText, inst) {
                    setDates(this);
                    selectCurrentWeek();
                    $(this).change();
                },
                beforeShowDay: function (date) {
                    var cssClass = '';
                    if (date >= startDate && date <= endDate)
                        cssClass = 'ui-datepicker-current-day';
                    return [true, cssClass];
                },
                onChangeMonthYear: function (year, month, inst) {
                    selectCurrentWeek();
                }
            });

            setDates('.week-picker');

            var $calendarTR = $('.ui-weekpicker .ui-datepicker-calendar tr');
            $calendarTR.live('mousemove', function () {
                $(this).find('td a').addClass('ui-state-hover');
            });
            $calendarTR.live('mouseleave', function () {
                $(this).find('td a').removeClass('ui-state-hover');
            });
        });
    })

    .controller("EditTimesheetController",function($rootScope,$modalInstance,$modal, $scope, $cookieStore,$filter, ConfigService,calendarHelper, moment,StaffService,$state,toastr,startDate){
        if(!$scope.tasks){
            $scope.tasks = [];
        }

        $scope.isEdit = false;

        if(!$scope.info){
            $scope.info = {};
        }

        $scope.cancelClick = function(){
            $modalInstance.close();
        }

        $scope.okClick = function(){
            $scope.isEdit = !$scope.isEdit;
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
                        angular.forEach(response['data'], function(data){
                            data.order = 1;
                            $scope.tasks.push(data);
                        })
                    }
                }
            })
        }

        $scope.checkTaskWeek(startDate);

        console.log($scope.tasks)



        // $scope.checkFirstTaskWeek = function(){
        //     $scope.tasks=[];
        //     StaffService.checkFirstTaskWeek($scope.info).then(function(response){
        //         if(response['status'] == 'error'){
        //             toastr.error("Error", "Error");
        //         }else
        //         {
        //             if(response['status'] == 'success'){
        //                 $scope.nextDay = moment(response['maxDate']).add(7, 'day').toDate();
        //                 console.log(response['maxDate']);
        //                 console.log($scope.nextDay);
        //             }else if(response['status'] == 'no maxDate'){
                        
        //                 $scope.nextDay = moment($scope.calendarDay).add(7, 'day').toDate();
        //             }
        //             $scope.viewWeek = calendarHelper.getWeekView($scope.nextDay, true);
        //                 angular.forEach($scope.viewWeek.columns, function(data){
        //                     $scope.task={
        //                         order: 1,
        //                         task : null,
        //                         date : data.dateChosen,
        //                         department_code_id: null,
        //                         location_id: null,
        //                         activity_id: null,
        //                         time_charge: null
        //                     };
        //                     $scope.tasks.push($scope.task);
        //                 })
        //         }
        //     })
        // }

        // $scope.loadInfo = function(){
        //     $scope.tasks.loading = true;
        //     StaffService.getDepartmentLocation().then(function(response){
        //         if(response['status'] == 'fail' || response['status'] == 'error'){
        //             toastr.error("Error", "Error");
        //             $state.go('loggedIn.home', null, {'reload': true});
        //         }else
        //         {
        //             $scope.departments = response['department'];
        //             $scope.locations = response['location'];
        //             $scope.activities = response['activity'];
        //             $scope.checkFirstTaskWeek();
        //         }
        //     })
        //     $scope.tasks.loading = false;
        // }

        // $scope.loadInfo();

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

        // var dateFrom;
        // $scope.changeDate = function(){
        //     dateFrom = new Date($scope.dateWeekFrom.substr(6,4),$scope.dateWeekFrom.substr(3,2) - 1,$scope.dateWeekFrom.substr(0,2));
        //     $scope.checkTaskWeek(dateFrom);
        // }

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

        // $scope.addAllTask = function()
        // {
        //     startWeek = $filter('date')($scope.viewWeek.startWeek, 'yyyy-MM-dd');
        //     endWeek = $filter('date')($scope.viewWeek.endWeek, 'yyyy-MM-dd');
        //     StaffService.addAllTask($scope.tasks,startWeek, endWeek).then(function(response){
        //         if(response['status'] == 'success'){
        //             toastr.success("success","Success");
        //             $state.go('loggedIn.staff.list', null, {'reload': true});
        //         }else
        //         {
        //             toastr.error("Error", "Error");
        //         }
        //     })
        // }

        $scope.chooseItem = function(task)
        {
            console.log(task);
            var modalInstance = $modal.open({
                templateUrl: "modules/staff/views/itemModal.html",
                controller:'ItemController',
                size:'lg'
            })
        }

        // $scope.setCalendarToToday = function() {
        //     $scope.calendarDay = new Date();
        // };

        // $scope.toggle = function($event, field, event) {
        //     $event.preventDefault();
        //     $event.stopPropagation();

        //     event[field] = !event[field];
        // };

        // $(function() {
        //     var startDate;
        //     var endDate;

        //     var selectCurrentWeek = function () {
        //         window.setTimeout(function () {
        //             $('.ui-weekpicker').find('.ui-datepicker-current-day a').addClass('ui-state-active').removeClass('ui-state-default');
        //         }, 1);
        //     }

        //     var setDates = function (input) {
        //         var $input = $(input);
        //         var date = $input.datepicker('getDate');
        //         var firstDay = $input.datepicker( "option", "firstDay");
        //         $input.datepicker( "option", "dateFormat", "dd-mm-yy" );
        //         $input.datepicker('option', 'firstDay', 1);
        //         if (date !== null) {
        //             var dayAdjustment = date.getDay() - firstDay;
        //             if (dayAdjustment < 0) {
        //                 dayAdjustment += 7;
        //             }
        //             startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment);
        //             endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayAdjustment + 6);
        //             $input.datepicker("setDate", startDate);
        //         }
        //     }

        //     $('.week-picker').datepicker({
        //         beforeShow: function () {
        //             $('#ui-datepicker-div').addClass('ui-weekpicker');
        //             selectCurrentWeek();
        //         },
        //         onClose: function () {
        //             $('#ui-datepicker-div').removeClass('ui-weekpicker');
        //         },
        //         showOtherMonths: true,
        //         selectOtherMonths: true,
        //         onSelect: function (dateText, inst) {
        //             setDates(this);
        //             selectCurrentWeek();
        //             $(this).change();
        //         },
        //         beforeShowDay: function (date) {
        //             var cssClass = '';
        //             if (date >= startDate && date <= endDate)
        //                 cssClass = 'ui-datepicker-current-day';
        //             return [true, cssClass];
        //         },
        //         onChangeMonthYear: function (year, month, inst) {
        //             selectCurrentWeek();
        //         }
        //     });

        //     setDates('.week-picker');

        //     var $calendarTR = $('.ui-weekpicker .ui-datepicker-calendar tr');
        //     $calendarTR.live('mousemove', function () {
        //         $(this).find('td a').addClass('ui-state-hover');
        //     });
        //     $calendarTR.live('mouseleave', function () {
        //         $(this).find('td a').removeClass('ui-state-hover');
        //     });
        // });
    })

    

