angular.module("app.loggedIn.TimeSheet.ActivityDetail.Directive", [])
    .directive("activityDetail", function() {
        return {
            restrict: "EA",
            required: "ngModel",
            scope: {
                ngModel: "=",
                onSave: "&",
                onCancel: "&"
            },
            link: function(scope, elem, attrs) {

            },
            templateUrl: "modules/TimeSheet/directives/templates/ActivityDetail.html"
        };
    });
