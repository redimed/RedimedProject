/**
 * Created by meditech on 23/09/2014.
 */
angular.module("app.security.register.controller",[
])
.controller('SecurityRegisterController',function($scope, $state, $cookieStore, SecurityService, toastr){

        $scope.register = function(){
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
                                        Booking_Person: $scope.user.fname + $scope.user.lname,
                                        Contact_email:$scope.user.email,
                                        user_name: $scope.user.username,
                                        password: $scope.user.password,
                                        Contact_number: $scope.user.phone,
                                        company_id: $scope.user.companyId

                                    };

                                    console.log(user);
                                    SecurityService.regNewUser(user).then(function(data){
                                        console.log(data);
                                        toastr.success("Register Success!","Success");
                                        $state.go('loggedIn.home');
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
    })