angular.module('app.loggedIn.allergy', [])

.config(function($stateProvider){
    $stateProvider

        .state('loggedIn.allergy', {
            url: '/allergiesload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    $ocLazyLoad.load("modules/allergies/extend_routes.js");
                    $ocLazyLoad.load("modules/allergies/controllers/AllergyController.js");
                    $ocLazyLoad.load("modules/allergies/controllers/AllergyListController.js");
                    $ocLazyLoad.load("modules/allergies/directives/AllergyDetailDirective.js");
                    $ocLazyLoad.load("modules/allergies/directives/AllergyDirective.js")
                    .then(function(){
                        $state.go('loggedIn.allergy_list');
                    })
                }
            }
        })

        .state('loggedIn.patient.allergy', {
            url: '/allergiespatientload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    $ocLazyLoad.load("modules/allergies/extend_routes.js");
                    $ocLazyLoad.load("modules/allergies/controllers/AllergyController.js");
                    $ocLazyLoad.load("modules/allergies/controllers/AllergyListController.js");
                    $ocLazyLoad.load("modules/allergies/directives/AllergyDetailDirective.js");
                    $ocLazyLoad.load("modules/allergies/directives/AllergyDirective.js")
                    .then(function(){
                        $state.go('loggedIn.patient.allergy_list');
                    })
                }
            }
        })


})