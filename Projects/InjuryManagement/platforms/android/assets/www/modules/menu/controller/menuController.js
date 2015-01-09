angular.module("starter.menu.controller",[])
    .controller("menuController",function($scope, localStorageService, $state, UserService,
                                          $ionicPopover, SecurityService, $ionicPopup, $cordovaDialogs,
                                          $ionicLoading, $timeout, $cordovaMedia, phoneCallService, signaling){
        var userInfo= localStorageService.get("userInfo");
        var notificationLS = localStorageService.get("notificationLS");
        $scope.Injurymenu = [];
        $scope.user = userInfo.Booking_Person;
        $scope.userName = userInfo.user_name;
        $scope.selectedMenu = null;

        if(ionic.Platform.isAndroid() || ionic.Platform.isIOS())
        {
            var mediaSource = $cordovaMedia.newMedia("http://testapp.redimed.com.au:3000/api/im/pushSound");
            var media = mediaSource.media
        }

        signaling.on('online', function (userlist) {
            $scope.$apply(function(){
                $scope.contacts = userlist;
            })
        })

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

        $scope.logoutApp = function() {
            $scope.userInfoLS.push({
                platform: ionic.Platform.platform(),
                info: userInfo,
                token: notificationLS.regid
            })
            $ionicPopup.confirm({
                template: 'Are you sure you want to log out?'
            }).then(function(result){
                if(result){
                    signaling.emit('logout', userInfo.user_name);
                    signaling.removeAllListeners();
                    $ionicLoading.show({
                        template: "<div class='icon ion-ios7-reloading'></div>"+
                        "<br />"+
                        "<span>Waiting...</span>",
                        animation: 'fade-in',
                        showBackdrop: true,
                        maxWidth: 200,
                        showDelay: 0
                    });
                    $timeout(function () {
                        SecurityService.logOutapp($scope.userInfoLS).then(function (result) {
                            if (result.status.toLowerCase() == "success") {
                                localStorageService.remove('userInfo');
                                localStorageService.remove('companyInfo');
                                localStorageService.remove("notificationLS");
                                localStorageService.remove("idpatient_notice");
                                $state.go("security.login");
                                $ionicLoading.hide();
                            }
                        })
                    },1500 )
                }
            })
        }

        $scope.readNFC = function() {
            $state.go('app.NFC', null, {
                reload: true
            })
        }


        $scope.$on('pushNotificationReceived', function (event, notification) {
            if (ionic.Platform.isAndroid()) {
                handleAndroid(notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(notification);
            }
        });

        //Android.
        function handleAndroid(notification) {
            if (notification.event == "message" && userInfo.UserType.user_type == "Driver") {
                $cordovaDialogs.alert(notification.message, "Emergency").then(function (){
                    localStorageService.set("idpatient_notice", notification.payload.injury_id)
                    $state.go('app.driver.detailInjury', {}, {reload: true});
                })
            }
            else if (notification.event == "error")
                console.log(notification.msg, "Push notification error event");

            else console.log(notification.event, "Push notification handler - Unprocessed Event");
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

    })