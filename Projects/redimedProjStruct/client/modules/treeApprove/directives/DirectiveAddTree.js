angular.module("app.loggedIn.treeApprove.AddDepartment.directive", [])
    .directive("addTree", function(TreeApproveService, $state, toastr) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                onCancel: "&",
                onSave: "&",
                ngModel: "=",
            },
            link: function(scope, element, attrs) {
                scope.$watch("ngModel", function(newModel) {
                    if (newModel !== null) {
                        scope.addOrUpdateTitle = "Update Tree";
                        scope.addOrUpdateButton = "Update";
                        TreeApproveService.LoadOneTree(newModel).then(function(response) {
                            if (response.status === "success") {
                                scope.info = response.result;
                            } else if (response.status === "fail") {
                                toastr.error("Loading fail!", "Error");
                            } else {
                                //catch exception
                                $state.go("loggedIn.home", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    } else {
                        scope.addOrUpdateTitle = "Add Tree";
                        scope.addOrUpdateButton = "Add";
                    }
                });
                //get companies
                TreeApproveService.LoadCompany().then(function(responsive) {
                    scope.companies = responsive.company;
                    //get sites
                    TreeApproveService.LoadSite().then(function(responsive) {
                        scope.sites = responsive.redimedSite;
                    });
                    //end get sites
                });
                //end get companies

                /* MODEL OF USER */
            },
            templateUrl: "modules/treeApprove/directives/templates/AddTree.html"
        };
    });
