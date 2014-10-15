/**
 * Created by HUYNHAN on 9/25/2014.
 */
angular.module('app.loggedIn.document.form18.controllers',[])
    .controller("form18Controller",function($scope,$state,$rootScope,$http,$cookieStore) {
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.submit = function(){
            var info = $scope.info;
        };


    });