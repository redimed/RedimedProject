angular.module("app.loggedIn.item", [
    "app.loggedIn.item.controller",
    "app.loggedIn.item.services",
]).config(function ($stateProvider) {
    $stateProvider
            // STRUCTURE
            .state("loggedIn.item", {
                abstract: true,
                templateUrl: "modules/item/views/structure.html",
                controller: "ItemController"
            })
            // HOME
            .state("loggedIn.item.list", {
                url: "/item/list",
                views: {
                    "main-content": {
                        templateUrl: "modules/item/views/list.html",
                        controller: "ItemListController"
                    }
                }
            })
            // HEADER
            .state("loggedIn.item.header", {
                url: "/item/header",
                views: {
                    "main-content": {
                        templateUrl: "modules/item/views/header.html",
                        controller: "ItemHeaderController"
                    }
                }
            })
    })