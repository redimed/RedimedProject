angular.module("app.loggedIn.staff.week.controller", [])

    .controller("StaffWeekController", function($rootScope,$scope,$filter,$state,toastr, $modal, moment, StaffService, ConfigService){
        if(!$scope.tasks){
            $scope.tasks = [];
        }

        var departmentList,locationList,activityList;

        var startDate,endDate,flag;

        StaffService.getDepartmentLocation().then(function(response){
            if(response['status'] == 'fail' || response['status'] == 'error'){
                toastr.error("Error", "Error");
                $state.go('loggedIn.TimeSheetHome.list', null, {'reload': true});
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
                $scope.tasks[i].task_time = 0;
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
                var offset = task.endDate - task.startDate;
                $scope.tasks[i].task_time += Math.round(offset / 1000 / 60/ 30);
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
                        $state.go('loggedIn.TimeSheetHome.list', null, {'reload': true});
                    }else
                    {
                        toastr.error("Error", "Error");
                    }
                })
            }
        }
    })

