angular.module("app.loggedIn.TimeSheet.StepEmployee.Directive", [])
    .directive("stepEmployee", function(TimeSheetService, $state, toastr) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                ngModel: "=",
                onCancel: "&",
                onSave: "&"
            },
            link: function(scope, elem, attrs) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined && newModel !== null && newModel.length !== 0) {
                        TimeSheetService.StepEmployee(newModel).then(function(response) {
                            if (response.status === "error") {
                                toastr.error("Loading fail!", "Error");
                            } else if (response.status === "success") {
                                //LOAD
                                console.log(response.result);
                            } else {
                                //catch exception
                                $state.go("loggedIn.home", null, {
                                    "reload": true
                                });
                                toastr.error("Server not response!", "Error");
                            }
                        });
                    }
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/StepEmployee.html"
        };
    });
