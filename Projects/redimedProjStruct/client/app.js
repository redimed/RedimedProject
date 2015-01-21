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
    'angular-underscore'
])
.factory('socket', function (socketFactory) {
    var socket = io.connect('http://192.168.135.115/',{
        'port':3000,
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
    /* END */
})

//When update any route
.run(function($window,$cookieStore, $state, $rootScope, $idle, $log, $keepalive, editableOptions, socket){
        socket.on('messageReceived', function (name, message) {
            switch (message.type) {
                case 'call':
                    if ($state.current.name === 'loggedIn.im.call') { return; }

                    $state.go('loggedIn.im.call', { isCalling: false, contactName: name });
                    break;
            }
        });

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


    $rootScope.$on("$stateChangeSuccess", function(e, toState,toParams, fromState, fromParams){
        $cookieStore.put("fromState",fromState);
        if(!$cookieStore.get("userInfo")){
            socket.removeAllListeners();
            socket.emit('lostCookie');
            if(toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.register"){
                e.preventDefault();
                $state.go("security.login");
            }
        }else
        {
            socket.emit('checkUserSocket',$cookieStore.get('userInfo').id,$cookieStore.get('userInfo').user_name);
        }
    });
})

