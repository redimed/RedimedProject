angular.module("app.loggedIn.department").config(function ($stateProvider) {
    $stateProvider
         .state("loggedIn.department_list", {
                url: "/department/list",
                templateUrl: "modules/department/views/list.html",
                controller: "DepartmentListController"
            })

            // // STRUCTURE
            // .state("loggedIn.department", {
            //     abstract: true,
            //     templateUrl: "modules/department/views/structure.html",
            //     controller: "DepartmentController"
            // })
            // // LIST
            // .state("loggedIn.department.list", {
            //     url: "/department/list",
            //     views: {
            //         "main-content": {
            //             templateUrl: "modules/department/views/list.html",
            //             controller: "DepartmentListController"
            //         }
            //     }
            // })
           
    })