angular.module("app.loggedIn.treeApprove", [
        "app.loggedIn.treeApprove.service"
    ])
    .config(function($stateProvider) {
        $stateProvider

        //STRUCTURE
            .state("loggedIn.treeApprove", {
                abstract: true,
                url: "/tree-approve",
                templateUrl: "/modules/treeApprove/views/structure.html",
            })
            //END STRUCTURE

        //LOAD FUNCTION
        .state("loggedIn.treeApprove.loadListFunction", {
                url: "/load-list-function",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/treeApprove/extend_routes_treeApprove.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/treeApprove/controllers/ListFunctionController.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/treeApprove/directives/DirectiveAddFunction.js")
                            .then(function() {
                                $state.go("loggedIn.treeApprove.listFunction", null, {
                                    "reload": true
                                });
                            });
                        //END LOAD DIRECTIVE

                    }
                }
            })
            //END FUNCTION

        //LOAD TREE
        .state("loggedIn.treeApprove.loadListTree", {
                url: "/load-list-tree",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        //LOAD ROUTE
                        $ocLazyLoad.load("modules/treeApprove/extend_routes_treeApprove.js");
                        //END LOAD ROUTE

                        //LOAD CONTROLLER
                        $ocLazyLoad.load("modules/treeApprove/controllers/ListTreeController.js");
                        //END LOAD CONTROLLER

                        //LOAD DIRECTIVE
                        $ocLazyLoad.load("modules/treeApprove/directives/DirectiveAddTree.js")
                            .then(function() {
                                $state.go("loggedIn.treeApprove.listTree", null, {
                                    "reload": true
                                });
                            })
                            //END LOAD DIRECTIVE
                    }
                }
            })
            //END TREE

        //LOAD TREE DETAIL
        .state("loggedIn.treeApprove.loadDetailTree", {
            url: "/load-detail-tree",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    //LOAD ROUTE
                    $ocLazyLoad.load("modules/treeApprove/extend_routes_treeApprove.js");
                    //END LOAD ROUTE

                    //LOAD LIBRARY
                    $ocLazyLoad.load("vendor/jquery.orgChart-master/jquery.orgchart.js");
                    $ocLazyLoad.load("vendor/jquery.orgchart-master/jquery.orgchart.css");
                    //END LOAD LIBRARY

                    //LOAD CONTROLLER
                    $ocLazyLoad.load("modules/treeApprove/controllers/TreeDetail.js");
                    //END LOAD CONTROLLER

                    //LOAD DIRECTIVE
                    $ocLazyLoad.load("modules/treeApprove/directives/DirectiveAddNode.js")
                        .then(function() {
                            $state.go("loggedIn.treeApprove.detailTree", null, {
                                "reload": true
                            });
                        })
                        //END LOAD DIRECTIVE
                }
            }
        });
        //END TREE DETAIL
    });
