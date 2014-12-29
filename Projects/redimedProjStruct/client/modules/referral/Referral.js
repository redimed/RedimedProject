angular.module('app.loggedIn.referral', [
    'app.loggedIn.referral.controller',
    'app.loggedIn.referral.directives',
    'app.loggedIn.referral.services'
])
.config(function($stateProvider){
    $stateProvider
        .state("loggedIn.patient.referral", {
                abstract: true,
                views: {
                    "main-content@loggedIn.patient": {
                        templateUrl: "modules/referral/views/structure.html",
                        controller: "ReferralController"
                    }
                }
            })
        
        .state("loggedIn.patient.referral.list",{
            url:'/:patient_id/referral/:cal_id',
            views:{
                'main-content':{
                    templateUrl:"modules/referral/views/referral-list.html",
                    controller:"ReferralListController"
                }
            }
        })
})