angular.module('app.loggedIn.referral', [])

.config(function($stateProvider){
    $stateProvider
    	.state("loggedIn.patient.referral", {
                abstract: true,
                views: {
                    "main-content@loggedIn.patient": {
                        templateUrl: "modules/referral/views/structure.html",
                        controller: "ReferralController"
                    }
                }
            })
        .state('loggedIn.patient.referral.list', {
            url: '/referralload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    $ocLazyLoad.load("modules/referral/extend_routes.js");
                    $ocLazyLoad.load("modules/referral/controllers/referralController.js");
                    $ocLazyLoad.load("modules/referral/controllers/referralListController.js");
                    $ocLazyLoad.load("modules/referral/directives/ReferralDetailDirective.js");
                    $ocLazyLoad.load("modules/referral/directives/ReferralDirectives.js");
                    $ocLazyLoad.load("modules/referral/directives/ReferralSearchDirective.js")
                    .then(function(){
                        $state.go('loggedIn.patient.referral_list');
                    })
                }
            }
        })


})