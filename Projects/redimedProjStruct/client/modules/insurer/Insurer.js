angular.module("app.loggedIn.insurer", [
    "app.loggedIn.insurer.controller",
    "app.loggedIn.insurer.services",
])
.config(function ($stateProvider) {
    $stateProvider
    // STRUCTURE
    .state("loggedIn.insurer", {
        abstract: true,
        templateUrl: "modules/insurer/views/structure.html",
        controller: "InsurerController"
    })
    // HOME
    .state("loggedIn.insurer.list", {
        url: "/insurer/list",
        views: {
            "main-content": {
                templateUrl: "modules/insurer/views/list.html",
                controller: "InsurerListController"
            }
        }
    })
})


