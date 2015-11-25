// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','starter.security','restangular','app.config','LocalStorageModule','ion-google-place'])

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
                    initHome: function($timeout, $state){
                       
                            $timeout(function(){
                                $state.go("security.login");
                            }, 100);
                    }
                }
            })
    })
    .run(function($state, $rootScope, $ionicSideMenuDelegate, $cordovaPush, $ionicPlatform, $ionicModal, $ionicPopup, $interval,$location) {
        $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams) {
             $ionicPlatform.registerBackButtonAction(function (condition) {
              if (condition) {
                if($location.$$path === "/login"){
                    $ionicPopup.confirm({
                        title: 'System warning',
                        template: 'are you sure you want to exit?'
                      }).then(function(res){
                        if( res ){
                          navigator.app.exitApp();
                        }
                      })
                }else{

                     // navigator.app.backHistory();
                    
                }
              } else {
                console.log("esle")
              }
            }, 100);
                if(toState.name !== "security.rlobEmergencySuccess" 
                    && toState.name !== "security.rlobEmergency" 
                    && toState.name !== "security.login" 
                    && toState.name !== "security.rlobNonEmergency" 
                    && toState.name !== "security.rlobNonEmergency.NEInfo" 
                    && toState.name!=="security.rlobNonEmergency.rlobBooking"
                    && toState.name!=="security.rlobNonEmergency.rlobBookingDetail"
                    && toState.name!=="security.rlobNonEmergency.rlobBookingType"
                    && toState.name!=="security.rlobNonEmergency.rlobNonEmergencySuccess") {
                    e.preventDefault();
                    $state.go("security.login");
                }
        });
            document.addEventListener("deviceready", onDeviceReady, false);

            // device APIs are available
            //
            function onDeviceReady() {
                checkConnection();
            }
                //check connect
                function checkConnection() {
                    var networkState = navigator.connection.type;
                    var states = {};
                    states[Connection.UNKNOWN]  = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI]     = 'WiFi connection';
                    states[Connection.CELL_2G]  = 'Cell 2G connection';
                    states[Connection.CELL_3G]  = 'Cell 3G connection';
                    states[Connection.CELL_4G]  = 'Cell 4G connection';
                    states[Connection.CELL]     = 'Cell generic connection';
                    states[Connection.NONE]     = 'No network connection';
                    if(networkState=="none"){
                            alert("Please open wifi");
                    }
                }
    });
