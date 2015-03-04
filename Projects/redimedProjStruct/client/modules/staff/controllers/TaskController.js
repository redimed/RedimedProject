angular.module("app.loggedIn.staff.task.controller", [])
    .controller("ManageTaskController", function($rootScope,$scope,$filter,$state,toastr, $modal, moment, StaffService, ConfigService){

        $scope.taskList = [];
        $scope.taskListTemp = [];
        $scope.testDate = null;
        $scope.testTime = new Date();

        $scope.maxDate = new Date();

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.taskPerPage = 10;

        $scope.statusCount = {
            all:0,
            waiting:0,
            approved:0,
            overdue:0,
            rejected:0,
            progress:0,
            success:0
        };

        $scope.filterByStatus = function(status){

            switch(status){
                case 'all':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        $scope.taskList.push($scope.taskListTemp[i]);
                    }

                    break;
                case 'waiting':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        if($scope.taskListTemp[i].STATUS.toLowerCase() == 'waiting approve')
                            $scope.taskList.push($scope.taskListTemp[i]);
                    }
                    break;
                case 'approved':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        if($scope.taskListTemp[i].STATUS.toLowerCase() == 'approved')
                            $scope.taskList.push($scope.taskListTemp[i]);
                    }
                    break;
                case 'rejected':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        if($scope.taskListTemp[i].STATUS.toLowerCase() == 'rejected')
                            $scope.taskList.push($scope.taskListTemp[i]);
                    }
                    break;
                case 'success':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        if($scope.taskListTemp[i].STATUS.toLowerCase() == 'success')
                            $scope.taskList.push($scope.taskListTemp[i]);
                    }
                    break;
                case 'progress':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        if($scope.taskListTemp[i].STATUS.toLowerCase() == 'in progress')
                            $scope.taskList.push($scope.taskListTemp[i]);
                    }
                    break;
                case 'overdue':
                    $scope.taskList = [];
                    for(var i=0; i<$scope.taskListTemp.length; i++)
                    {
                        if($scope.taskListTemp[i].STATUS.toLowerCase() == 'overdue')
                            $scope.taskList.push($scope.taskListTemp[i]);
                    }
                    break;
            }
            var begin = (($scope.currentPage - 1) * $scope.taskPerPage)
                , end = begin + $scope.taskPerPage;
            $scope.taskList = $scope.taskList.slice(begin, end);
        }

        getTaskList();



        $scope.$watch('currentPage + taskPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.taskPerPage)
                , end = begin + $scope.taskPerPage;

            $scope.taskList = $scope.taskListTemp.slice(begin, end);
        });

        function getTaskList(){
            StaffService.getTaskList().then(function(rs){
                if(rs.status.toLowerCase() == 'success')
                {
                    $scope.totalTask = rs.data.length;

                    $scope.statusCount.all = rs.data.length;

                    for(var i=0; i<rs.data.length;i++)
                    {
                        rs.data[i].num = i+1;
                        rs.data[i].startTime = ConfigService.convertStringToDate(rs.data[i].start_time);
                        rs.data[i].endTime = ConfigService.convertStringToDate(rs.data[i].end_time);

                        var status = rs.data[i].STATUS.toLowerCase();

                        switch(status){
                            case 'waiting approve':
                                $scope.statusCount.waiting += 1;
                                break;
                            case 'approved':
                                $scope.statusCount.approved += 1;
                                break;
                            case 'rejected':
                                $scope.statusCount.rejected += 1;
                                break;
                            case 'success':
                                $scope.statusCount.success += 1;
                                break;
                            case 'in progress':
                                $scope.statusCount.progress += 1;
                                break;
                            case 'overdue':
                                $scope.statusCount.overdue += 1;
                                break;
                        }

                    }

                    $scope.taskListTemp = rs.data;

                    $scope.pageNum =
                        Math.ceil($scope.taskListTemp.length / $scope.taskPerPage);

                    var begin = (($scope.currentPage - 1) * $scope.taskPerPage)
                        , end = begin + $scope.taskPerPage;

                    $scope.taskList = $scope.taskListTemp.slice(begin, end);
                }
            })
        }



    })



