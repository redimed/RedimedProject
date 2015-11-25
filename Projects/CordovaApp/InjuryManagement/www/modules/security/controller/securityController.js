angular.module('starter.security.controller', ['starter.security.login.controller', 'starter.security.forgot.controller', 'starter.security.register.controller']).controller('securityController', function($scope) {
    $scope.modelUser = {
        username: "",
        password: "",
        remember: false,
        token: "",
        platform: ""
    }
})