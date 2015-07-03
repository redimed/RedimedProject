angular.module("app.loggedIn.treeApprove", [
        "app.loggedIn.treeApprove.controllers",
        "app.loggedIn.treeApprove.directives",
        "app.loggedIn.treeApprove.service"
    ])
    .config(function($stateProvider) {
        $stateProvider

        //STRUCTURE
            .state("loggedIn.treeApprove", {
                url: "/tree-approve",
                abstract: true,
                templateUrl: "/modules/treeApprove/views/structure.html"
            })
            //END STRUCTURE

        //LIST SYSTEM
        .state("loggedIn.treeApprove.ListFunction", {
                url: "/list-function",
                views: {
                    "main-content": {
                        templateUrl: "modules/treeApprove/views/ListFunction.html",
                        controller: "ListFunctionController"
                    }
                }
            })
            //END LIST SYSTEM

        //DEPARTMENT
        .state("loggedIn.treeApprove.ListTree", {
                url: "/list-tree",
                views: {
                    "main-content": {
                        templateUrl: "modules/treeApprove/views/ListTree.html",
                        controller: "ListTreeController"
                    }
                }
            })
            //END DEPARTMENT

        //ADD SYSTEM
        .state("loggedIn.treeApprove.DetailTree", {
            url: "/detail-tree",
            views: {
                "main-content": {
                    templateUrl: "modules/treeApprove/views/DetailTree.html",
                    controller: "DetailTree"
                }
            }
        });
        //END ADD SYSTEM
    });
