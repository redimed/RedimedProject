app.controller("homeController",function($scope,$rootScope,$http,$location,$window){
    $scope.logout = function(){
        $http.post('/users/logout');
        $window.location.href = "/";
    };
});