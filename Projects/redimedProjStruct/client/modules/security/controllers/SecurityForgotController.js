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
                    if(data.status=='success')
                    {
                        toastr.success("Change Password Success", "Success");
                        $state.go('loggedIn.home');
                    }
                    else
                    {
                        toastr.error("Change Password Fail", "Fail");
                    }
                    
                },function(err){
                    toastr.error("Change Password Fail", "Fail");
                })
            }

        }
})