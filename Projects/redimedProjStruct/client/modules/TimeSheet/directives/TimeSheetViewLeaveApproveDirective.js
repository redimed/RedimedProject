angular.module("app.loggedIn.TimeSheet.ApproveLeave.Directive", [])
    .directive("viewLeaveapprove", function(TimeSheetService) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                ngModel: "=",
                onCancel: "&",
                onReject: "&",
                onApprove: "&"
            },
            link: function(scope, elem, attrs) {
                scope.info = {};
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        !isNaN(newModel)) {
                        scope.info.isReject = false;
                        scope.info.leaveID = newModel;
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
                    } else if (newModel === "clickReject") {
                        scope.info.isReject = true;
                        scope.info.comments = null;
                    }
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewLeaveApprove.html"
        };
    });
