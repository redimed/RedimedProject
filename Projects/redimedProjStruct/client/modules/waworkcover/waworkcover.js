/**
 * Created by Minh on 10/24/2014.
 */
angular.module("app.loggedIn.waworkcover", [
    "app.loggedIn.waworkcover.controller",
    "app.loggedIn.waworkcover.services"
])
    .config(function ($stateProvider) {
        $stateProvider
            // STRUCTURE
            .state("loggedIn.doctor.patients.detail.appt.waworkcover", {
                abstract: true,
                views: {
                    "main-content@loggedIn.doctor":{
                        templateUrl: "modules/waworkcover/views/structure.html",
                        controller: "waworkcoverController"
                    }    
                }
            })

            .state("loggedIn.doctor.patients.detail.appt.waworkcover.home",{
                url: "/wa/workcover/home",
                views: {
                    "main-content": {
                        templateUrl: "modules/waworkcover/views/home.html",
                        controller: "waworkcoverHomeController"
                    }
                }
            })
            .state("loggedIn.doctor.patients.detail.appt.waworkcover.first",{
                url: "/wa/workcover/first",
                views: {
                    "main-content": {
                        templateUrl: "modules/waworkcover/views/first.html",
                        controller: "waworkcoverFirstController"
                    }
                }
            })
            .state("loggedIn.doctor.patients.detail.appt.waworkcover.progress",{
                url: "/wa/workcover/progress",
                views: {
                    "main-content": {
                        templateUrl: "modules/waworkcover/views/progress.html",
                        controller: "waworkcoverProgressController"
                    }
                }
            })
            .state("loggedIn.doctor.patients.detail.appt.waworkcover.final",{
                url: "/wa/workcover/final",
                views: {
                    "main-content": {
                        templateUrl: "modules/waworkcover/views/final.html",
                        controller: "waworkcoverFinalController"
                    }
                }
            })

    });