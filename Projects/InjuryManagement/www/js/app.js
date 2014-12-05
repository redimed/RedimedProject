// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
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
    'ui.bootstrap',
    'starter.NFC',
    'ngCordova',
    'starter.driver',
    'starter.NFC',
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

    .config(function($stateProvider, $urlRouterProvider,RestangularProvider) {

        // RestangularProvider.setBaseUrl("http://192.168.132.142:3000");

        RestangularProvider.setBaseUrl("http://testapp.redimed.com.au:3000");

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
                        }else{
                            $timeout(function(){
                                $state.go("app.injury.info");
                            }, 100);
                        }
                    }
                }
            })
    })
    .run(function($state, $rootScope,localStorageService,$ionicSideMenuDelegate,$cordovaPush,ionPlatform){
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

        });
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
                console.log("Register success Push Notification " + result)
            }, function (err) {
                console.log("Register error Push Notification " + err)
            });
        });


    });



