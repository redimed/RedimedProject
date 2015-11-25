'use strict';
angular.module('starter', ['ionic',
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
    'ngInputDate',
    'starter.consultation'
])

    // declare socket
    .factory('signaling', function (HOST_CONFIG) {
        var socket = io.connect("https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port,
            {   'reconnection': true,
                'reconnectionDelay': 1000,
                'reconnectionDelayMax': 2000,
                'reconnectionAttempts': Infinity,
                'secure': true,
                'timeout': 1000,
                'forceNew':true ,
                'transports': ['websocket',
                    'flashsocket',
                    'htmlfile',
                    'xhr-polling',
                    'jsonp-polling',
                    'polling']
            });
        return socket;
    })

    .config(function($stateProvider, $urlRouterProvider, RestangularProvider, HOST_CONFIG) {
        RestangularProvider.setBaseUrl("https://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port);
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state("init", {
                url: "/",
                resolve: {
                    initHome: function($timeout, $state, localStorageService) {
                        if(!localStorageService.get("userInfo")){
                            $timeout(function(){
                                $state.go("security.login");
                            }, 100);
                        } else {
                            $timeout(function() {
                                if(localStorageService.get("userInfo").UserType.user_type == "Driver")
                                {
                                    $state.go('app.driver.list');
                                } else {
                                    if(localStorageService.get("userInfo").UserType.user_type == "Patient") {
                                        $state.go('app.injury.desInjury');
                                    } else {
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
                  signaling, $ionicModal, $ionicPopup, SecurityService, $cordovaDialogs) {
        localStorageService.set('mode','read');
        $rootScope.$on("$stateChangeSuccess", function (e, toState,toParams, fromState, fromParams) {
            localStorageService.set("fromState",{fromState:fromState,fromParams:fromParams});
            if(!localStorageService.get("userInfo")){
                if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.register.info1"  && toState.name !== "security.register.info2"  && toState.name !== "security.register.info3") {
                    e.preventDefault();
                    $state.go("security.login");
                }
            }
            if( $state.is("app.injury.desInjury") || $state.is("app.injury.desInjurySuccess") || $state.is("app.injury.historyDetail") || $state.is("app.detailConsultation"))
                {
                    $ionicSideMenuDelegate.canDragContent(false);
                }
            else
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
                        "sound": "receive_phone.wav",
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
                AudioToggle.setAudioMode(AudioToggle.SPEAKER);

                checkConnection();
                if (window.device.platform === 'iOS' && parseFloat(window.device.version) >= 7.0) {
                    StatusBar.hide();
                }
            });
        });

        //  android handle notification new patient.
        function handleAndroid(event, notification) {
            switch(notification.event) {
                case 'registered':
                    if (notification.regid.length > 0 ) {
                        SecurityService.setandroidToken(notification.regid);
                    }
                    break;
                case 'message':
                    if(localStorageService.get("userInfo").UserType.user_type == 'Driver') {
                        $cordovaDialogs.alert(notification.message, "REDiMED").then(function() {
                            $state.go('app.driver.detailInjury', { injuryID: notification.payload.injury_id });
                        });
                    } else if(localStorageService.get("userInfo").UserType.user_type == 'Company') {
                        $cordovaDialogs.alert(notification.message, "REDiMED");
                    }
                    break;
                case 'error':
                    alert('GCM error = ' + notification.msg);
                    break;
            }
        };

        //  iOS handle notification new patient.
        function handleIOS(event, notification) {
            console.log("handleIOS--- ", JSON.stringify(notification));
            if (notification.alert) {
                if(localStorageService.get("userInfo").UserType.user_type == 'Driver') {
                    $cordovaDialogs.alert(notification.alert, "Emergency").then(function() {
                        $state.go('app.driver.detailInjury', { injuryID: notification.injury_id });
                    });
                } else if(localStorageService.get("userInfo").UserType.user_type == 'Company') {
                    $cordovaDialogs.alert(notification.alert, "REDiMED");
                }

            }
        };

        // declare receive notifiaction handle check ios or android.
        $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
            if (ionic.Platform.isAndroid()) {
                handleAndroid(event,notification);
            }
            else if (ionic.Platform.isIOS()) {
                handleIOS(event,notification);
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