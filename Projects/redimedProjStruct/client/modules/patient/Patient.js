angular.module("app.loggedIn.patient", [
    "app.loggedIn.patient.controller",
    "app.loggedIn.patient.services",
    "app.loggedIn.patient.directives",
    "app.loggedIn.patient.listall.controller",
    "app.loggedIn.patient.claim",
    "app.loggedIn.patient.consult",
    "app.loggedIn.patient.injuryManagement",
    "app.loggedIn.patient.problem"
])

.config(function ($stateProvider) {
    $stateProvider

    .state("loggedIn.patient", {
        url: "/patient/:patient_id/:cal_id",
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
        url: '/appointment',
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/appointment.html",
                controller: "PatientAppointmentController"
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
  
    .state("loggedIn.patient.invoice_detail", {
        url: "/:header_id/invoices/detail",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/invoice_detail.html",
                controller: "PatientInvoiceDetailController"
            }
        }
    })
    .state("loggedIn.patient.invoices", {
        url: "/invoices",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/invoices.html",
                controller: "PatientInvoicesController"
            }
        }
    })
     .state("loggedIn.patient.recall", {
        url: "/recall",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/recall.html",
                controller: "PatientRecallController"
            }
        }
    })
    .state("loggedIn.patient.appt", {
        url: "/appt",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/appt.html",
                controller: "PatientApptListController"
            }
        }
    })

    //tannv.dts@gmail.com
    /*.state("loggedIn.patient.companies", {
        url: "/companies",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/companies.html",
                controller: "PatientCompaniesController"
            }
        }
    })*/

    .state("loggedIn.patient.workcover", {
        url: "/workcover",
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
    /*.state("loggedIn.patient.outside_referral", {
        url: "/:patient_id/outside_referral",
        views: {
            "main-content": {
                templateUrl: "modules/patient/views/outside_referrals.html",
                controller: "PatientOutsideReferralsController"
            }
        }
    })*/
    .state("loggedIn.patient.itemsheet",{
        url:"/appointment/itemsheet",
        views: {
            "main-content":{
                templateUrl: "modules/patient/views/itemsheet.html",
                controller: "PatientItemSheetController"
            }
        }
    })
    .state("loggedIn.patient.apptdoc", {
        url:'/appointment/document',
        views:{
            "main-content":{
                templateUrl:'modules/patient/views/apptdoc.html',
                controller:'PatientApptDocController'
            }
        }
    })
    .state("loggedIn.listall", {
        url:'/allPatients',
        templateUrl: "modules/patient/views/allpatients.html",
        controller: "PatientListAllController"
    })
    .state("loggedIn.patient.checkin",{
        url:'/checkin',
        views:{
            "main-content":{
                templateUrl:'modules/patient/views/checkin.html',
                controller:'PatientCheckinController'
            }
        }
    })

   
    
})