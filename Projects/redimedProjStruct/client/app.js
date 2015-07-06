angular.module("app", [
        "ui.router", // ANGULAR UI ROUTER
        "angularFileUpload", // ANGULAR FILE UPLOAD
        "ui.date", // ANGULAR DATE
        "restangular", // RESTANGULAR
        "ui.bootstrap", // ANGULAR BOOTSTRAP
        "ngCookies", // ANGULAR COOKIES
        "ngTouch", // ANGULAR TOUCH
        "pascalprecht.translate", // ANGULAR TRANSLATE
        "ui.select", // ANGULAR UI SELECT
        "pascalprecht.translate", // ANGULAR TRANSLATE
        "localytics.directives", // ANGULAR CHOSEN
        "toastr", // ANGULAR TOASTR
        "angular-loading-bar", // ANGULAR LOADING BAR
        "ngTable", // ANGULAR TABLE
        "ngIdle", // Ng-Idle
        "app.calling", //MODULES CALL
        "app.loggedIn", // MODULES LOGGED IN
        "app.security", // FOR LOGIN, FOTGOT FORM, REGISTER FORM
        "app.config", // ANGULAR CONFIG
        "app.model", // ANGULAR MODEL
        "app.lockscreen.controller", //LOCKSCREEN CONTROLLER
        "ui.slider", // ANGULAR SLIDER
        "pragmatic-angular", // ANGULAR PRAGMATIC
        "cfp.hotkeys", // ANGULAR HOTKEYS
        "app.directive.common", // CUSTOM DIRECTIVES
        'angular.filter', //angular filter for group table--tannv.dts@gmail.com
        'xeditable',
        'uz.mailto', //angular mailto for [patientdetail]--tannv.dts@gmail.com
        'ui.tree', // angular ui tree for [admin_booking]-- tannv.dts@gmail.com
        'ng-context-menu', // angular context menu (menu right click) for [admin_booking]-- tannv.dts@gmail.com
        'LocalStorageModule',
        'ui-iconpicker',
        'ngPDFViewer',
        'ngSanitize',
        'ngMap',
        'ng-mfb',
        'ngDragDrop',
        // 'btford.socket-io',
        'btford.modal',
        'dateRangePicker',
        'angular-svg-round-progress',
        'angular-flot',
        'irontec.simpleChat',
        'opentok',
        'jsTree.directive',
        'app.rlobRegister.controller',
        'opentok-whiteboard',
        'angucomplete',
        'ui.mask',
        'app.sponsor1.controller',
    	'infinite-scroll',//tannv.dts@gmail.com	
	   'app.sponsor1.emergency.controller',
    	'app.sponsor1.nonemergency.controller'
        // 'angular-underscore'
    ])
    .factory('socket', function($rootScope) {
        var host = location.hostname;
        var port = location.port;

        var socket = io.connect('https://'+host+':'+port, {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionDelayMax': 1000,
            'reconnectionAttempts': 1000,
            'secure': true,
            'timeout': 500,
            'force new connection': false,
			'transports': ['websocket', 
                          'flashsocket', 
                          'htmlfile', 
                          'xhr-polling', 
                          'jsonp-polling', 
                          'polling']
        });

        return socket;
    })
    .factory('beforeUnload', function($rootScope, $window) {

        // Events are broadcast outside the Scope Lifecycle

        $window.onbeforeunload = function(e) {
            var confirmation = {};
            var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
            if (event.defaultPrevented) {
                return confirmation.message;
            }
        };

        $window.onunload = function() {
            $rootScope.$broadcast('onUnload');
        };

        return {};
    })
    .config(function($httpProvider, $stateProvider, $urlRouterProvider, $translateProvider, RestangularProvider, $idleProvider, $keepaliveProvider, localStorageServiceProvider, $locationProvider) {
        // JWT SIGN
        $httpProvider.interceptors.push(function($q, $location, $cookieStore) {
            return {
                'request': function(config) {
                    config.headers = config.headers || {};
                    if ($cookieStore.get('token')) {
                        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
                    }
                    return config;
                },
                'responseError': function(response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            };
        });
        // END JWT SIGN

        // CORS PROXY
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // END CORS PROXY

        //IDLE TIME
        $idleProvider.idleDuration(30 * 60);
        $idleProvider.warningDuration(30);
        $keepaliveProvider.interval(30 * 60);

        // $locationProvider.html5Mode(true);

        // RESTANGULAR DEFAULT
        RestangularProvider.setBaseUrl("");

        $urlRouterProvider.otherwise('/');

        localStorageServiceProvider.setStorageType('localStorage');

        $stateProvider

        /* System route initialization */
            .state("init", {
            url: "/",
            resolve: {

                initHome: function($timeout, $state, $cookieStore) {

                    if (!$cookieStore.get("userInfo")) {
                        $timeout(function() {
                            $state.go("security.login");
                        }, 100);
                    } else {
                        $timeout(function() {
                            $state.go("loggedIn.home");
                        }, 100);
                    }
                }
            }
        })

        .state('lockscreen', {
            url: '/lockscreen',
            views: {
                "root": {
                    templateUrl: "common/views/lockscreen.html",
                    controller: 'lockscreenController'
                }
            }

        })

        .state('notifyScreen',{
            url:'/notification',
            views: {
                "root": {
                    templateUrl: "common/views/apptNotification.html",
                    controller: function($scope,$state,socket){
                        $scope.info = {
                            patientName: null,
                            doctorName: null
                        };
                        function cancelListenerHandler(){
                            console.log("Remove Success");
                        }
                        socket.removeListener('receiveNotifyPatient', cancelListenerHandler());
                        socket.on('receiveNotifyPatient',function(patient, doctor){
                            if(patient)
                                $scope.info.patientName = patient;
                            if(doctor)
                                $scope.info.doctorName = doctor;
                        })
                    }
                }
            }
        })


        /* END */
    })

//When update any route
.run(function(beforeUnload, $window, $modalStack, $cookieStore, $interval, $state, $rootScope, $idle, $log, $keepalive, editableOptions, socket, toastr, localStorageService,rlobService, TimeSheetService, UserService) {

    window.loading_screen.finish();

    socket.on('connect',function(){
        if ($cookieStore.get("userInfo"))
            socket.emit("reconnected", $cookieStore.get("userInfo").id);
    })

    socket.on('disconnect',function(){
        toastr.error("Disconnect From Server! Please Login Again!");

        $cookieStore.remove("userInfo");
        $cookieStore.remove("companyInfo");
        $cookieStore.remove("doctorInfo");
        $cookieStore.remove("fromState");
        $cookieStore.remove("toState");
        $cookieStore.remove("isRemember");

        $state.go("security.login",null,{location: "replace", reload: true});
    })

    $idle.watch();

    $rootScope.jsErrors = [];
    $window.onerror = function(message, url, lineNo) {
        $rootScope.jsErrors.push({
            error: message,
            url: url,
            lineNumber: lineNo
        });
        return true;
    }

    editableOptions.theme = 'bs3';


    if (!("Notification" in window)) {
        // alert("This browser does not support desktop notification");
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
        });
    }

    $rootScope.$on("$stateChangeSuccess", function(e, toState, toParams, fromState, fromParams) {
        $modalStack.dismissAll();

        var locationHref = location.href;
        if (locationHref.indexOf('fromMobile=true') != -1) {
            e.preventDefault();
            return;
        }
        if(fromState.name != '' || fromState.name != null)
        {
             $cookieStore.put("fromState", {
                fromState: fromState,
                fromParams: fromParams
            });
        }

         $cookieStore.put("toState", {
            toState: toState,
            toParams: toParams
        });
       
        if (!$cookieStore.get("userInfo")) {
            if(toState.name !== "notifyScreen")
            {
                if (toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.term" && toState.name !== "security.redirect" && toState.name !=="security.rlobRegister" && toState.name!=='security.rlobSponsor' && toState.name!=='security.rlobSponsor.emergency' && toState.name!=='security.rlobSponsor.nonemergency' && toState.name!=='security.portalPatient' && toState.name.indexOf('webpatient') ) {
                    e.preventDefault();
                    $state.go("security.login", null, {
                        location: "replace",
                        reload: true
                    });
                }
            }
        }
    });
    $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
        //LOAD ROLE ON TREEAPPROVE
        if ($cookieStore.get("userInfo") &&
            $cookieStore.get("userInfo").id) {
                TimeSheetService.LoadRole($cookieStore.get("userInfo").id).then(function(response) {
                    if (response.status === "error") {
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Loading fail!", "Error");
                    } else if (response.status === "success") {
                        localStorageService.set("position", response.position[0].TITLE);
                        //ROLE
                        if (toState.position !== undefined && toState.position !== null) {
                            var status = false;
                            angular.forEach(toState.position, function(postt, index) {
                                if (postt === localStorageService.get("position")) {
                                    status = true;
                                }
                            });
                            if (status === false) {
                                $state.go("loggedIn.home", null, {
                                    "reload": true
                                });
                                toastr.error("You not permission!", "Error");
                            }
                        }
                        //END ROLE
                    } else {
                        //catch exception
                        $state.go("loggedIn.home", null, {
                            "reload": true
                        });
                        toastr.error("Server response error!", "Error");
                        e.preventDefault();
                    }
                });
        }
        //END LOAD ROLE ON TREEAPPROVE
    });
});
