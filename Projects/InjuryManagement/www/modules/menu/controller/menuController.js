angular.module("starter.menu.controller",[])
    .controller("menuController",function($scope,localStorageService,$state){
        $scope.logout = function(){
            localStorageService.remove('userInfo');
            $state.go("security.login");
        }
    })