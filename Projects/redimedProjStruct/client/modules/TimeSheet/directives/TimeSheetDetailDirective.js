angular.module("app.loggedIn.TimeSheet.Detail.Directive", [])
    .directive("viewTimesheet", function(TimeSheetService, toastr, $state) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onCancel: "&",
                ngModel: "="
            },
            link: function(scope, elem, attrs) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined) {
                        //check and load
                        if (newModel.STATUS === 'on-date') {
                            //load on date
                            scope.Title = "Timesheet Detail";

                            TimeSheetService.ViewOnDate(newModel).then(function(response) {
                                if (response.status === "success") {
                                    scope.list = response;
                                    //PUSH FILE
                                    angular.forEach(scope.list.result, function(valueResult, indexResult) {
                                        scope.list.result[indexResult].files = [];
                                        angular.forEach(response.file, function(valueFile, indexFile) {
                                            if (valueFile.tasks_id === valueResult.tasks_id &&
                                                valueFile.ITEM_ID === valueResult.ITEM_ID) {
                                                scope.list.result[indexResult].files.push({
                                                    file_id: valueFile.file_id,
                                                    file_name: valueFile.file_name
                                                });
                                            }
                                        });
                                    });
                                    //END PUSH FILE
                                    if (scope.list.result[0] !== undefined) {
                                        scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                                    }
                                } else if (response.status === "error") {
                                    toastr.error("Loadding fail!", "Error");
                                    //close modalInstance
                                } else {
                                    $state("loggedIn.ApproveTask", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not response!", "Error");
                                }
                            });
                        } else if (newModel.STATUS === 'all-date') {
                            scope.Title = "Full Timesheet";
                            //load all date
                            TimeSheetService.ViewAllDate(newModel).then(function(response) {
                                if (response.status === "success") {
                                    scope.list = response;
                                    scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                                } else if (response.status === "error") {
                                    toastr.error("Loadding fail!", "Error");
                                    //close modalInstance
                                } else {
                                    $state("loggedIn.ApproveTask", null, {
                                        "reload": true
                                    });
                                    toastr.error("Server not response!", "Error");
                                }
                            });
                        }
                    }
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/Detail.html"
        };
    });
