angular.module('starter.security.forgot.controller',[])

    .controller('securityForgotController',function($scope, $state, SecurityService,
                                                    $ionicPopup, $ionicLoading){

        $scope.objForgotpass = {};

        $scope.submitResetPassword = function(){
            $scope.messageLoading = {message: "Waiting..."};
            $ionicLoading.show({
                templateUrl: "modules/loadingTemplate.html",
                animation: 'fade-in',
                scope: $scope,
                maxWidth: 500,
                showDelay: 0
            });
            SecurityService.forgotPass($scope.objForgotpass.email).then(function(data){
                if(data.status !== null) {
                    $ionicLoading.hide();
                    if(data.status.toLowerCase() == 'success') {
                        $scope.popupMessage = { message: "We've e-mailed you instructions for setting your password to " +
                        "the e-mail address you submitted. You should be receiving it shortly."}
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpSuccess.html",
                            scope: $scope,
                            buttons: [
                                {
                                    text: "Ok",
                                    opTap: function() {
                                        $state.go('security.login', {reload: true});
                                    }
                                }
                            ]
                        });
                    } else {
                        $scope.popupMessage = { message: "That e-mail address doesn't have an associated " +
                        "user account. Are you sure you've registered?"}
                        $ionicPopup.show({
                            templateUrl: "modules/popup/PopUpConfirm.html",
                            scope: $scope,
                            buttons: [
                                { text: "Ok" },
                                {   text: "Cancel",
                                    type: 'btn-cancel-popUp'
                                },
                            ]
                        });
                    }
                }
            })
        }
    })