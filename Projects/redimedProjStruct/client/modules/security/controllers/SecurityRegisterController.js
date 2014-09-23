/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.security.register.controller",[
])
.controller('SecurityRegisterController',function($scope, $state, $cookieStore, SecurityService, toastr){
        $scope.companyList = [];

        SecurityService.company().then(function(response){
            $scope.companyList = response;
        })
    })