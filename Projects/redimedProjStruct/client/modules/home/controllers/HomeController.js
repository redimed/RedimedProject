<<<<<<< HEAD

=======
>>>>>>> Luan_Branch_8/10
angular.module("app.loggedIn.home.controller",[])

.controller("HomeController", function($scope,$state,$cookieStore){


    $scope.$on('$idleTimeout', function() {
        $state.go('lockscreen');
    })
})
