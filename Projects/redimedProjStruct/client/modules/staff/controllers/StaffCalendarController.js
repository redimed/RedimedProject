angular.module("app.loggedIn.staff.calendar.controller", [])

    .controller("StaffCalendarController", function($rootScope,$scope, ConfigService, $modal, moment,StaffService,$state,toastr){
        var currentYear = moment().year();
        var currentMonth = moment().month();

        var departmentList,locationList,activityList;
        var month;
        month = currentMonth + 1;
        if(month < 10){
            month = '0' + month;
        }

        StaffService.getDepartmentLocation().then(function(response){
            if(response['status'] == 'fail' || response['status'] == 'error'){
                toastr.error("Error", "Error");
                $state.go('loggedIn.staff.list', null, {'reload': true});
            }else
            {
                departmentList = response['department'];
                locationList = response['location'];
                activityList = response['activity'];
            }
        })

        StaffService.getAllTaskAMonth(currentYear,month).then(function(response){
            if(response['status'] == 'fail' || response['status'] == 'error'){
                toastr.error("Error", "Error");
            }else
            {
                $scope.events = response;
                angular.forEach($scope.events, function(event){
                    event.start_time = ConfigService.convertStringToDate(event.start_time);
                    event.end_time = ConfigService.convertStringToDate(event.end_time);
                })
            }
        })

        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();

        function showModal(action, event) {
            $modal.open({
                templateUrl: 'modules/staff/directives/templates/addModal.html',
                controller: function($scope, $modalInstance) {
                    $scope.$modalInstance = $modalInstance;
                    $scope.action = action;
                    $scope.event = event;
                }
            });
        }

        $scope.eventClicked = function(event) {
            showModal('Clicked', event);
        };

        $scope.eventEdited = function(event) {
            console.log(event);
            var modalInstance = $modal.open({
                templateUrl: 'modules/staff/directives/templates/addModal.html',
                controller: function($scope,$modalInstance){
                    $scope.$modalInstance = $modalInstance;
                    $scope.departments = departmentList;
                    $scope.activities = activityList;
                    $scope.locations = locationList;
                    $scope.taskModal={
                        tasks_id: event.tasks_id,
                        task_name : event.task,
                        dateChosen : event.date,
                        task_department: event.department_code_id,
                        task_location: event.location_id,
                        task_activity: event.activity_id,
                        startDate : event.start_time,
                        endDate : event.end_time,
                        start_time : event.start_time,
                        end_time : event.end_time
                    };
                    $scope.addTask = function(){
                        $modalInstance.close($scope.taskModal);
                    };
                }
            });

            modalInstance.result.then(function(task){
                StaffService.editTask(task).then(function(response){
                    if(response['status'] == 'fail' || response['status'] == 'error'){
                        toastr.error("Error", "Error");
                    }else
                    {
                        toastr.success("success", "success");
                        $state.go('loggedIn.staff.list', null, {'reload': true});
                    }
                })
            })
        };

        $scope.eventDeleted = function(event) {
            showModal('Deleted', event);
        };

        $scope.setCalendarToToday = function() {
            $scope.calendarDay = new Date();
        };

        $scope.toggle = function($event, field, event) {
            $event.preventDefault();
            $event.stopPropagation();

            event[field] = !event[field];
        };
    })