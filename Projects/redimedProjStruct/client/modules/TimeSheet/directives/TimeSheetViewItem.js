angular.module("app.loggedIn.TimeSheet.ViewItem.Directive", [])
    .directive("viewItem", function(TimeSheetService, toastr) {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                onCancel: "&",
                ngModel: "="
            },
            link: function(scope, elem, attrs) {
                scope.$watch('ngModel', function(newTask, oldTask) {
                    //load view
                    TimeSheetService.ViewItem(newTask).then(function(response) {
                        if (response.status === "error") {
                            $state.go("loggedIn.ViewAppovedTimeSheet", null, {
                                "reload": true
                            });
                            toastr.error("Loading fail!", "Error");
                        } else if (response.status === "success") {
                            scope.list = response;
                        } else {
                            $state.go("loggedIn.ViewAppovedTimeSheet", null, {
                                "reload": true
                            });
                            toastr.error("Server not response!", "Error");
                        }
                    });
                    //end load view
                });
            },
            templateUrl: "modules/TimeSheet/directives/templates/ViewItem.html"
        };
    });
