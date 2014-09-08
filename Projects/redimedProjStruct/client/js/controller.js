app.controller("homeController",function($scope,$rootScope,$http,$location,$window){
    $http.get('/menus').success(function(data){

    }).error(function(data){

    })


    $scope.logout = function(){
        $http.post('/users/logout');
        $window.location.href = "/";
    };
});