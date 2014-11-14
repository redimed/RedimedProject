angular.module("app", [
    "ui.router",                // ANGULAR UI ROUTER
    "angularFileUpload",        // ANGULAR FILE UPLOAD
    "ui.date",                  // ANGULAR DATE
    "restangular",              // RESTANGULAR
    "ui.bootstrap",             // ANGULAR BOOTSTRAP
    "ngCookies",                // ANGULAR COOKIES
    "ngTouch", // ANGULAR TOUCH
    "pascalprecht.translate",   // ANGULAR TRANSLATE
    "ui.select",                // ANGULAR UI SELECT
    "pascalprecht.translate", // ANGULAR TRANSLATE
    "localytics.directives", // ANGULAR CHOSEN
    "toastr",                   // ANGULAR TOASTR
    "angular-loading-bar",      // ANGULAR LOADING BAR
    "ngTable",                  // ANGULAR TABLE
    "ngIdle",                   // Ng-Idle
    "app.loggedIn",             // MODULES LOGGED IN
    "app.security",              // FOR LOGIN, FOTGOT FORM, REGISTER FORM
     "app.config", // ANGULAR CONFIG
    "app.lockscreen.controller", //LOCKSCREEN CONTROLLER
    "ui.slider", // ANGULAR SLIDER
    "pragmatic-angular", // ANGULAR PRAGMATIC
    "cfp.hotkeys",      // ANGULAR HOTKEYS
    "app.directive.common",      // CUSTOM DIRECTIVES
    'angular.filter',            //angular filter for group table--tannv.dts@gmail.com
    'xeditable',
    'uz.mailto',                 //angular mailto for [patientdetail]--tannv.dts@gmail.com
    'ui.tree',                   // angular ui tree for [admin_booking]-- tannv.dts@gmail.com
    'ng-context-menu',            // angular context menu (menu right click) for [admin_booking]-- tannv.dts@gmail.com
	'LocalStorageModule'
])

.config(function ($stateProvider, $urlRouterProvider, $translateProvider, RestangularProvider, $idleProvider, $keepaliveProvider, localStorageServiceProvider) {
    //IDLE TIME
    $idleProvider.idleDuration(15*60);
    $idleProvider.warningDuration(30);
    $keepaliveProvider.interval(15*60);

    // RESTANGULAR DEFAULT
    RestangularProvider.setBaseUrl("");


    $urlRouterProvider.otherwise('/');

	localStorageServiceProvider.setStorageType('sessionStorage');
	
    $stateProvider

    /* System route initialization */
    .state("init", {
        url: "/",
        resolve: {

            initHome: function($timeout, $state, $cookieStore){

                if(!$cookieStore.get("userInfo")){
                    $timeout(function(){
                        $state.go("security.login");
                    }, 100);
                }else{
                    $timeout(function(){
                        $state.go("loggedIn.home");
                    }, 100);
                }
            }
        }
    })

    .state('lockscreen',{
        url:'/lockscreen',
        views:{
            "root":{
                templateUrl: "common/views/lockscreen.html",
                controller:'lockscreenController'
            }
        }

    })
    /* END */
})

//When update any route
.run(function($cookieStore, $state, $rootScope, $idle, $log, $keepalive, editableOptions){
    $idle.watch();
    // Use when update any state

    editableOptions.theme = 'bs3';

    $rootScope.$on("$stateChangeSuccess", function(e, toState, fromState, fromParams){
        if(!$cookieStore.get("userInfo")){
            if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.register"){
                e.preventDefault();
                $state.go("security.login");
            }
        }
    });
})
