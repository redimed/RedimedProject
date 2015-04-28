angular.module("app.loggedIn.TimeSheet.ViewLeave.Directive", [])
    .directive("viewLeave", function(TimeSheetService) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onCancel: "&",
                onEdit: "&",
                onSubmitagain: "&",
                ngModel: "="
            },
            link: function(scope, attrs, elem) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined && newModel !== null && !(isNaN(newModel))) {
                        TimeSheetService.ViewLeave(newModel).then(function(response) {
                            scope.list = response;
                            if (scope.list !== undefined &&
                                scope.list !== null &&
                                scope.list.result !== undefined &&
                                scope.list.result !== null &&
                                scope.list.result[0] !== undefined &&
                                scope.list.result[0] !== null) {
                                scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ?
                                    ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName +
                                        " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                                scope.statusID = scope.list.result[0].task_status_id;
                            }
                        });
                    }
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewLeave.html"
        };

    });
