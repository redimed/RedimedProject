angular.module('app.loggedIn.document.demo.controllers',[])
    .controller("demoController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,toastr) {

        $scope.patients = {};
        $scope.maxDate = new Date();

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.setID = function(id)
        {
            
        };

        DocumentService.loadPatient().then(function(response){
            if(response[status] != 'fail'){
                $scope.patients = response;
            }else
            {
                toastr.error("loading fail");
            }
        })

    })