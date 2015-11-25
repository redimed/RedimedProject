// Ionic Starter App

'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
    'restangular',
    'starter.menu',
    'starter.security',
    'LocalStorageModule',
    'app.config',
    'ngCordova',
    'starter.main',
    'ngAutocomplete',
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
                               
                                $state.go('app.main.home');
                                
                            }, 1000);
                        }
                    }
                }
            })
    })

    .run(function($state, $rootScope, localStorageService, $ionicSideMenuDelegate, $cordovaPush, ionPlatform, $ionicModal, $ionicPopup, $interval, SecurityService) {
            $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams) {
                localStorageService.set("fromState",{fromState:fromState,fromParams:fromParams});
                if(!localStorageService.get("userInfo")){
                    if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.signup"&& toState.name !== "security.signupCompany" && toState.name !== "security.signupPharmacist") {
                        e.preventDefault();
                        $state.go("security.login");
                    }
                }
            })

            ionic.Platform.ready(function () {
                var androidConfig = {
                    "senderID": "70440074901",
                };
                $cordovaPush.register(androidConfig).then(function(result) {
                  console.log(result);
                }, function(err) {
                  console.log(err);
            })
        
            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
              switch(notification.event) {
                
                case 'registered':
                  if (notification.regid.length > 0 ) {
                    console.log('registration ID = ', notification.regid);
                    SecurityService.tokenID = notification.regid;
                  }
                  break;
                // case 'message':
                //   // this is the actual push notification. its format depends on the data model from the push server
                //   alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
                //   break;

                // case 'error':
                //   alert('GCM error = ' + notification.msg);
                //   break;

                // default:
                //   alert('An unknown GCM event has occurred');
                //   break;
              }
            });

            // WARNING! dangerous to unregister (results in loss of tokenID)
            // $cordovaPush.unregister(options).then(function(result) {
            //       // Success!
            //     }, function(err) {
            //       // Error
            //     });
            // }, false);
        });
    });


