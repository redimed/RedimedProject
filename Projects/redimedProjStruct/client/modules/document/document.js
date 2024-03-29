/**
 * Created by meditech on 24/09/2014.
 */

angular.module("app.loggedIn.document", [
    "app.loggedIn.document.demo.controllers",
    "app.loggedIn.document.cat2.controllers",
    "app.loggedIn.document.cat3.controllers",
    "app.loggedIn.document.FA.controllers",
    "app.loggedIn.document.MA.controllers",
    "app.loggedIn.document.IDS.controllers",
    "app.loggedIn.document.gorgonFA.controllers",
    "app.loggedIn.document.gorgonMA.controllers",
    "app.loggedIn.document.gorgonMH.controllers",
    "app.loggedIn.document.gorgonUQ.controllers",
    "app.loggedIn.document.services",
    "app.loggedIn.document.MH.controllers",
    "app.loggedIn.document.MRS.controllers",
    "app.loggedIn.document.SA1.controllers",
    "app.loggedIn.document.SA2.controllers",
    "app.loggedIn.document.COE.controllers",
    "app.loggedIn.document.form18.controllers"
])
    .config(function ($stateProvider) {
        $stateProvider

            .state("loggedIn.demo", {
                url: "/demo",

                templateUrl: "modules/document/views/DemoDocument.html",
                controller: 'demoController'
            })

            .state("loggedIn.COE", {
                url: "/COE/:CalID/:PatientID",
                templateUrl: "modules/document/views/COE.html",
                controller: 'COEController'
            })

            .state("loggedIn.category2", {
                url: "/category2/:CalID/:PatientID",

                templateUrl: "modules/document/views/category2.html",
                controller: 'Cat2Controller'

            })

            .state("loggedIn.category3", {
                url: "/category3/:CalID/:PatientID",

                templateUrl: "modules/document/views/category3.html",
                controller: 'Cat3Controller'

            })

            .state("loggedIn.FA", {
                url: "/FA/:CalID/:PatientID",

                templateUrl: "modules/document/views/functionAssessment.html",
                controller: 'FAController'

            })

            .state("loggedIn.MA", {
                url: "/MA/:CalID/:PatientID",

                templateUrl: "modules/document/views/medicalAssessment.html",
                controller: 'MAController'

            })

            .state("loggedIn.IDS", {
                url: "/IDS/:CalID/:PatientID",

                templateUrl: "modules/document/views/instantScreen.html",
                controller: 'IDSController'

            })

            .state("loggedIn.gorgonFA", {
                url: "/gorgonFA/:CalID/:PatientID",

                templateUrl: "modules/document/views/gorgonFA.html",
                controller: 'gorgonFAController'

            })

            .state("loggedIn.gorgonMA", {
                url: "/gorgonMA/:CalID/:PatientID",

                templateUrl: "modules/document/views/gorgonMA.html",
                controller: 'gorgonMAController'

            })

            .state("loggedIn.gorgonMH", {
                url: "/gorgonMH/:CalID/:PatientID",

                templateUrl: "modules/document/views/gorgonMH.html",
                controller: 'gorgonMHController'

            })

            .state("loggedIn.gorgonUQ", {
                url: "/gorgonUQ/:CalID/:PatientID",

                templateUrl: "modules/document/views/gorgonUQ.html",
                controller: 'gorgonUQController'

            })

            .state("loggedIn.Form18", {
                url: "/Form18/:CalID/:PatientID",

                templateUrl: "modules/document/views/form18.html",
                controller: 'form18Controller'
            })

            .state("loggedIn.MH", {
                url: "/MH/:CalID/:PatientID",

                templateUrl: "modules/document/views/medicalhistory.html",
                controller: 'MHController'
            })

            .state("loggedIn.MRS", {
                url: "/MRS/:CalID/:PatientID",

                templateUrl: "modules/document/views/medicalresultsummary.html",
                controller: 'MRSController'
            })

            .state("loggedIn.SA1", {
                url: "/SA1/:CalID/:PatientID",

                templateUrl: "modules/document/views/audiogramresults1.html",
                controller: 'SA1Controller'
            })

            .state("loggedIn.SA2", {
                url: "/SA2/:CalID/:PatientID",

                templateUrl: "modules/document/views/audiogramresults2.html",
                controller: 'SA2Controller'
            })


    });