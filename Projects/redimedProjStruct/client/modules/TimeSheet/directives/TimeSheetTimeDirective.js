angular.module("app.loggedIn.TimeSheet.Time.Directive", [])
    .directive('timeCharge', function(StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "="
            },
            link: function(scope, elem, attrs) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        newModel !== ""
                    ) {
                        scope.ngModel = StaffService.convertFromFullToShow(StaffService.convertShowToFull(newModel));
                    }
                });
            },
        };
    });
