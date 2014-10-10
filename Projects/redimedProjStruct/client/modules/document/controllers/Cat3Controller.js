
angular.module('app.loggedIn.document.cat3.controllers',[])
    .controller("Cat3Controller",function($scope,$rootScope,$http,$cookieStore) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.submit = function(){
            var info = $scope.info;
        };
    });