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
    'ui.bootstrap',
    'starter.NFC',
    'ngCordova',
    'starter.driver',
    'starter.NFC',
    'starter.phoneCall',
])
    //app ready get function register get device token
    .factory(("ionPlatform"), function( $q ){
        var ready = $q.defer();

        ionic.Platform.ready(function( device ){
            ready.resolve( device );
        });

        return {
            ready: ready.promise
        }
    })

    .factory('signaling', function (socketFactory, localStorageService) {
        var socket = io.connect('http://192.168.133.121:3000/');

        var socketFactory = socketFactory({
            ioSocket: socket
        });

        return socketFactory;
    })

    .config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

        RestangularProvider.setBaseUrl("http://192.168.133.121:3000");

        //RestangularProvider.setBaseUrl("http://testapp.redimed.com.au:3000");

        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state("init", {
                url: "/",
                resolve: {
                    initHome: function($timeout,$state,localStorageService){
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
                            }, 100);
                        }
                    }
                }
            })
    })

    .run(function($state, $rootScope, localStorageService, $ionicSideMenuDelegate, $cordovaPush, ionPlatform, signaling, $ionicModal){

        //modal receive phone call
        $ionicModal.fromTemplateUrl('modules/phoneCall/views/modal/receivePhone.html', function(modal) {
            $rootScope.receivePhoneModal = modal;
        },{
            scope: $rootScope,
            animation: 'slide-in-up'
        });
        $rootScope.contacts = {};

        //sound phone call;
        var src = "/android_asset/www/receive_phone.mp3";
        var media = null;

        if(localStorageService.get("userInfo")) {
            signaling.emit('checkApp', localStorageService.get("userInfo").id);
        }

        document.addEventListener("pause", onPause, false);

        function onPause() {
            console.log('onPause------');
        }

        function onDeviceReady() {
            document.addEventListener("offline", onOffline, false);
        }

        function onOffline() {
            console.log('onOffline--------');
        }

        localStorageService.set('mode','read');
        $rootScope.$on("$stateChangeSuccess", function(e, toState) {
            if(!localStorageService.get("userInfo")){
                if(toState.name !== "security.forgot" && toState.name !== "security.login") {
                    e.preventDefault();
                    $state.go("security.login");
                }
            }
            if( toState.name == "app.injury.desinjury" || toState.name == "app.injury.desinjurySuccess")
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
                    console.log("Register Push Notification " + result)
                }, function (err) {
                    console.log("Register Push Notification " + err)
                });
            });
        });

        signaling.on('messageReceived', function (userInfo, message) {
            switch (message.type) {
                case 'call':

                    media = new Media(src);
                    media.play();
                    if ($state.current.name === 'app.phoneCall') { return; }

                    $rootScope.nameCalling = userInfo;
                    $rootScope.receivePhoneModal.show();

                    $rootScope.answerphoneCall = function() {
                        media.stop();
                        $rootScope.receivePhoneModal.hide();
                        $state.go('app.phoneCall', { isCalling: false, contactName: userInfo });
                    }

                    $rootScope.hideModalphoneCall = function(){
                        media.stop();
                        $rootScope.receivePhoneModal.hide();
                        signaling.emit('sendMessage', userInfo, { type: 'ignore' });
                    }

                    break;
                case 'ignore':
                    $rootScope.receivePhoneModal.hide();
                    media.stop();
                    break;
            }
        });
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



