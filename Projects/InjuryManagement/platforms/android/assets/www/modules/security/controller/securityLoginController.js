angular.module('starter.security.login.controller',[])
    .controller('securityLoginController',function($scope, $state,UserService, SecurityService,
                                                   localStorageService, $cordovaPush, $cordovaDialogs,
                                                   $cordovaMedia){
        $scope.notifications = [];

        $scope.$on('pushNotificationReceived', function (event, notification) {
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

        // SUBMIT LOGIN
        $scope.login = function(){
            SecurityService.login($scope.modelUser).then(function(response){
                UserService.detail().then(function(response){
                    if(typeof response.userInfo !== 'undefined')
                        localStorageService.set("userInfo", response.userInfo);
                    if(typeof response.companyInfo !== 'undefined')
                        localStorageService.set("companyInfo", response.companyInfo);

                    if(response.userInfo['function_mobile'] != null){
                        UserService.getFunction(response.userInfo['function_mobile']).then(function(data){
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
                        if(localStorageService.get("userInfo").user_type == "Driver")
                        {
                            $state.go('app.driver.list');
                        } else {
                            $state.go('app.injury.info');
                        }
                    }
                });
            }, function(error){
                alert('Error','error');
            });
        }
    });