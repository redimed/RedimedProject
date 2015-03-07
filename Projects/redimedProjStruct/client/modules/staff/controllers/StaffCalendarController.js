angular.module("app.loggedIn.staff.calendar.controller", [])

    .controller("StaffCalendarController", function($rootScope,$scope, $filter, ConfigService, $modal,calendarHelper, moment,StaffService,$state,toastr){
        var currentYear = moment().year();
        var currentMonth = moment().month();
        $scope.test = 'dd';
        if(!$scope.tasks){
            $scope.tasks = [];
        }

        var startWeek,
            task;

        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();
        $scope.preDay = moment($scope.calendarDay).subtract(1, 'month').toDate();
        $scope.nextDay = moment($scope.calendarDay).add(1, 'month').toDate();

        StaffService.getDepartmentLocation().then(function(response){
            if(response['status'] == 'fail' || response['status'] == 'error'){
                toastr.error("Error", "Error");
                $state.go('loggedIn.home', null, {'reload': true});
            }else
            {
                $scope.departments = response['department'];
                $scope.locations = response['location'];
                $scope.activities = response['activity'];
                $scope.viewWeek = calendarHelper.getWeekView($scope.calendarDay, true);
                checkTaskWeek($scope.viewWeek.startWeek);
                getTaskMonth(currentYear,currentMonth);
            }
        })

        function checkTaskWeek(date){
            startWeek = $filter('date')(date, 'yyyy-MM-dd');
            console.log(startWeek);
            StaffService.checkTaskWeek(startWeek).then(function(response){
                if(response['status'] == 'fail' || response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else
                {
                    if(response['data'] != 'no'){
                        angular.forEach(response['data'], function(data){
                            $scope.tasks.push(data);
                        })
                    }else{
                        date = new Date(date.substr(8,2),date.substr(0,4),date.substr(5,2)-1)
                        $scope.viewWeek = calendarHelper.getWeekView(date, true);
                        angular.forEach($scope.viewWeek, function(data){
                            task={
                                task : null,
                                dateChosen : data.dateChosen,
                                task_department: null,
                                task_location: null,
                                task_activity: null,
                                task_time: null
                            };
                            $scope.tasks.push(task);
                        })
                    }
                }
            })
        }

        var dateFrom;
        $scope.changeDate = function(){
            dateFrom = new Date($scope.dateWeekFrom.substr(6,4),$scope.dateWeekFrom.substr(3,2) - 1,$scope.dateWeekFrom.substr(0,2));
            console.log(dateFrom);
            checkTaskWeek(dateFrom);
        }

        function getTaskMonth(currentYear,currentMonth){
            StaffService.getAllTaskAMonth(currentYear,currentMonth).then(function(response){
                if(response['status'] == 'error'){
                    toastr.error("Error", "Error");
                }else if(response['status'] == 'no task' ){
                    toastr.error("no task", "Error");
                }else
                {
                    $scope.events = response;
                }
            })
        }


        var startDate,endDate,flag;
        $scope.delTask = function(i,j){
            $scope.tasks[i].splice(j,1);
        }

        $scope.addAllTask = function(startWeek, endWeek)
        {
            flag = true;
            var i = 0;
            for(var task in $scope.tasks){
                i++;
                if($scope.tasks[task].task_time < 15)
                {
                    flag = false;
                }
            }
            console.log("i: " + i + " flag: " + flag);
            if(flag == false){
                toastr.error("You must enter 7.5 hours per day", "Error");
            }else if (i < 5)
            {
                toastr.error("You must enter Monday - Friday", "Error");
            }else{
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
        }

        /*
         *	SEARCH ITEM
         */
        $scope.itemSearchPanel = {}

        $scope.itemSearch = {
            is_show: false,
            open: function() {
                this.is_show = true;
            },
            close: function() {
                this.is_show = false;
            },
            click: function(item) {
                console.log(item);

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


        $scope.setCalendarToToday = function() {
            $scope.calendarDay = new Date();
        };

        $scope.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();

            event[field] = !event[field];
        };

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

