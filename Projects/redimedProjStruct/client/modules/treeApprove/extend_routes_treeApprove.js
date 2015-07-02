angular.module("app.loggedIn.treeApprove")
    .config(function($stateProvider) {
        $stateProvider
        //LIST SYSTEM
            .state("loggedIn.treeApprove.listFunction", {
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
        .state("loggedIn.treeApprove.listTree", {
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
        .state("loggedIn.treeApprove.detailTree", {
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
