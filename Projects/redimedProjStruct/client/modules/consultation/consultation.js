angular.module("app.loggedIn.consult", [
    "app.loggedIn.consult.controller",
    "app.loggedIn.consult.services",
	"app.loggedIn.consult.directives",
]).config(function ($stateProvider) {
    $stateProvider
        // STRUCTURE
        .state("loggedIn.consult", {
            abstract: true,
            templateUrl: "modules/consultation/views/structure.html",
            controller: "ConsultController"
        })

        .state("loggedIn.consult.patient",{
            url: "/online/consult/:patient_id/:cal_id",
            views: {
                "main-content":{
                    templateUrl: "modules/consultation/views/consult.html",
                    controller: "PatientConsultController"
                }
            }
        })
        
           
    })