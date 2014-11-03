angular.module("app.loggedIn.patient", [
    "app.loggedIn.patient.controller",
    "app.loggedIn.patient.services",
])

.config(function ($stateProvider) {
    $stateProvider

    .state("loggedIn.patient", {
        url: "/patient",
        abstract: true,
        templateUrl: "modules/patient/views/structure.html",
        controller: "PatientController"
    })

    .state("loggedIn.patient.list", {
        url: "/list",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/list.html",
                controller: "PatientListController"
            }
        }
    })

    .state("loggedIn.patient.booking", {
        url: "/booking",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/booking.html",
                controller: "PatientBookingController"
            }
        }
    })
})