angular.module('starter.security.login.controller', []).controller('securityLoginController', function($scope, $rootScope, $state, UserService, SecurityService, localStorageService, $cordovaPush, $cordovaDialogs, $cordovaMedia, signaling, phoneCallService, $ionicPopup, $ionicLoading, $timeout, $interval) {

    signaling.removeAllListeners(); // remove all listeners socket for phone call
    $scope.modelUser.platform = ionic.Platform.platform(); // get platform for user login and insert to databse
    var hideTimeoutLoading = false; // temp variable for user not action another when login

    // Login main function
    $scope.loginApp = function() {
        if (ionic.Platform.isIOS()) {
            $scope.modelUser.token = SecurityService.getIosToken();
        } else if(ionic.Platform.isAndroid()) {
            $scope.modelUser.token = SecurityService.getandroidToken();
        }
        $scope.messageLoading = {
            message: "Signing..."
        };
        $ionicLoading.show({
            templateUrl: "modules/loadingTemplate.html",
            animation: 'fade-in',
            scope: $scope,
            maxWidth: 500,
            showDelay: 0,
        });
        SecurityService.login($scope.modelUser).then(function(response) {
            if (response.status.toLowerCase() == "success") {
                signaling.emit('updateSocketLogin', response.userInfo.id); // update socket in databse for notice user online
                if (typeof response.userInfo !== 'undefined') localStorageService.set("userInfo", response.userInfo);
                if (typeof response.companyInfo !== 'undefined') localStorageService.set("companyInfo", response.companyInfo);
                switch (response.userInfo.UserType.user_type) {
                    case "Driver":
                        $state.go('app.driver.list', null, {
                            reload: true
                        });
                        break;
                    case "Company":
                        $state.go('app.injury.info', null, {
                            reload: true
                        });
                        break;
                    case "Patient":
                        $state.go('app.injury.desInjury', null, {
                            reload: true
                        });
                        break;
                    default:
                        $state.go('app.injury.info', null, {
                            reload: true
                        });
                        break;
                }
                $timeout(function() {
                    $ionicLoading.hide();
                }, 1.5 * 1000);
                $timeout(function() {
                    if (!hideTimeoutLoading) {
                        $ionicLoading.hide();
                        $scope.popupMessage = {
                            message: "These error, please login again."
                        };
                        $ionicPopup.show({
                            templateUrl: 'modules/popup/PopUpError.html',
                            scope: $scope,
                            buttons: [{
                                text: "Ok",
                                onTap: function (e) {
                                    $state.go('security.login', null, {reload: true});
                                }
                            }]
                        })
                    }
                }, 5 * 1000);
            } else {
                sigInError();
            }
        }, function() {
            sigInError();
        });
    }

    $scope.keyPress = function(keyCode) {
        if (keyCode == '13' && $scope.modelUser.username && $scope.modelUser.password) {
            document.addEventListener("deviceready", function() {
                cordova.plugins.Keyboard.close();
            });
            $scope.loginApp();
        }
    }

    function sigInError() {
        $ionicLoading.hide();
        document.addEventListener("deviceready", function() {
            var networkState = navigator.connection.type;
            if (networkState == Connection.NONE) {
                $scope.popupMessage = {
                    message: "Check your connection and try again."
                };
                $ionicPopup.show({
                    templateUrl: 'modules/popup/PopUpError.html',
                    scope: $scope,
                    buttons: [{
                        text: "Ok"
                    }, ]
                });
            } else {
                $scope.popupMessage = {
                    message: "Invalid username or password."
                };
                $ionicPopup.show({
                    templateUrl: 'modules/popup/PopUpError.html',
                    scope: $scope,
                    buttons: [{
                        text: "Ok",
                        onTap: function (e) {
                            $state.go('security.login');
                        }
                    }, ]
                });
            }
        });
    }
});