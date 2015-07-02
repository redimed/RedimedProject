angular.module('app.loggedIn.problem', [])

.config(function($stateProvider){
    $stateProvider

        .state('loggedIn.patient.problem', {
            url: '/problemload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    async.waterfall([
                        function(callback){
                            $ocLazyLoad.load("modules/problem/extend_routes.js")
                            .then(function() {
                                callback(null);
                            })
                        },
                        function(callback){
                            $ocLazyLoad.load("modules/problem/controllers/ProblemController.js")
                            .then(function() {
                                callback(null);
                            })
                        },
                        function(callback){
                            $ocLazyLoad.load("modules/problem/controllers/ProblemListController.js")
                            .then(function() {
                                callback(null);
                            })
                        },
                        function(callback){
                            $ocLazyLoad.load("modules/problem/directives/ProblemDetailDirective.js")
                            .then(function() {
                                callback(null);
                            })
                        },
                        function(callback){
                            $ocLazyLoad.load("modules/problem/directives/ProblemDirective.js")
                            .then(function() {
                                callback(null);
                            })
                        },
                        function(callback){
                            $state.go('loggedIn.patient.problem_list');
                        },
                    ]);
                }
            }
        })


})