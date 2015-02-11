angular.module("app.loggedIn.treeApprove", [
        "app.loggedIn.treeApprove.controllers",
        "app.loggedIn.treeApprove.directives",
        "app.loggedIn.treeApprove.service"
    ])
    .config(function($stateProvider) {
        $stateProvider
        //LIST SYSTEM
            .state("loggedIn.listSystem", {
                url: "/listSystem",
                templateUrl: "modules/treeApprove/views/listSystem.html",
                controller: "listSystemController"
            })
            //END LIST SYSTEM

        //DEPARTMENT
        .state("loggedIn.listDepartment", {
                url: "/listDepartment",
                templateUrl: "modules/treeApprove/views/listDepartment.html",
                controller: "listDepartmentController"
            })
            //END DEPARTMENT

        //ADD SYSTEM
        .state("loggedIn.detailSystem", {
            url: "/detailSystem",
            templateUrl: "modules/treeApprove/views/detailSystem.html",
            controller: "detailSystemController"
        });
        //END ADD SYSTEM
    });
