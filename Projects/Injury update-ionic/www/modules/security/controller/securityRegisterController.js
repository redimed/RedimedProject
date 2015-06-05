angular.module('starter.security.register.controller',[])

    .controller('securityRegisterController', function($scope, $state, InjuryServices, SecurityService, ConfigService, $ionicPopup){

        $scope.titleIndex = ConfigService.title_option();
        $scope.sexIndex = ConfigService.sex_option();
        $scope.userInfo = {};

        $scope.submitRegister = function() {
            console.log($scope.userInfo);
            $scope.userInfo.dob = new Date($scope.userInfo.dob);
            SecurityService.signup($scope.userInfo).then(function (res){
                if(res.status.toLowerCase() == 'success') {
                    $scope.popupMessage = { message:"Register success!" };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpSuccess.html",
                        scope: $scope,
                        buttons: [
                            {
                                text: "Ok",
                                onTap: function() {
                                    $state.go('security.login', null, {reload: true});
                                }
                            }
                        ]
                    });
                } else {
                    $scope.popupMessage = { message:"Register failed! Please try again" };
                    $ionicPopup.show({
                        templateUrl: "modules/popup/PopUpError.html",
                        scope: $scope,
                        buttons: [
                            {
                                text: "Ok",
                                type: "button button-assertive"
                            }
                        ]
                    });
                }
            })
        }

        $scope.validEmail = function() {
            InjuryServices.checkEmail($scope.userInfo.email).then(function (data) {
                if(typeof $scope.userInfo.email == 'undefined') {
                    //$scope.iconLoadingMail = true;
                    //$scope.iconSuccessMail = false;
                    //$scope.iconErrorMail = false;
                    //$timeout(function(){
                    //    $scope.iconLoadingMail = false;
                    //    $scope.iconSuccessMail = false;
                    //}, 10 * 1000);
                } else {
                    console.log('success data ');
                    if (data.status == 'success')
                    {
                        //    $scope.iconLoadingMail = false;
                        //    if (data.data.length == 0) {
                        //        $scope.iconSuccessMail = true;
                        //        $scope.isFailEmail = false;
                        //    }
                        //    else {
                        //        $scope.iconErrorMail = true;
                        //        $scope.isFailEmail = true;
                        //    }
                    }
                }
            })
        }
    })