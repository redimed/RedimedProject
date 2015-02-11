angular.module("app.loggedIn.treeApprove.AddSystem.directive", [])
    .directive("addSystem", function(treeApproveService, toastr, $state) {
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
                        scope.addOrUpdateTitle = "Update System";
                        scope.addOrUpdateButton = "Update";
                        treeApproveService.loadOneSystem(newModel).then(function(response) {
                            if (response.status === "success") {
                                scope.info = response.result;
                                scope.info.oldName = scope.info.TYPE_NAME;
                            } else if (response.status === "fail") {
                                $state.go("loggedIn.listSystem", null, {
                                    "reload": true
                                });
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
                        scope.addOrUpdateTitle = "Add System";
                        scope.addOrUpdateButton = "Add";
                    }
                });
            },
            templateUrl: "modules/treeApprove/directives/templates/addSystem.html"
        };
    });
