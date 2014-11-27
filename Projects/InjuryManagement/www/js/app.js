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


])
    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    })

    .config(function($stateProvider, $urlRouterProvider,RestangularProvider) {


      //local
      //RestangularProvider.setBaseUrl("http://localhost:3000");



      //test ip local

      //RestangularProvider.setBaseUrl("http://192.168.135.24:3000");

      //RestangularProvider.setBaseUrl("http://testapp.redimed.com.au:3000");

      //RestangularProvider.setBaseUrl("http://192.168.135.26:3000");

      //ip Luan
     //RestangularProvider.setBaseUrl("http://192.168.132.39:3000");
        RestangularProvider.setBaseUrl("http://192.168.133.84:3000");
      //ip nha
      //RestangularProvider.setBaseUrl("http://192.168.1.110:3000");

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
    .run(function($state, $rootScope,localStorageService,$ionicSideMenuDelegate){

      $rootScope.$on("$stateChangeSuccess", function(e, toState){
        if(!localStorageService.get("userInfo")){
          if(toState.name !== "security.forgot" && toState.name !== "security.login") {
            e.preventDefault();
            $state.go("security.login");
            $ionicSideMenuDelegate.canDragContent(false);
          }
        }
      });
    });

