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
        var socket = io.connect("http://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port + "/");

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

    .run(function($state, $rootScope,localStorageService, $ionicSideMenuDelegate, $cordovaPush, ionPlatform, signaling, $ionicModal, $ionicPopup, HOST_CONFIG){

        easyrtc.setSocketUrl("http://" + HOST_CONFIG.host + ":" + HOST_CONFIG.port)

        $ionicModal.fromTemplateUrl('modules/phoneCall/views/modal/receivePhone.html', {
            scope: $rootScope,
            animation: 'slide-in-up',
            backdropClickToClose: false
        }).then(function(modal) {
            $rootScope.modal = modal
        });

        $rootScope.contacts = {};

        $rootScope.nameCallingJson = [];

        if(localStorageService.get("userInfo")) {
            signaling.emit('checkApp', localStorageService.get("userInfo").id);
        }

        localStorageService.set('mode','read');
        $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams) {
            localStorageService.set("fromState",{fromState:fromState,fromParams:fromParams});
            if(!localStorageService.get("userInfo")){
                if(toState.name !== "security.forgot" && toState.name !== "security.login") {
                    e.preventDefault();
                    $state.go("security.login");
                }
            }
            if( toState.name == "app.injury.desinjury" || toState.name == "app.injury.desinjurySuccess" || toState.name == "app.injury.modelBody")
            {
                $ionicSideMenuDelegate.canDragContent(false);
            }
            else
            {
                $ionicSideMenuDelegate.canDragContent(true);
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
        });

        signaling.on('forceLogout', function(){
            $ionicPopup.confirm({
                title: "Sorry",
                template: 'Account is using!'
            })
            localStorageService.clearAll();
            $state.go("security.login");
        })
    })

    .directive('videoView', function ($rootScope, $timeout) {
        return {
            restrict: 'E',
            template: '<div class="video-container"></div>',
            replace: true,
            link: function (scope, element, attrs) {
                function updatePosition() {
                    cordova.plugins.phonertc.setVideoView({
                        container: element[0],
                        local: {
                            position: [20, 20],
                            size: [150, 150]
                        }
                    });
                }

                $timeout(updatePosition, 500);
                $rootScope.$on('videoView.updatePosition', updatePosition);
            }
        }
    })



