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
        $scope.userID = $cookieStore.get("userInfo").id;

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
            $scope.info.userID = $scope.userID;
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
                    $scope.checkTaskWeek($scope.calendarDay)
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
            console.log(task);
            var modalInstance = $modal.open({
                templateUrl: "modules/staff/views/itemModal.html",
                controller:'ItemController',
                size:'md'
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

    .controller("ItemController", function($rootScope,$scope, $filter, ConfigService,$modalInstance, $modal,calendarHelper, moment,StaffService,$state,toastr){
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

    })

