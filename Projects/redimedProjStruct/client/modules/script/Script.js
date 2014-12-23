angular.module('app.loggedIn.script', [
    'app.loggedIn.script.controller',
    'app.loggedIn.script.directive',
    'app.loggedIn.script.services'
])
.config(function($stateProvider){
    $stateProvider
        .state("loggedIn.patient.script", {
                abstract: true,
                views: {
                    "main-content@loggedIn.patient": {
                        templateUrl: "modules/script/views/structure.html",
                        controller: "ScriptController"
                    }
                }
            })
        
        .state("loggedIn.patient.script.list",{
            url:'/:patient_id/script/:cal_id',
            views:{
                'main-content':{
                    templateUrl:"modules/script/views/script-list.html",
                    controller:"ScriptListController"
                }
            }
        })
})