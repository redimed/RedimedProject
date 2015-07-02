angular.module('app.loggedIn.allergy', [])

.config(function($stateProvider){
    $stateProvider

        .state('loggedIn.allergy', {
            url: '/allergiesload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/extend_routes.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/controllers/AllergyController.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/controllers/AllergyListController.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/directives/AllergyDetailDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/directives/AllergyDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $state.go('loggedIn.allergy_list');
                        }
                    ]);
                }
            }
        })

        .state('loggedIn.patient.allergy', {
            url: '/allergiespatientload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                      async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/extend_routes.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/controllers/AllergyController.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/controllers/AllergyListController.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/directives/AllergyDetailDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/allergies/directives/AllergyDirective.js")
                            .then(function() {
                                callback(null);
                            });
                        },
                        function(callback) {
                            $state.go('loggedIn.patient.allergy_list');
                        }
                    ]);
                }
            }
        })
})