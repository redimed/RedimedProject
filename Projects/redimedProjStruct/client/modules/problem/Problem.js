angular.module('app.loggedIn.problem', [
    'app.loggedIn.problem.controller',
    'app.loggedIn.problem.directive',
    'app.loggedIn.problem.service'
])
.config(function($stateProvider){
    $stateProvider
        .state("loggedIn.patient.problem", {
                abstract: true,
                views: {
                    "main-content@loggedIn.patient": {
                        templateUrl: "modules/referral/views/structure.html",
                        controller: "ProblemController"
                    }
                }
            })
        
        .state("loggedIn.patient.problem.list",{
            url:'/:patient_id/problem',
            views:{
                'main-content':{
                    templateUrl:"modules/problem/views/list.html",
                    controller:"ProblemListController"
                }
            }
        })
})