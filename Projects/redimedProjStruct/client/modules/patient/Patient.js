angular.module("app.loggedIn.patient", [
    "app.loggedIn.patient.controller",
    "app.loggedIn.patient.services",
    "app.loggedIn.patient.directives",

    "app.loggedIn.patient.claim",
    "app.loggedIn.patient.outside_referral",
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

    .state("loggedIn.patient.appointment", {
        url: '/appointment/:patient_id/:cal_id',
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/appointment.html",
                controller: "PatientAppointmentController"
            }
        }
    })
    .state("loggedIn.patient.detail", {
        url: "/:patient_id/detail",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/detail.html",
                controller: "PatientDetailController"
            }
        }
    })
    .state("loggedIn.patient.companies", {
        url: "/:patient_id/companies",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/companies.html",
                controller: "PatientCompaniesController"
            }
        }
    })
    .state("loggedIn.patient.workcover", {
        url: "/:patient_id/workcover/:cal_id",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/workcover.html",
                controller: "PatientWorkcoverController"
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