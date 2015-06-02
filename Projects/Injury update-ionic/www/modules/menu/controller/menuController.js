angular.module("starter.menu.controller",[])
    .controller("menuController",function($scope, $rootScope, localStorageService, $state, UserService,
                                          $ionicPopover, SecurityService, $ionicPopup, $cordovaDialogs,
                                          $ionicLoading, $timeout, $cordovaMedia, phoneCallService, signaling,
                                          $cordovaGeolocation, $interval, $ionicPlatform, DriverServices,
                                          HOST_CONFIG, $ionicModal){
        signaling.removeAllListeners();

        var userInfo= localStorageService.get("userInfo");
        var notificationLS = localStorageService.get("notificationLS");
        $scope.Injurymenu = [];
        $scope.userName = userInfo.user_name;
        $scope.selectedMenu = null;
        var lat = 0;
        var long = 0;
        var colors = ['#FF5E3A','#FF9500','#FFDB4C','#87FC70','#52EDC7','#1AD6FD','#C644FC','#898C90'];
        var stopInterval;

        var mediaSource = null;
        var src = "/android_asset/www/receive_phone.mp3";
        var media = null;
        var loop = function (status) {
            //if (status === Media.MEDIA_STOPPED) {
            //     media.play();
            //}
            //else if (status === Media.MEDIA_PAUSED) {
            //     media.pause();
            //}
        };


        signaling.on('online', function (userlist) {
            $scope.$apply(function(){
                $scope.contacts = userlist;
                for(var i = 0 ; i < $scope.contacts.length; i++) {
                    $scope.contacts[i].background = colors[Math.floor(Math.random() * colors.length)];
                    $scope.contacts[i].letter = String($scope.contacts[i].username).substr(0,1).toUpperCase();
                }
            })
        })

        signaling.on('isLoggedIn', function () {
            $scope.userInfoLS.push({
                platform: ionic.Platform.platform(),
                info: userInfo,
                token: notificationLS.regid
            })
            signaling.removeAllListeners();
        });

        UserService.getUserInfo(userInfo.id).then(function(data){
            $scope.img = data.img;
        })
        $scope.userInfoLS = [];

        var loadMenu = function() {
            UserService.menu(userInfo.id).then(function(response){
                var i = 0;
                angular.forEach(response, function(menu){
                    if(menu.Parent_Id === -1)
                        $scope.Injurymenu.push({"parent": {"name": menu.Description, "definition":menu.Definition , "menu_id": menu.Menu_Id, "childs":[]}});
                    else{
                        var j = 0;
                        angular.forEach($scope.Injurymenu, function(lmenu){
                            if(lmenu.parent.menu_id === menu.Parent_Id){
                                $scope.Injurymenu[j].parent.childs.push({"name": menu.Description, "definition":menu.Definition, "id": menu.Menu_Id});
                            }
                            j++;
                        })
                    }
                    i++;
                });
            });
            // END MENU
        }

        loadMenu();

        $scope.$on('$destroy', function() {
            $interval.cancel(stopInterval);
            stopInterval = undefined;
        });

        $scope.logoutApp = function() {
            $interval.cancel(stopInterval);
            stopInterval = undefined;
            $scope.userInfoLS.push({
                platform: ionic.Platform.platform(),
                info: userInfo,
                token: notificationLS.regid
            });
            $scope.popupMessage = {message: "Do you want log out?" };
            $ionicPopup.show({
                templateUrl: 'modules/popup/PopUpConfirm.html',
                scope: $scope,
                buttons : [
                    {
                        text: "Yes, I do!",
                        type: 'button button-assertive',
                        onTap: function(e) {
                            signaling.emit('logout', userInfo.user_name, userInfo.id, userInfo.UserType.user_type, $scope.userInfoLS);
                            $ionicLoading.show({
                                template: "<div class='icon ion-ios7-reloading'></div>"+
                                "<br />"+
                                "<span>Logout...</span>",
                                animation: 'fade-in',
                                showBackdrop: true,
                                maxWidth: 200,
                                showDelay: 0
                            });
                            signaling.on('logoutSuccess', function(){
                                signaling.removeAllListeners();
                                localStorageService.clearAll();
                                $state.go("security.login", null, {reload: true});
                                $ionicLoading.hide();
                            })
                        }
                    },
                    { text: "Cancel" }
                ]
            })
        }

        $scope.readNFC = function() {
            $state.go('app.NFC', null, {
                reload: true
            })
        }


        $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
            if (ionic.Platform.isAndroid()) {
                handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
            }
        });

        //Android.
        function handleAndroid(notification) {
            if (notification.event == "message") {
                mediaSource = new Media("https://testapp.redimed.com.au:3000/api/im/pushSound");
                mediaSource.play();

                $cordovaDialogs.alert(notification.message, "Emergency").then(function (){
                    mediaSource.pause();
                    localStorageService.set("idpatient_notice", notification.payload.injury_id)

                    DriverServices.notifi = notification;
                    if(userInfo.UserType.user_type == "Driver") {
                        $state.go('app.driver.detailInjury', {}, {reload: true});
                    }
                    else {
                        alert(JSON.stringify(notification));
                    }
                })
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

        function getLocation() {
            if(localStorageService.get("userInfo")) {
                if(localStorageService.get("userInfo").UserType.user_type == 'Driver') {
                    var posOptions = {maximumAge: 0, timeout: 10000, enableHighAccuracy: true};
                    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                            var driverLocation = [];
                            lat = position.coords.latitude
                            long = position.coords.longitude

                            driverLocation.push({
                                id: localStorageService.get("userInfo").id,
                                latitude: lat,
                                longitude: long,
                                userName: localStorageService.get("userInfo").user_name,
                                userType: localStorageService.get("userInfo").UserType.user_type
                            });
                            signaling.emit('location', driverLocation);
                        }, function (err) {
                            $interval.cancel(stopInterval);
                            stopInterval = undefined;
                            alert("Could not get the current position. Either GPS signals are weak or GPS has been switched off");
                        });
                }
            }
        }

        $scope.doRefreshListUserOnline = function() {
            getListUserOnline();
        }

        function getListUserOnline() {
            phoneCallService.getListUserOnline().then(function (result) {
                $scope.contacts = result.data;

                for(var i = 0 ; i < $scope.contacts.length; i++) {
                    $scope.contacts[i].background = colors[Math.floor(Math.random() * colors.length)];
                    $scope.contacts[i].letter = String($scope.contacts[i].username).substr(0,1).toUpperCase();
                }
            }).finally(function() {
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        getListUserOnline();

        $scope.infoState = function() {
            $state.go('app.profile');
        }

        $scope.makeCall = function(id) {
            signaling.emit("generateSession", userInfo.id);
            signaling.on("generateSessionSuccess",function(opentokRoom){
                var apikey = opentokRoom.apiKey;
                var sessionid = opentokRoom.sessionId;
                var token = opentokRoom.token;

                $state.go('app.phoneCall', { callUser: id, apiKey: apikey, sessionID: sessionid, tokenID: token, isCaller: true }, {reload: true});

            });
        };


        $ionicModal.fromTemplateUrl('modules/phoneCall/views/modal/receivePhone.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modalreceivePhone = modal;
        });

        signaling.removeListener('messageReceived');
        signaling.on('messageReceived', function (fromId, fromUsername, message) {
            UserService.getUserInfo(fromId).then( function(data) {
                if(data.img == null) {
                    $scope.avatarCaller = 'img/avatar.png'
                } else {
                    $scope.avatarCaller = data.img
                }
                $scope.fromUsername = fromUsername;
            });
            switch (message.type) {
                case 'call':
                    media = new Media(src, null, null, loop);
                    media.play();
                    $scope.modalreceivePhone.show();
                    $scope.acceptCall = function() {
                        $scope.modalreceivePhone.hide();
                        media.pause();
                        $state.go('app.phoneCall', { callUser: fromId, apiKey: message.apiKey, sessionID: message.sessionId,
                            tokenID: message.token, isCaller: false }, {reload: true});
                    }
                    $scope.ignoreCall = function() {
                        $scope.modalreceivePhone.hide();
                        media.pause();
                        signaling.emit('sendMessage', localStorageService.get('userInfo').id, fromId, { type: 'ignore' });
                    }
                    break;
                case 'cancel':
                    if($scope.modalreceivePhone.isShown()) {
                        media.pause();
                        $scope.modalreceivePhone.hide();
                    }
                    break;
            }
        });

        signaling.on('forceLogout', function(){
            $scope.popupMessage = { message: "Some is logged into your account!"};
            $ionicPopup.show({
                templateUrl: 'modules/popup/PopUpError.html',
                scope: $scope
            });
            localStorageService.clearAll();
            $state.go("security.login", null, {location: "replace", reload: true});
        });

        $scope.$on("$stateChangeSuccess", function() {
            document.addEventListener('backbutton', function(){
                if($state.is("app.injury.info") || $state.is("app.driver.list")) {
                    if(!$scope.modalreceivePhone.isShown()) {
                        navigator.app.exitApp();
                    }
                }
            });
            if(localStorageService.get("userInfo").UserType.user_type == 'Driver')
            {
                getLocation();
                if(stopInterval != undefined) {
                    stopInterval = $interval(function () { getLocation()}, 10 * 1000);
                }
            }
        });
    })