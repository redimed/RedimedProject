angular.module("app", [
    "ui.router",                // ANGULAR UI ROUTER
    "ui.bootstrap",             // ANGULAR BOOTSTRAP
    "angularFileUpload",        // ANGULAR FILE UPLOAD
    "restangular",              // RESTANGULAR
    "ngCookies",                // ANGULAR COOKIES
    "pascalprecht.translate",   // ANGULAR TRANSLATE
    "ui.select",                // ANGULAR UI SELECT
    "toastr",                   // ANGULAR TOASTR
    "angular-loading-bar",      // ANGULAR LOADING BAR
    "ngTable",                  // ANGULAR TABLE
    "app.loggedIn",             // MODULES LOGGED IN
    "app.security",              // FOR LOGIN, FOTGOT FORM, REGISTER FORM


    "app.directive.common"      // CUSTOM DIRECTIVES
])

.config(function ($stateProvider, $urlRouterProvider, $translateProvider, RestangularProvider) {
    // TRANSLATE LANGUAGE
    /*$translateProvider.useStaticFilesLoader({
        prefix: "/antele/languages/",
        suffix: ".json"
    });

    $translateProvider.preferredLanguage("en");*/
    // END TRANSLATE LANGUAGE

    // RESTANGULAR DEFAULT
    RestangularProvider.setBaseUrl("");

    $urlRouterProvider.otherwise('/');

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
    /* END */
})

//When update any route
.run(function($cookieStore, $state, $rootScope){
    // Use when update any state
    $rootScope.$on("$stateChangeSuccess", function(e, toState, fromState, fromParams){
        if(!$cookieStore.get("userInfo")){
            if(toState.name !== "security.forgot" && toState.name !== "security.login"){
                e.preventDefault();
                $state.go("security.login");
            }
        }
    });
})