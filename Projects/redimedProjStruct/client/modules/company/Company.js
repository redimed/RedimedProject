angular.module("app.loggedIn.company", [
    "app.loggedIn.company.controller",
    "app.loggedIn.company.services",
    "app.loggedIn.company.directives",
])

.config(function($stateProvider) {
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

    // LIST
    .state("loggedIn.company.list", {
        url: "/company/list",
        views: {
            "main-content": {
                templateUrl: "modules/company/views/list.html",
                controller: "CompanyListController"
            }
        }
    })
    // DETAIL
    .state("loggedIn.company.detail", {
        url: "/company/detail",
        views: {
            "main-content": {
                templateUrl: "modules/company/views/detail.html",
                controller: "CompanyDetailController"
            }
        }
    })
     // ADD
    .state("loggedIn.company.add", {
        url: "/company/add",
        views: {
            "main-content": {
                templateUrl: "modules/company/views/add.html",
                controller: "CompanyAddController"
            }
        }
    })
})