angular.module("app.loggedIn.staff.week.controller", [])

    .controller("StaffWeekController", function($rootScope,$scope,$filter,$state,toastr, $modal, moment, StaffService, ConfigService){
        if(!$scope.tasks){
            $scope.tasks = [];
        }

        var departmentList,locationList,activityList;

        var startDate,endDate;

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

        $scope.eventAddClick = function(dayChosen,dateChosen,i){
            startDate = angular.copy(dateChosen);
            endDate = angular.copy(dateChosen);
            if(!$scope.tasks[i]){
                $scope.tasks[i] = [];
                startDate.setHours(7,0,0);
            }else if($scope.tasks[i].length == 0){
                startDate.setHours(7,0,0);
            }else{
                startDate = $scope.tasks[i][$scope.tasks[i].length - 1].endDate;
            }
            endDate.setHours(16,30,0);
            var modalInstance = $modal.open({
                templateUrl: 'modules/staff/directives/templates/addModal.html',
                controller: function($scope, $modalInstance) {
                    $scope.$modalInstance = $modalInstance;
                    $scope.departments = departmentList;
                    $scope.activities = activityList;
                    $scope.locations = locationList;
                    $scope.show = false;
                    $scope.dayChosen = dayChosen;
                    $scope.taskModal={
                        task_name : null,
                        dateChosen : dateChosen,
                        task_department: null,
                        task_location: null,
                        task_activity: null,
                        startDate : startDate,
                        endDate : endDate,
                        start_time : null,
                        end_time : null
                    };
                    $scope.addTask = function(){
                        $modalInstance.close($scope.taskModal);
                    };
                }
            });
            modalInstance.result.then(function(task){
                task.start_time = ConfigService.getCommonDatetime(task.startDate);
                task.end_time = ConfigService.getCommonDatetime(task.endDate);
                $scope.tasks[i].push(task);
            })
        };

        $scope.eventEditClick = function(key,i){
            var t = $scope.tasks[key][i];
            var modalInstance = $modal.open({
                templateUrl: 'modules/staff/directives/templates/addModal.html',
                resolve: {
                    task: function(){
                        return t;
                    }
                },
                controller: function($scope,$modalInstance,task){
                    $scope.$modalInstance = $modalInstance;
                    $scope.departments = departmentList;
                    $scope.activities = activityList;
                    $scope.locations = locationList;
                    $scope.taskModal = angular.copy(task);
                    $scope.addTask = function(){
                        $modalInstance.close($scope.taskModal);
                    };
                }
            });

            modalInstance.result.then(function(task){
                task.start_time = ConfigService.getCommonDatetime(task.startDate);
                task.end_time = ConfigService.getCommonDatetime(task.endDate);
                $scope.tasks[key][i] = task;
            })
        };


        $scope.delTask = function(i,j){
            $scope.tasks[i].splice(j,1);
        }

        $scope.addAllTask = function(startWeek, endWeek)
        {
            StaffService.addAllTask($scope.tasks,startWeek, endWeek).then(function(response){
                if(response['status'] == 'success'){
                    toastr.success("success","Success");
                }else
                {
                    toastr.error("Error", "Error");
                }
            })
        }
    })

