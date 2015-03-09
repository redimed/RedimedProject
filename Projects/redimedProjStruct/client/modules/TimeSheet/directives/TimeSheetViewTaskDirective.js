angular.module("app.loggedIn.TimeSheet.ViewTask.Directive", [])
    .directive('viewTask', function() {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                onCancel: "&",
                onSave: "&",
                ngModel: "="
            },
            link: function(scope, element, attrs) {
                //Begin date
                scope.dateOptions = {
                    formatYear: 'yy',
                    startingDay: 1
                };
                //End date
            },
            templateUrl: "modules/TimeSheet/directives/templates/viewTask.html"
        };
    });
