angular.module('starter.security.forgot.controller',[])

.controller('securityForgotController',function($scope,$state,SecurityService){


        $scope.forgotPass = function(){
            SecurityService.forgotPass($scope.email).then(function(data){
                alert('success');
                $state.go('security.login');
            })
        }
    })