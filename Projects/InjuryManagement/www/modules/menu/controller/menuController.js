angular.module("starter.menu.controller",[])
    .controller("menuController",function($scope,localStorageService){
        $scope.logout = function(){
            localStorageService.remove('userInfo');
        }
    })