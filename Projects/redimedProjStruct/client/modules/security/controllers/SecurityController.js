angular.module("app.security.controller",[
    "app.security.login.controller",
    "app.security.forgot.controller",
    "app.security.register.controller"
])

.controller("SecurityController", function($scope){
    $scope.modelUser = {
        username: "",
        password: "",
        remember: false
    }
})