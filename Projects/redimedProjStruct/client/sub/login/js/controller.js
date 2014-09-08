/**
 * Created by meditech on 8/26/2014.
 */
loginApp.controller("loginController",function($scope,$rootScope,$http,$window){
    $scope.login = function() {
        $http({
            method:"POST",
            url: "/users/login",
            data: {username: $scope.uname,
                password: $scope.pass}
        })
            .success(function (data) {

                if(data['status'] === 'success')
                {
                    $scope.msg = false;
                    $scope.err = true;
                    $rootScope.succMsg = "Login Successfully!";

                    $window.location.href = "/home";

                }
                else
                {
                    $scope.err = false;
                    $scope.msg = true;
                    $rootScope.errMsg = "Please Check Your Username And Password!";
                }
            })
            .error(function (data) {
                $scope.err = false;
                $scope.msg = true;
                $rootScope.errMsg = "Please Check Your Username And Password!";

            })
            .finally(function () {

            });
    };

});

loginApp.controller("registerController",function($scope,$http){
    $scope.register = function(){
        $http({
            method:"POST",
            url:"/users/register",
            data:{user:$scope.user}
        })
            .success(function(data) {

                if(data['status'] === 'success')
                {
                    alert("Register successfully!");
                }
                else
                {
                    alert("Register failed!");
                }
            })
            .error(function (data) {
                alert("Register failed!!!");
            })
            .finally(function() {

            });
    }
});