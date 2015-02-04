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
    "app.model",    // ANGULAR MODEL
    "app.lockscreen.controller", //LOCKSCREEN CONTROLLER
    "app.call.controller", //CALL CONTROLLER
    "ui.slider", // ANGULAR SLIDER
    "pragmatic-angular", // ANGULAR PRAGMATIC
    "cfp.hotkeys",      // ANGULAR HOTKEYS
    "app.directive.common",      // CUSTOM DIRECTIVES
    'angular.filter',            //angular filter for group table--tannv.dts@gmail.com
    'xeditable',
    'uz.mailto',                 //angular mailto for [patientdetail]--tannv.dts@gmail.com
    'ui.tree',                   // angular ui tree for [admin_booking]-- tannv.dts@gmail.com
    'ng-context-menu',            // angular context menu (menu right click) for [admin_booking]-- tannv.dts@gmail.com
	'LocalStorageModule',
    'ui-iconpicker',
    'ngPDFViewer',
    'ngSanitize',
    'ngMap',
    'btford.socket-io',
    // 'angular-underscore'
])
.factory('socket', function (socketFactory) {
   var host = location.hostname;
    var port = location.port;

    var socket = io.connect('http://'+host+'/',{
        'port':port,
        'reconnect': true,
        'reconnection delay': 2000,
        'max reconnection attempts': 10000,
        'force new connection':true
    });

    var socketFactory = socketFactory({
        ioSocket: socket
    })

    return socketFactory;
})
.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $translateProvider, RestangularProvider, $idleProvider, $keepaliveProvider, localStorageServiceProvider) {
    // CORS PROXY
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // END CORS PROXY

    //IDLE TIME
    $idleProvider.idleDuration(30*60);
    $idleProvider.warningDuration(30);
    $keepaliveProvider.interval(30*60);

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

        .state('call',{
            params: {
                callUser : null,
                isCaller: null
            },
            views:{
                "root":{
                    templateUrl:"common/views/call.html",
                    controller:'callController'
                }
            }
        })
    /* END */
})

//When update any route
.run(function($window,$cookieStore, $state, $rootScope, $idle, $log, $keepalive, editableOptions, socket,toastr){

        easyrtc.setSocketUrl("http://"+location.hostname+":"+location.port);


    $idle.watch();
    // Use when update any state

        $rootScope.jsErrors = [];
        $window.onerror = function (message, url, lineNo) {
            $rootScope.jsErrors.push({
                error:message,
                url: url,
                lineNumber: lineNo
            });
            return true;
        }

    editableOptions.theme = 'bs3';

    if($cookieStore.get("userInfo"))
    {
        socket.emit("checkApp",$cookieStore.get("userInfo").id);
    }

    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
        });
    }

    socket.on("isLoggedIn",function(){
        toastr.error("Your Account Is Already Logged In!");

        $cookieStore.remove("userInfo");
        $cookieStore.remove("companyInfo");
        $cookieStore.remove("doctorInfo");
        $cookieStore.remove("fromState");
        $state.go("security.login",null,{location: "replace", reload: true});

        socket.removeAllListeners();
    })



    $rootScope.$on("$locationChangeSuccess",function(event, current,previous){
        if(current === previous)
        {
            if($cookieStore.get("userInfo")){
                socket.emit("checkApp",$cookieStore.get("userInfo").id);
            }
        }
    })


    $rootScope.$on("$locationChangeStart",function(event, next, current){
        if (easyrtc.webSocket) {
            easyrtc.disconnect();
        }
    });

    $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams){
        $cookieStore.put("fromState",{fromState:fromState,fromParams:fromParams});
        if(!$cookieStore.get("userInfo")){
            socket.removeAllListeners();
            socket.emit('lostCookie');
            if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.register"){
                e.preventDefault();
                $state.go("security.login",null,{location: "replace", reload: true});
            }
        }
    });
})

