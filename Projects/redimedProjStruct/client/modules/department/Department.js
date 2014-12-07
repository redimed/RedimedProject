angular.module("app.loggedIn.department", [
    "app.loggedIn.department.controller",
    "app.loggedIn.department.services",
	"app.loggedIn.department.directives",
]).config(function ($stateProvider) {
    $stateProvider
            // STRUCTURE
            .state("loggedIn.department", {
                abstract: true,
                templateUrl: "modules/department/views/structure.html",
                controller: "DepartmentController"
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