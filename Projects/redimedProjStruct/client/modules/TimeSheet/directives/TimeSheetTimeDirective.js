angular.module("app.loggedIn.TimeSheet.Time.Directive", [])
    .directive('timeCharge', function(StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "=",
            },
            link: function(scope, elem, attrs, ctrls, ngModel) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        newModel !== "" &&
                        parseInt(newModel.toString().substr(newModel.toString().length - 2, 2)) > 59) {
                        scope.ngModel = StaffService.convertFromFullToShow(StaffService.convertShowToFull(newModel)).toString();
                    }
                    if (scope.ngModel !== undefined &&
                        scope.ngModel !== null &&
                        scope.ngModel !== "" &&
                        scope.ngModel !== 0 &&
                        scope.ngModel.length !== 0) {
                        var result = "";
                        for (var i = 0; i < scope.ngModel.toString().length - 2; i++) {
                            result += "9";
                        }
                        result += ":99";
                        attrs.$set('uiMask', result);
                    } else {
                        //IF EXIST NOT SET
                        if (attrs.uiMask !== "99:99") {
                            attrs.$set('uiMask', '99:99');
                        }
                        //END
                    }
                });
            },
        };
    })
    .directive('timeChargenon', function(StaffService) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "=",
            },
            link: function(scope, elem, attrs, ctrls, ngModel) {
                scope.$watch("ngModel", function(newModel, oldModel) {
                    if (newModel !== undefined &&
                        newModel !== null &&
                        newModel !== "" &&
                        parseInt(newModel.toString().substr(newModel.toString().length - 2, 2)) > 59) {
                        scope.ngModel = StaffService.convertFromFullToShow(StaffService.convertShowToFull(newModel)).toString();
                    }
                    if (scope.ngModel !== undefined &&
                        scope.ngModel !== null &&
                        scope.ngModel !== "" &&
                        scope.ngModel !== 0 &&
                        scope.ngModel.length !== 0) {
                        var result = "";
                        for (var i = 0; i < scope.ngModel.toString().length - 2; i++) {
                            result += "9";
                        }
                        result += ":99";
                        attrs.$set('uiMask', result);
                    } else {
                        //IF EXIST NOT SET
                        if (attrs.uiMask !== "999:99") {
                            attrs.$set('uiMask', '999:99');
                        }
                        //END
                    }
                });
            },
        };
    });
