angular.module("app.loggedIn.insurer", [
    "app.loggedIn.insurer.controller",
    "app.loggedIn.insurer.services",
    "app.loggedIn.insurer.directives",
])
.config(function($stateProvider) {
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
        // DETAIL
        .state("loggedIn.insurer.detail", {
            url: "/insurer/detail",
            views: {
                "main-content": {
                    templateUrl: "modules/insurer/views/detail.html",
                    controller: "InsurerDetailController"
                }
            }
        })
        // ADD
        .state("loggedIn.insurer.add", {
            url: "/insurer/add",
            views: {
                "main-content": {
                    templateUrl: "modules/insurer/views/add.html",
                    controller: "InsurerAddController"
                }
            }
        })
})


