angular.module("app.loggedIn.staff.week.controller", [])

    .controller("StaffWeekController", function($rootScope,$scope, $modal, moment){
        if(!$scope.tasks){
            $scope.tasks = [];
        }

        $scope.eventAddClick = function(dateChosen,i){
            var startDate,endDate;
            startDate = new Date();
            endDate = new Date();
            startDate.setHours(7,0,0);
            endDate.setHours(14,30,0);
            var modalInstance = $modal.open({
                templateUrl: 'modules/staff/directives/templates/addModal.html',
                controller: function($scope, $modalInstance) {
                    $scope.$modalInstance = $modalInstance;
                    $scope.show = false;
                    $scope.taskModal={
                        task_name : null,
                        status: "waiting approve",
                        dateChosen : dateChosen,
                        start_time : startDate,
                        end_time : endDate
                    };
                    $scope.addTask = function(){
                        $modalInstance.close($scope.taskModal);
                    };
                }
            });
            modalInstance.result.then(function(task){
                if(!$scope.tasks[i]){
                    $scope.tasks[i] = [];
                }
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
                    $scope.taskModal = angular.copy(task);

                    $scope.addTask = function(){
                        $modalInstance.close($scope.taskModal);
                    };
                }
            });

            modalInstance.result.then(function(task){
                $scope.tasks[key][i] = task;
            })
        };


        $scope.delTask = function(i,j){
            $scope.tasks[i].splice(j,1);
        }
    })

