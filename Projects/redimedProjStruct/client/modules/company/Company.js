angular.module("app.loggedIn.company", [
    "app.loggedIn.company.controller",
    "app.loggedIn.company.services",
])

.config(function ($stateProvider) {
    $stateProvider

    // STRUCTURE
    .state("loggedIn.company", {
        abstract: true,
        templateUrl: "modules/company/views/structure.html",
        controller: "CompanyController"
    })
    // HOME
    .state("loggedIn.company.home", {
        url: "/company/home",
        views: {
            "main-content": {
                templateUrl: "modules/company/views/home.html",
                controller: "CompanyHomeController"
            }
        }
    })
    // HOME
    .state("loggedIn.company.service", {
        url: "/company/service",
        views: {
            "main-content": {
                templateUrl: "modules/company/views/service.html",
                controller: "CompanyServiceController"
            }
        }
    })
})