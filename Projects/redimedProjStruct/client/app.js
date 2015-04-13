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
        "app.loggedIn", // MODULES LOGGED IN
        "app.security", // FOR LOGIN, FOTGOT FORM, REGISTER FORM
        "app.config", // ANGULAR CONFIG
        "app.model", // ANGULAR MODEL
        "app.lockscreen.controller", //LOCKSCREEN CONTROLLER
        "app.call.controller", //CALL CONTROLLER
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
        'btford.socket-io',
        'dateRangePicker',
        'angular-svg-round-progress',
        'angular-flot',
        'irontec.simpleChat',
        'opentok',
        'jsTree.directive',
        'app.rlobRegister.controller',
        'opentok-whiteboard',
        'ui.mask',
        'app.sponsor1.controller'
        // 'angular-underscore'
    ])
    .factory('socket', function(socketFactory) {
        var host = location.hostname;
        var port = location.port;

        var socket = io.connect('https://' + host + '/', {
            'port': port,
            'reconnect': true,
            'reconnection delay': 2000,
            'max reconnection attempts': 10000,
            'force new connection': true,
            'secure': true
        });

        var socketFactory = socketFactory({
            ioSocket: socket
        })

        return socketFactory;
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

        .state('call', {
            params: {
                callUserInfo: null,
                callUser: null,
                isCaller: null,
                opentokInfo: null
            },
            views: {
                "root": {
                    templateUrl: "common/views/call.html",
                    controller: 'callController'
                }
            }
        })


        /* END */
    })

//When update any route
.run(function(beforeUnload, $window, $modalStack, $cookieStore, $interval, $state, $rootScope, $idle, $log, $keepalive, editableOptions, socket, toastr, localStorageService, TimeSheetService) {



    socket.on('reconnect', function() {
        if ($cookieStore.get("userInfo")) {
            socket.emit("reconnected", $cookieStore.get("userInfo").id);
        }
    })

    socket.on('reconnect_failed', function() {
        $cookieStore.remove("userInfo");
        $cookieStore.remove("companyInfo");
        $cookieStore.remove("doctorInfo");
        $cookieStore.remove("fromState");
        $state.go("security.login", null, {
            location: "replace",
            reload: true
        });

        socket.removeAllListeners();
    })

    var checkInterval;

    checkInterval = $interval(function() {
        if ($cookieStore.get("userInfo") != null || typeof $cookieStore.get("userInfo") !== 'undefined') {
            socket.emit("checkApp", $cookieStore.get("userInfo").id)
        }
    }, 5000);


    // socket.on("isLoggedIn",function(){
    //     toastr.error("Your Account Is Already Logged In!");

    //     $cookieStore.remove("userInfo");
    //     $cookieStore.remove("companyInfo");
    //     $cookieStore.remove("doctorInfo");
    //     $cookieStore.remove("fromState");
    //     $state.go("security.login",null,{location: "replace", reload: true});

    //     socket.removeAllListeners();
    // })


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

    if ($cookieStore.get("userInfo")) {
        socket.emit("reconnected", $cookieStore.get("userInfo").id);
    }

    if (!("Notification" in window)) {
        // alert("This browser does not support desktop notification");
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }
        });
    }

    $rootScope.$on("$locationChangeSuccess", function(event, current, previous) {

        if (current === previous) {
            if ($cookieStore.get("userInfo")) {
                socket.emit("reconnected", $cookieStore.get("userInfo").id);
            }
        }
    })


    $rootScope.$on("$stateChangeSuccess", function(e, toState, toParams, fromState, fromParams) {

        $modalStack.dismissAll();

        var locationHref = location.href;
        if (locationHref.indexOf('fromMobile=true') != -1) {
            e.preventDefault();
            return;
        }
        $cookieStore.put("fromState", {
            fromState: fromState,
            fromParams: fromParams
        });
        if (!$cookieStore.get("userInfo")) {
            socket.removeAllListeners();
            socket.emit('lostCookie');
            if (toState.name !== "security.forgot" && toState.name !== "security.login" && toState.name !== "security.term" && toState.name !== "security.redirect" && toState.name !== "security.rlobRegister") {
                e.preventDefault();
                $state.go("security.login", null, {
                    location: "replace",
                    reload: true
                });
            }
        }

    });
    $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
        //LOAD ROLE ON TREEAPPROVE
        if ($cookieStore.get("userInfo") && $cookieStore.get("userInfo").id) {
            TimeSheetService.LoadRole($cookieStore.get("userInfo").id).then(function(response) {
                if (response.status === "error") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Loading fail!", "Error");
                } else if (response.status === "fail") {
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("You not permission on Timesheet system!", "Fail");
                } else if (response.status === "success") {
                    localStorageService.set("position", response.position[0].TITLE);
                    //ROLE
                    if (toState.position !== undefined) {
                        var status = false;
                        angular.forEach(toState.position, function(postt, index) {
                            if (postt === localStorageService.get("position")) {
                                status = true;
                            }
                        });
                        if (status === false) {
                            $state.go("loggedIn.TimeSheetHome", null, {
                                "reload": true
                            });
                            toastr.error("You not permission!", "Error");
                            e.preventDefault();
                        }
                    }
                    //END ROLE
                } else {
                    //catch exception
                    $state.go("loggedIn.home", null, {
                        "reload": true
                    });
                    toastr.error("Server respose error!", "Error");
                }
                e.preventDefault();
            });
        }
        //END LOAD ROLE ON TREEAPPROVE
    });
})
