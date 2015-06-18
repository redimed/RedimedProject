// Ionic Starter App

'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'btford.socket-io',
    'restangular',
    'starter.menu',
    'starter.security',
    'starter.user',
    'LocalStorageModule',
    'starter.worker',
    'starter.injury',
    'app.config',
    'starter.worker',
    'starter.booking',
    'starter.NFC',
    'ngCordova',
    'starter.driver',
    'starter.NFC',
    'starter.phoneCall',
    'ion-google-place',
    'ngAutocomplete',
    'starter.bluetooth',
    'ngInputDate'
])

    .factory(("ionPlatform"), function( $q ){
        var ready = $q.defer();

        ionic.Platform.ready(function( device ){
            ready.resolve( device );
        });

        return {
            ready: ready.promise
        }
    })

    .factory('signaling', function (socketFactory, HOST_CONFIG) {
        var socket = io.connect("https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/", {'secure':true, reconnect: true, 'force new connection': false});

        var socketFactory = socketFactory({
            ioSocket: socket
        });
        return socketFactory;
    })

    .config(function($stateProvider, $urlRouterProvider, RestangularProvider, HOST_CONFIG) {

        RestangularProvider.setBaseUrl("https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state("init", {
                url: "/",
                resolve: {
                    initHome: function($timeout, $state, localStorageService){
                        if(!localStorageService.get("userInfo")){
                            $timeout(function(){
                                $state.go("security.login");
                            }, 100);
                        }else {
                            $timeout(function() {
                                if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                                {
                                    $state.go('app.driver.list');
                                } else {
                                    if(localStorageService.get("userInfo").UserType.user_type == "Patient"){
                                            $state.go('app.injury.desInjury');
                                    }else{
                                          $state.go('app.injury.info');
                                    }
                                  
                                }
                            }, 1000);
                        }
                    }
                }
            })
    })

    .run(function($state, $rootScope,localStorageService, $ionicSideMenuDelegate, $cordovaPush,
                  ionPlatform, signaling, $ionicModal, $ionicPopup, SecurityService, $cordovaDialogs) {

        signaling.on('reconnect',function(){
            if (localStorageService.get("userInfo") != null) {
                signaling.emit('reconnected', localStorageService.get("userInfo").id);
            }
        })
        signaling.on('reconnect_failed',function(){
            localStorageService.removeAll();
            $state.go("security.login",null,{location: "replace", reload: true});
            socket.removeAllListeners();
        })

        localStorageService.set('mode','read');

        $rootScope.$on("$stateChangeSuccess", function (e, toState,toParams, fromState, fromParams) {
            localStorageService.set("fromState",{fromState:fromState,fromParams:fromParams});
            if(!localStorageService.get("userInfo")){
                if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.register.info1"  && toState.name !== "security.register.info2"  && toState.name !== "security.register.info3") {
                    e.preventDefault();
                    $state.go("security.login");
                }
            }
            if( $state.is("app.injury.desInjury") || $state.is("app.injury.desInjurySuccess"))
            {
                $ionicSideMenuDelegate.canDragContent(false);
            } else
            {
                $ionicSideMenuDelegate.canDragContent(true);
            }
            if($state.is("app.phoneCall")) {
                screen.lockOrientation('landscape');
            }
            document.addEventListener("deviceready", function() {
                var config = null;

                if (ionic.Platform.isAndroid()) {
                    config = {
                        "senderID": "137912318312"
                    };
                } else if (ionic.Platform.isIOS()) {
                    config = {
                        "badge": true,
                        "sound": true,
                        "alert": true,
                    };
                }

                $cordovaPush.register(config).then(function (result) {
                    console.log("Success Push: " + result)
                    if (ionic.Platform.isIOS()){
                        SecurityService.setIosToken(result);
                    }
                }, function (err) {
                    console.log("Error Push: " + err)
                });

                $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                    localStorageService.set("notificationLS", notification);
                    if (ionic.Platform.isAndroid()) {
                        handleAndroid(notification);
                    }
                    else if (ionic.Platform.isIOS()) {
                        //handleIOS(event, notification);
                    }
                });

                //Android.
                function handleAndroid(notification) {
                    if (notification.event == "registered") {
                        SecurityService.setIosToken(notification.regid);
                    }
                }

                //iOS.
                //function handleIOS(event, notification) {
                //    console.log(notification);
                //    switch (notification.type) {
                //        case 'call':
                //            var snd = new Media(event.sound);
                //            snd.play();
                //    }
                //
                //    if (notification.alert) {
                //        $cordovaDialogs.alert(notification.alert, "Emergency").then(function (){
                //            snd.pause();
                //            //localStorageService.set("idpatient_notice", notification.payload.injury_id)
                //            //
                //            //DriverServices.notifi = notification;
                //            //
                //            //if(userInfo.UserType.user_type == "Driver") {
                //            //    $state.go('app.driver.detailInjury', {}, {reload: true});
                //            //}
                //        });
                //    }
                //
                //    if (notification.sound) {
                //
                //    }
                //
                //    if (notification.badge) {
                //        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                //            console.log(result, 'setBadgeNumber');
                //        }, function(err) {
                //            console.log(err, 'error ----setBadgeNumber');
                //        });
                //    }
                //}
                AudioToggle.setAudioMode(AudioToggle.SPEAKER);
            });
        });

        document.addEventListener("deviceready", function() {
            checkConnection();
            $rootScope.$on("$stateChangeSuccess", function () {
                checkConnection();
            });
            if (window.device.platform === 'iOS' && parseFloat(window.device.version) >= 7.0) {
                StatusBar.hide();
            }
        });

        function checkConnection() {
            var networkState = navigator.connection.type;
            var states = {};
            $rootScope.popupMessage = {message : "Check your connection and try again."};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';
            if(networkState == Connection.NONE) {
                $ionicPopup.show({
                    templateUrl: 'modules/popup/PopUpError.html',
                    scope: $rootScope,
                    buttons: [
                        {
                            text: "Ok",
                            onTap: function() {
                                window.plugins.SettingOpener.Open("ACTION_SETTINGS");
                            }

                        },
                    ]
                });
            }
        }
    })

    .filter('currentDate',['$filter',  function($filter) {
        return function() {
            return  $filter('date')(new Date(), 'yyyy-MM-dd');
        };
    }])