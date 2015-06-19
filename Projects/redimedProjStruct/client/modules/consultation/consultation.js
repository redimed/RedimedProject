angular.module("app.loggedIn.patient.consult", [
    "app.loggedIn.patient.consult.controller",
    "app.loggedIn.patient.consult.consulthistoryController",
    "app.loggedIn.patient.consult.measurementController",
    "app.loggedIn.patient.consult.scriptController",
    "app.loggedIn.patient.consult.itemsheetController",
    "app.loggedIn.patient.consult.services",
    "app.loggedIn.patient.consult.directives",
    "app.loggedIn.corres.list.controller",
    "app.loggedIn.corres.list.directive",
    "app.loggedIn.corres.add.controller",
    "app.loggedIn.corres.add.directive",
    "app.loggedIn.corres.edit.controller",
    "app.loggedIn.corres.edit.directive",
    "app.kiss.timer.directive",
    "app.loggedIn.patient.exercise.directives.list"
]).config(function ($stateProvider) {
    $stateProvider

        .state("loggedIn.patient.consult",{
            url: '/consult',
            views: {
                "main-content": {
                    templateUrl: 'modules/consultation/views/consult.html',
                    controller: 'PatientConsultController'
                }
            }
        })

           
    })