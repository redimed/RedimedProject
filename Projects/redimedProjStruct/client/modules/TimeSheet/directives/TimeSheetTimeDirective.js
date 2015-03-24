angular.module("app.loggedIn.TimeSheet.Time.Directive", [])
    .directive('timeCharge', function() {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                ngModel: "="
            },
            link: function(scope, elem, attrs) {
            },
        };
    });
