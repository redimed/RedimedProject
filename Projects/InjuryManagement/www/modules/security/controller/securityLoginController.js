angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $rootScope, $state, UserService, SecurityService,
                                                   localStorageService, $cordovaPush, $cordovaDialogs,
                                                   $cordovaMedia, signaling, phoneCallService, $ionicPopup, $ionicLoading, $ionicPlatform){
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

        signaling.on('isError', function () {
            $ionicLoading.hide();
            document.addEventListener("deviceready", function() {
                cordova.plugins.Keyboard.close();
            });
            $scope.popupMessage = {message: "Can't login. Because account is using!"};
            $ionicPopup.show({
                templateUrl: 'modules/popup/PopUpConfirm.html',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' },
                    {
                        text: '<span>Yes, push out!</span>',
                        type: 'button button-assertive',
                        onTap: function(e) {
                            signaling.emit('forceLogin', $scope.modelUser.username);
                        }
                    }
                ]
            })
            //$scope.popupMessage = {message: "Can't login. Because account is using!"};
            //$ionicPopup.confirm({
            //    templateUrl: 'modules/popup/PopUpConfirm.html',
            //    scope: $scope
            //}).then( function(result) {
            //    if(result){
            //        signaling.emit('forceLogin', $scope.modelUser.username);
            //    }
            //})
        });

        signaling.on('isSuccess', function () {
            sigInApp();
        });

        // SUBMIT LOGIN
        $scope.loginApp = function() {
            $ionicLoading.show({
                template: "<div class='icon ion-ios7-reloading'></div>"+
                "<br />"+
                "<span>Signing...</span>",
                animation: 'fade-in',
                showBackdrop: true,
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
                //$ionicPopup.alert({
                //    title: "Can't Login",
                //    template: 'Invalid Username or fPassasdfasdfword!'
                //})
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
            $ionicLoading.show({
                template: "<div class='icon ion-ios7-reloading'></div>"+
                "<br />"+
                "<span>Signing...</span>",
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 0
            });
            SecurityService.login($scope.modelUser).then(function(response) {
                // signaling.emit('login_successful', response.userInfo.id, response.userInfo.user_name);
                signaling.emit('updateSocketLogin', response.userInfo.user_name);
                signaling.on('login_success',function(){
                    UserService.detail().then(function(response) {

                        if(typeof response.userInfo !== 'undefined')
                            localStorageService.set("userInfo", response.userInfo);



                        if(typeof response.companyInfo !== 'undefined')
                            localStorageService.set("companyInfo", response.companyInfo);

                        if(response.userInfo['function_mobile'] != null){
                            UserService.getFunction(response.userInfo['function_mobile']).then(function(data) {
                                var rs = data.definition.split('(');
                                if(rs[0] != null)
                                {
                                    if(rs[1] != null)
                                    {
                                        var r = rs[1].split(')');
                                        var params = eval("("+r[0]+")");

                                        $state.go(rs[0],params,{reload:true});
                                    }
                                    else
                                    {
                                        $state.go(rs[0],{reload:true});
                                    }
                                }
                            })
                        }
                        else
                        {
                            if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                            {
                                $ionicLoading.hide();
                                $state.go('app.driver.list');
                            }
                            else if(localStorageService.get("userInfo").UserType.user_type == "Company")
                            {
                                $ionicLoading.hide();
                                $state.go('app.injury.info');
                            }
                            else {
                                $ionicLoading.hide();
                                $state.go('app.injury.info');
                            }
                        }
                        $ionicLoading.hide();
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
                //$ionicPopup.alert({
                //    title: "Can't Login",
                //    template: 'Please Check Your Information!'
                //})
            });
        }

        $scope.demoShowpopup = function() {
            $scope.popupMessage = { message: "Please select patient, before using Bluetooth." };
            $ionicPopup.show({
                templateUrl: "modules/popup/PopUpError.html",
                scope: $scope,
                buttons: [
                    { text: "Ok" }
                ]
            });
        }
    });