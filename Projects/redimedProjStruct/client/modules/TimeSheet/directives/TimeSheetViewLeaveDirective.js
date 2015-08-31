angular.module("app.loggedIn.TimeSheet.ViewLeave.Directive", [])
    .directive("viewLeave", function(TimeSheetService, $cookieStore) {
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
                        /*
                        ViewLeave: view detail Leave form
                        input: information Leave form
                        output: detail of Leave form
                        */
                        scope.ViewLeave = function(info) {
                            TimeSheetService.ViewLeave(info).then(function(response) {
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
                                    scope.is_reject = scope.list.result[0].is_reject;
                                }
                            });
                        };
                        var info = {
                            leave_id: newModel,
                            user_id: $cookieStore.get("userInfo").id
                        };
                        scope.ViewLeave(info);
                    }
                });
                scope.getStyle = function(timeLeave) {
                    if (timeLeave >= 6000) {
                        return {
                            "margin-right": "5px"
                        };
                    } else {
                        return;
                    }
                };
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewLeave.html"
        };

    });
