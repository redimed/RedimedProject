angular.module('app.loggedIn.patient.problem', [])

.config(function($stateProvider){
    $stateProvider

        .state('loggedIn.patient.problem_list', {
            url: '/problemload',
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad){
                    $ocLazyLoad.load("modules/problem/extend_routes.js");
                    $ocLazyLoad.load("modules/problem/controllers/ProblemController.js");
                    $ocLazyLoad.load("modules/problem/controllers/ProblemListController.js");
                    $ocLazyLoad.load("modules/problem/directives/ProblemDetailDirective.js");
                    $ocLazyLoad.load("modules/problem/directives/ProblemDirective.js")
                   
                    .then(function(){
                        $state.go('loggedIn.patient.problemlist');
                    })
                }
            }
        })


})