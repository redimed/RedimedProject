angular.module("app.security.forgot.controller",[
])

.controller("SecurityForgotController", function($scope,toastr,$state,SecurityService){
        $scope.forgotPass = function(){
            $scope.showClickedValidation = true;
            if($scope.forgetForm.$invalid){
                toastr.error("Please input email.", "Error");
            }
            else{
                SecurityService.forgotPass($scope.email).then(function(data){
                    toastr.success("Forgot Password Success", "Success");
                    $state.go('loggedIn.home');
                })
            }

        }
})