angular.module("app.loggedIn.treeApprove", [
        "app.loggedIn.treeApprove.controllers",
        "app.loggedIn.treeApprove.directives",
        "app.loggedIn.treeApprove.service"
    ])
    .config(function($stateProvider) {
        $stateProvider
        //LIST SYSTEM
            .state("loggedIn.ListFunction", {
                url: "/ListFunction",
                templateUrl: "modules/treeApprove/views/ListFunction.html",
                controller: "ListFunctionController"
            })
            //END LIST SYSTEM

        //DEPARTMENT
        .state("loggedIn.ListTree", {
                url: "/ListTree",
                templateUrl: "modules/treeApprove/views/ListTree.html",
                controller: "ListTreeController"
            })
            //END DEPARTMENT

        //ADD SYSTEM
        .state("loggedIn.DetailTree", {
            url: "/DetailTree",
            templateUrl: "modules/treeApprove/views/DetailTree.html",
            controller: "DetailTree"
        });
        //END ADD SYSTEM
    });
