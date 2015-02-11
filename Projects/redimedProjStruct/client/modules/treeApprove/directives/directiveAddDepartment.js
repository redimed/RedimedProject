angular.module("app.loggedIn.treeApprove.AddDepartment.directive", [])
    .directive("addDepartment", function(treeApproveService, $state, toastr) {
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
                        scope.addOrUpdateTitle = "Update Department";
                        scope.addOrUpdateButton = "Update";
                        treeApproveService.loadOneDepartment(newModel).then(function(response) {
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
                        scope.addOrUpdateTitle = "Add Department";
                        scope.addOrUpdateButton = "Add";
                    }
                });
                //get companies
                treeApproveService.loadCompany().then(function(responsive) {
                    scope.companies = responsive.company;
                    //get sites
                    treeApproveService.loadSite().then(function(responsive) {
                        scope.sites = responsive.redimedSite;
                    });
                    //end get sites
                });
                //end get companies
            },
            templateUrl: "modules/treeApprove/directives/templates/addDepartment.html"
        };
    });
