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

