angular.module("app.loggedIn.patient.claim", [
    "app.loggedIn.patient.claim.controllers",
    "app.loggedIn.patient.claim.services"
])

.config(function ($stateProvider) {
    $stateProvider

    // .state("loggedIn.patient.claim", {
    //     url: "/claim",
    //     templateUrl: "modules/patient/modules/claim/views/structure.html",
    //     controller: "ClaimController"
    // })

    // .state("loggedIn.patient.claim.list", {
    //     url: "/list",
    //     views: {
    //         "main-content": {
    //             templateUrl: "modules/patient/modules/claim/views/list.html",
    //             controller: "ClaimListController"
    //         }
    //     }
    // })
})   