/**
 * Created by meditech on 8/26/2014.
 */
app.controller("loginController",function($scope,$rootScope,$http,$location){
    $scope.login = function() {
        $http({
            method: "POST",
            url: "/users/login",
            data: {uname: $scope.user,
                    pass: $scope.pass}
        })
            .success(function (data) {

                if(data['status'] === 'success')
                {
                    $rootScope.message = data['msg'];
                    $http.get("/home").success(function(data){console.log("Redirect to home.html")});

                }
            })
            .error(function (data) {
                alert("Login Failed!");

            })
            .finally(function () {

            });
    };

});

app.controller("registerController",function($scope,$http){
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