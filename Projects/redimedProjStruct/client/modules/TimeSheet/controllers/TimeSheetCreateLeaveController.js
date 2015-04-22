angular.module("app.loggedIn.TimeSheet.CreateLeave.Controller", [])
    .controller("CreateLeaveController", function($scope) {
        $scope.info = {};
        $scope.info.standard = 1;
        $scope.changeRequest = function() {
            if ($scope.info.standard === 1) {
                //
            } else {

            }
        };
    });
