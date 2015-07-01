angular.module("app.loggedIn.patient.consult")
.config(function ($stateProvider) {
    
    $stateProvider
        .state("loggedIn.patient.consult_load",{
            url: '/consult',
            views: {
                "main-content": {
                    templateUrl: 'modules/consultation/views/consult.html',
                    controller: 'PatientConsultController'
                }
            }
        })

           
    })