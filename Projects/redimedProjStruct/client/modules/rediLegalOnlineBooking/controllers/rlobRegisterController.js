angular.module('app.rlobRegister.controller',[])
    .controller("rlobRegisterController", function($scope, $state, $cookieStore, SecurityService, rlobService,toastr) {
    	$scope.register = function(){
            $scope.user.username=$scope.user.email;
            var checkmail = '';
            var checkuser='';
            $scope.showClickedValidation = true;
            if($scope.registerForm.$invalid){
                toastr.error("Please check form.", "Error");
                //console.log("1");
            }else{
                SecurityService.checkEmail($scope.user.email).then(function(data){
                    checkmail = data;
                    //console.log(checkmail);
            }).then(function(){
                        if(checkmail.length > 0){
                            console.log(checkmail.length);
                            $scope.showClickedValidation = true;
                            toastr.error("Email da Ton Tai", "Error");
                            $scope.check = true;
                        }else{
                            SecurityService.checkUserName($scope.user.username).then(function(data){
                                checkuser = data;

                            }).then(function(){
                                if(checkuser.length >0){
                                    console.log(checkuser);
                                    $scope.showClickedValidation = true;
                                    toastr.error("Username da Ton Tai", "Error");
                                }else{
                                    var user =
                                    {
                                        fullName: $scope.user.fname +' '+ $scope.user.lname,
                                        email:$scope.user.email,
                                        userName: $scope.user.username,
                                        password: $scope.user.password,
                                        phone: $scope.user.phone,
                                        companyId: $scope.user.companyId,
                                        companyState:$scope.user.companyState,
                                        isAccessReportOnline:$scope.user.isAccessReportOnline?$scope.user.isAccessReportOnline:0
                                    };

                                    console.log(user);
                                    rlobService.insertNewUser(user).then(function(data){
                                        if(data.status=='success')
                                        {
                                            console.log(data);
                                            toastr.success("Register Success!","Success");
                                            $state.go('loggedIn.home');
                                        }
                                        
                                    })
                                }
                            })

                        }
                    })





            }
        };

        $scope.companyList = [];
        SecurityService.company().then(function(response){
            $scope.companyList = response;
        })

        $scope.stateList=[];
        rlobService.getStates('Australia')
        .then(function(data){
            if(data.status=='success')
            {
                $scope.stateList=data.data;
            }
            else
            {
                $scope.stateList=[];
            }
        });
});