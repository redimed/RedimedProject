function LoginController ($scope,$http){
    $scope.login = function(req,res)
    {

        if($scope.loginForm.$valid)
        {
            var u = $scope.user;
            var name = u.name;
            var pass = u.pass;

            $http({
                method:"POST",
                url:"/users",
                data:{u:name,p:pass}
            })
                .success(function(data) {
                    //console.log(data);
                    alert(data);
                })
                .error(function (data) {
                })
                .finally(function() {
                });

        }else
        {
            $scope.loginForm.submitted = true;
        }
    }
}


