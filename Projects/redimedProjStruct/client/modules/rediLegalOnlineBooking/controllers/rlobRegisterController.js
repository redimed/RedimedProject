angular.module('app.rlobRegister.controller',[])
    .controller("rlobRegisterController", function($scope, $state, $cookieStore, SecurityService, rlobService,toastr) {
        $scope.user={};
        $scope.register = function(){
            $scope.$broadcast('show-errors-check-validity');
            $scope.user.username=$scope.user.email;
            var checkuser='';
            $scope.showClickedValidation = true;
            if($scope.registerForm.$invalid){
                toastr.error("Please check form.", "Error");
                //console.log("1");
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
                            companyTemp: $scope.user.companyTemp,
                            companyState:$scope.user.companyState,
                            isAccessReportOnline:$scope.user.isAccessReportOnline?$scope.user.isAccessReportOnline:0,
                            fname: $scope.user.fname,
                            lname: $scope.user.lname
                        };

                        console.log(user);
                        rlobService.insertNewUser(user).then(function(data){
                            if(data.status=='success')
                            {
                                console.log(data);
                                toastr.success("Register Success!","Success");
                                angular.element('#form-data').css('display','none');
                                angular.element('#data-success').css('display','block');
                                for (var i = 0; i < $scope.stateList.length; i++) {
                                    if ( $scope.user.companyState == $scope.stateList[i].id  ) {
                                        $scope.companyStateName = $scope.stateList[i].State;
                                        // console.log($scope.companyStateName)
                                    };                                
                                };
                                
                            }else{
                                toastr.error("Register Failed!","Error");
                            }
                            
                        })
                    }
                })
            }
        };

        // $scope.companyList = [];
        // SecurityService.company().then(function(response){
        //     $scope.companyList = response;
        // })

        $scope.stateList=[];
        rlobService.getStates('Australia')
        .then(function(data){
            if(data.status=='success')
            {
                $scope.stateList=data.data;
                console.log($scope.stateList);
            }
            else
            {
                $scope.stateList=[];
            }
        });
});