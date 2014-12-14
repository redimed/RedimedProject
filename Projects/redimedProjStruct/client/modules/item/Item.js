angular.module("app.loggedIn.item", [
    "app.loggedIn.item.controller",
    "app.loggedIn.item.services",
    "app.loggedIn.item.directives",
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
            // FEE
            .state("loggedIn.item.fee", {
                url: "/item/fee",
                views: {
                    "main-content": {
                        templateUrl: "modules/item/views/fee.html",
                        controller: "ItemFeeController"
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