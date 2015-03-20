angular.module("app.loggedIn.TimeSheet.Time.Directive", [])
    .directive('timeTr', function() {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                ngModel: "=",
                timeTr: "="
            },
            link: function(scope, elem, attrs) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined) {
                        if (isNaN(newModel[newModel.length - 1]) && newModel[newModel.length - 1] !== ":") {
                            scope.ngModel = scope.ngModel.substring(0, scope.ngModel.length - 1);
                        } else {
                            if (scope.ngModel.length === 3) {
                                scope.ngModel = oldModel + ":" + newModel[newModel.length - 1];
                            } else if (scope.ngModel.length > 5) {
                                scope.ngModel = scope.ngModel.substring(0, scope.ngModel.length - 1);
                            }
                        }
                    }
                });
            }
        };
    });
