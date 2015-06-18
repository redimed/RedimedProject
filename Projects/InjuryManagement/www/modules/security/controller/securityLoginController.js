angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $rootScope, $state, UserService, SecurityService,
                                                   localStorageService, $cordovaPush, $cordovaDialogs,
                                                   $cordovaMedia, signaling, phoneCallService, $ionicPopup, $ionicLoading, $timeout){
        $scope.notifications = [];
        $scope.modelUser.platform = ionic.Platform.platform();

        signaling.removeListener('isError');
        signaling.on('isError', function () {
            $ionicLoading.hide();
            document.addEventListener("deviceready", function() {
                if(!ionic.Platform.isIOS()) {
                    cordova.plugins.Keyboard.close();
                }
            });
            $scope.popupMessage = {message: "Can't login, because account is using, push out!"};
            $ionicPopup.show({
                templateUrl: 'modules/popup/PopUpConfirm.html',
                scope: $scope,
                buttons: [
                    {
                        text: "Ok",
                        onTap: function(e) {
                            signaling.emit('forceLogin', $scope.modelUser.username);
                        }
                    },
                    {
                        text: 'Cancel',
                        type: 'btn-cancel-popUp'
                    }

                ]
            })
        });

        signaling.on('isSuccess', function () {
            sigInApp();
        });

        // SUBMIT LOGIN
        $scope.loginApp = function() {
            if(ionic.Platform.isIOS()) {
                $scope.modelUser.token = SecurityService.getIosToken();
            }
            $scope.messageLoading = {message: "Signing..."};
            $ionicLoading.show({
                templateUrl: "modules/loadingTemplate.html",
                animation: 'fade-in',
                scope: $scope,
                maxWidth: 500,
                showDelay: 0
            });
            console.log($scope.modelUser);
            SecurityService.login($scope.modelUser).then(function(response) {
                signaling.emit('checkLogin', $scope.modelUser.username);
            }, function(error) {
                $ionicLoading.hide();
                document.addEventListener("deviceready", function() {
                    var networkState = navigator.connection.type;
                    if(networkState == Connection.NONE) {
                        $scope.popupMessage = {message : "Check your connection and try again."};
                        $ionicPopup.show({
                            templateUrl: 'modules/popup/PopUpError.html',
                            scope: $scope,
                            buttons: [
                                { text: "Ok" },
                            ]
                        });
                    } else {
                        $scope.popupMessage = {message : "Invalid username or password."};
                        $ionicPopup.show({
                            templateUrl: 'modules/popup/PopUpError.html',
                            scope: $scope,
                            buttons: [
                                { text: "Ok" },
                            ]
                        });
                    }
                });
            });
        }

        $scope.keyPress = function(keyCode) {
            if(keyCode == '13' && $scope.modelUser.username && $scope.modelUser.password){
                document.addEventListener("deviceready", function() {
                    cordova.plugins.Keyboard.close();
                });
                $scope.loginApp();
            }
        }

        function sigInApp() {
            SecurityService.login($scope.modelUser).then(function(response) {
                signaling.emit('updateSocketLogin', response.userInfo.user_name);
                signaling.on('login_success',function(){
                    UserService.detail().then(function(response) {
                        if(typeof response.userInfo !== 'undefined')
                            localStorageService.set("userInfo", response.userInfo);

                        if(typeof response.companyInfo !== 'undefined')
                            localStorageService.set("companyInfo", response.companyInfo);

                        switch (response.userInfo.UserType.user_type) {
                            case "Driver":
                                $state.go('app.driver.list', null, {reload:true});
                                break;
                            case "Company":
                                $state.go('app.injury.info', null, {reload:true});
                                break;
                            default :
                                $state.go('app.injury.info', null, {reload:true});
                                break;
                        }
                        $timeout(function(){
                            $ionicLoading.hide();
                        }, 1.5 * 1000);
                    });
                })
            }, function(error) {
                $ionicLoading.hide();
                console.log(error);
                $scope.popupMessage = {message : "Please check your information."};
                $ionicPopup.show({
                    templateUrl: 'modules/popup/PopUpError.html',
                    scope: $scope,
                    buttons: [
                        { text: "Ok" },
                    ]
                });
            });
        }
    });