angular.module("app.loggedIn.treeApprove.AddNode.directive", [])
    .directive("addNode", function(treeApproveService, toastr, $state) {
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
                        scope.addOrUpdateTitle = "Update Node";
                        scope.addOrUpdateButton = "Update";
                        treeApproveService.loadOneNode(newModel).then(function(response) {
                            if (response.status === "error") {
                                toastr.error("Loading error!", "Error");
                            } else if (response.status === "fail") {
                                toastr.error("Loading fail!", "Fail");
                            } else if (response.status === "success") {
                                scope.info = angular.copy(response.result);
                            } else {
                                //catch exception
                                $state.go("loggedIn.home", null, {
                                    "reload": true
                                });
                                toastr.error("Server not reponse!", "Error");
                            }
                        });
                    } else {
                        scope.addOrUpdateTitle = "Add Node";
                        scope.addOrUpdateButton = "Add";
                    }
                });
            },
            templateUrl: "modules/treeApprove/directives/templates/addNode.html"
        };
    });
