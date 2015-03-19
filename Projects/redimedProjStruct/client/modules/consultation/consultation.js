angular.module("app.loggedIn.onlineConsult", [
    "app.loggedIn.onlineConsult.controller",
    "app.loggedIn.onlineConsult.services",
	"app.loggedIn.onlineConsult.directives",
]).config(function ($stateProvider) {
    $stateProvider
        // STRUCTURE
        .state("loggedIn.consultation", {
            url: "/onlineConsult",
            abstract: true,
            templateUrl: "modules/consultation/views/structure.html",
            controller: "ConsultController"
        })
        // LIST
        .state("loggedIn.department.list", {
            url: "/department/list",
            views: {
                "main-content": {
                    templateUrl: "modules/department/views/list.html",
                    controller: "DepartmentListController"
                }
            }
        })
           
    })