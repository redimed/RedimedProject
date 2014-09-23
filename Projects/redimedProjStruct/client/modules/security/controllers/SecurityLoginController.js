angular.module("app.security.login.controller",[
])

.controller("SecurityLoginController", function($scope, $state, $cookieStore, UserService, SecurityService, toastr){
    $scope.showClickedValidation = false;

    // SUBMIT LOGIN
    $scope.login = function(){
        $scope.showClickedValidation = true;

        if($scope.loginForm.$invalid){
            toastr.error("Please Input Your Username And Password!", "Error");
        }else{
            SecurityService.login($scope.modelUser).then(function(response){
                UserService.detail().then(function(response){
                    if(typeof response.userInfo !== 'undefined')
                        $cookieStore.put("userInfo", response.userInfo);
                    $state.go("loggedIn.home");
                });
            }, function(error){
                toastr.error("Wrong Username Or Password!", "Error");
            });
        }
    }
    // END SUBMIT LOGIN
})