angular.module("app.loggedIn.patient", [
    "app.loggedIn.patient.controller",
    "app.loggedIn.patient.services",
    "app.loggedIn.patient.directives",

    "app.loggedIn.patient.claim"
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
            "main-content":{
                templateUrl: "modules/patient/views/booking.html",
                controller: "PatientBookingController"
            }
        }
    })

                    .state("loggedIn.patient.detail", {
                        url: "/detail",
                        views: {
                            "main-content": {
                                templateUrl: "modules/patient/views/detail.html",
                                controller: "PatientDetailController"
                            }
                        }
                    })
                    .state("loggedIn.patient.referrals", {
                        url: "/referrals",
                        views: {
                            "main-content": {
                                templateUrl: "modules/patient/views/referrals.html",
                                controller: "PatientReferralsController"
                            }
                        }
                    })
        })