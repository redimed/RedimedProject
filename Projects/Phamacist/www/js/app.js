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
    'starter.main'
   
    
    
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

    .run(function($state, $rootScope,localStorageService, $ionicSideMenuDelegate, $cordovaPush, ionPlatform, $ionicModal, $ionicPopup, $interval) {
        $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams) {
            localStorageService.set("fromState",{fromState:fromState,fromParams:fromParams});
            if(!localStorageService.get("userInfo")){
                if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.signup"&& toState.name !== "security.signupCompany" && toState.name !== "security.signupPharmacist") {
                    e.preventDefault();
                    $state.go("security.login");
                }
            }
        });
    });


