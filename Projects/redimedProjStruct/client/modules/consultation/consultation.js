angular.module("app.loggedIn.patient.consult", [
    "app.loggedIn.patient.consult.controller",
    "app.loggedIn.patient.consult.measurementController",
    "app.loggedIn.patient.consult.scriptController",
    "app.loggedIn.patient.consult.itemsheetController",
    "app.loggedIn.patient.consult.services",
	"app.loggedIn.patient.consult.directives",
    "app.kiss.timer.directive"
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