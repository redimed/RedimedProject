angular.module("app.loggedIn.TimeSheet.ViewDetail.Directive", [])
    .directive("viewDetail", function(TimeSheetService, toastr, $state, $filter) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                onCancel: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                scope.$watch('ngModel', function(newId, oldId) {
                    TimeSheetService.ViewApproved(newId).then(function(response) {
                        if (response.status === "error") {
                            $state.go("loggedIn.ViewAppovedTimeSheet", null, {
                                "reload": true
                            });
                            toastr.error("Loading fail!", "Error");
                        } else if (response.status === "success") {
                            scope.list = response;
                            scope.employee_name = (scope.list.result[0].FirstName === null || scope.list.result[0].FirstName === "") ? ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName) : (scope.list.result[0].FirstName + " " + ((scope.list.result[0].LastName === null || scope.list.result[0].LastName === "") ? " " : scope.list.result[0].LastName));
                        } else {
                            //catch exception
                            $state.go("loggedIn.TimeSheetHome", null, {
                                "reload": true
                            });
                            toastr.error('Server not response!', "Error");
                        }
                    });
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewDetail.html"
        };
    });
