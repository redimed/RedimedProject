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
    'starter.model'
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
        var socket = io.connect("http://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/", {'secure':true, reconnect: true, 'force new connection': false});

        var socketFactory = socketFactory({
            ioSocket: socket
        });

        return socketFactory;
    })

    .config(function($stateProvider, $urlRouterProvider, RestangularProvider, HOST_CONFIG) {

        RestangularProvider.setBaseUrl("http://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port);
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
                                    $state.go('app.injury.info');
                                }
                            }, 1000);
                        }
                    }
                }
            })
    })

    .run(function($state, $rootScope,localStorageService, $ionicSideMenuDelegate, $cordovaPush, ionPlatform, signaling, $ionicModal, $ionicPopup, $interval) {

        signaling.on('reconnect',function(){
            if (localStorageService.get("userInfo") != null) {
                signaling.emit('reconnected', localStorageService.get("userInfo").id);
            }
        })

        $interval(function() {
            if (localStorageService.get("userInfo") != null) {
                signaling.emit('checkApp', localStorageService.get("userInfo").id);
            }
        }, 3 * 1000);


        signaling.on('reconnect_failed',function(){
            localStorageService.removeAll();
            $state.go("security.login",null,{location: "replace", reload: true});
            socket.removeAllListeners();
        })

        localStorageService.set('mode','read');

        $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams) {
            localStorageService.set("fromState",{fromState:fromState,fromParams:fromParams});
            if(!localStorageService.get("userInfo")){
                if(toState.name !== "security.forgot" && toState.name !== "security.login") {
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
            if( $state.is("app.mainBluetooth")) {
                window.bluetooth.enable();
            }
            ionPlatform.ready.then(function (device) {

                var config = null;

                if (ionic.Platform.isAndroid()) {
                    config = {
                        "senderID": "137912318312"
                    };
                }
                else if (ionic.Platform.isIOS()) {
                    config = {
                        "badge": "true",
                        "sound": "true",
                        "alert": "true"
                    }
                }
                $cordovaPush.register(config).then(function (result) {
                    console.log("Register Push Notification Status: " + result)
                }, function (err) {
                    console.log("Register Push Notification Status: " + err)
                });
            });
            if($state.is("app.phoneCall")) {
                screen.lockOrientation('landscape');
            }
        });
    });
//if (!OT) {
//    var OT = {};
//}
//OT.onLoad = function(fn) {
//    document.addEventListener('deviceReady', fn);
//};
//OT.$ = OT.getHelper();