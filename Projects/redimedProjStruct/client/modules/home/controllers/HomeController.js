
angular.module("app.loggedIn.home.controller",[])

.controller("HomeController", function($scope,$state,$cookieStore){


    $scope.$on('$idleTimeout', function() {
        $state.go('lockscreen');
    })
})
