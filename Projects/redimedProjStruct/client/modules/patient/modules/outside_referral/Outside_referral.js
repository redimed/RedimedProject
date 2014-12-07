angular.module("app.loggedIn.patient.outside_referral", [
    // "app.loggedIn.patient.claim.controllers",
    // "app.loggedIn.patient.claim.services"
])

.config(function ($stateProvider) {
    $stateProvider

    .state("loggedIn.patient.outside_referral", {
        url: "/:patient_id/outside_referrals",
        abstract: true,
        templateUrl: "modules/patient/modules/claim/views/structure.html",
        controller: "ClaimController"
    })
    .state("loggedIn.patient.outside_referral.list", {
        url: "/list",

        views: {
            "main-content": {
                templateUrl: "modules/patient/modules/outside_referral/views/list.html",
                // controller: "PatientCompaniesController"
            }
        }
    })
    // .state("loggedIn.patient.claim.list", {
    //     url: "/list",
    //     views: {
    //         "main-content@loggedIn.patient": {
    //             templateUrl: "modules/patient/modules/claim/views/list.html",
    //             controller: "ClaimListController"
    //         }
    //     }
    // })
})   