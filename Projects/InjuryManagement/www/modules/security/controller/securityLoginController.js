angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $rootScope, $state, UserService, SecurityService,
                                                   localStorageService, $cordovaPush, $cordovaDialogs,
                                                   $cordovaMedia, signaling, phoneCallService, $ionicPopup, $ionicLoading, $timeout){
        $scope.notifications = [];

        $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
            localStorageService.set("notificationLS", notification);
            if (ionic.Platform.isAndroid()) {
                handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.alert));
                })
            }
        });

        //Android.
        function handleAndroid(notification) {
            if (notification.event == "registered") {
                $scope.modelUser.token = notification.regid;
                $scope.modelUser.platform = ionic.Platform.platform();
            }
        }

        //iOS.
        function handleIOS(notification) {
            if (notification.event == "registered") {
                $scope.modelUser.token = notification.regid;
                $scope.modelUser.platform = ionic.Platform.platform();
            }
            if (notification.foreground == "1") {
                if (notification.sound) {
                    var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                    mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
                }

                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

                if (notification.badge) {
                    $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                        console.log("Set badge success " + result)
                    }, function (err) {
                        console.log("Set badge error " + err)
                    });
                }
            }
            else {
                if (notification.body && notification.messageFrom) {
                    $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
                }
                else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
            }
        }

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
            $scope.messageLoading = {message: "Signing..."};
            $ionicLoading.show({
                templateUrl: "modules/loadingTemplate.html",
                animation: 'fade-in',
                scope: $scope,
                maxWidth: 500,
                showDelay: 0
            });
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