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
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/treeApprove/extend_routes_treeApprove.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/treeApprove/controllers/ListFunctionController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/treeApprove/directives/DirectiveAddFunction.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.treeApprove.listFunction");
                            }
                        ]);

                    }
                }
            })
            //END FUNCTION

        //LOAD TREE
        .state("loggedIn.treeApprove.loadListTree", {
                url: "/load-list-tree",
                resolve: {
                    init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                        async.waterfall([
                            function(callback) {
                                $ocLazyLoad.load("modules/treeApprove/extend_routes_treeApprove.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },

                            function(callback) {
                                $ocLazyLoad.load("modules/treeApprove/controllers/ListTreeController.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $ocLazyLoad.load("modules/treeApprove/directives/DirectiveAddTree.js")
                                    .then(function() {
                                        callback(null);
                                    });
                            },
                            function(callback) {
                                $state.go("loggedIn.treeApprove.listTree");
                            }

                        ]);
                    }
                }
            })
            //END TREE

        //LOAD TREE DETAIL
        .state("loggedIn.treeApprove.loadDetailTree", {
            url: "/load-detail-tree",
            resolve: {
                init: function($q, $rootScope, $state, $timeout, $ocLazyLoad) {
                    async.waterfall([
                        function(callback) {
                            $ocLazyLoad.load("modules/treeApprove/extend_routes_treeApprove.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/jquery.orgChart-master/jquery.orgchart.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("vendor/jquery.orgchart-master/jquery.orgchart.css")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/treeApprove/controllers/TreeDetail.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $ocLazyLoad.load("modules/treeApprove/directives/DirectiveAddNode.js")
                                .then(function() {
                                    callback(null);
                                });
                        },
                        function(callback) {
                            $state.go("loggedIn.treeApprove.detailTree");
                        }
                    ]);
                }
            }
        });
        //END TREE DETAIL
    });
