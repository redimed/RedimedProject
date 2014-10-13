
angular.module('app.loggedIn.document.gorgonFA.controllers',[])
    .controller("gorgonFAController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,toastr) {

        $scope.maxDate = new Date();

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.submit = function(){
            var info = $scope.info;
        };

        $scope.print = function(){

        }
    });