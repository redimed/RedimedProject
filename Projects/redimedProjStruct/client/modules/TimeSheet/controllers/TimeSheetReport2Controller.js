angular.module("app.loggedIn.TimeSheet.Report2.Controller", [])
    .controller("Report2Controller", function($scope, localStorageService) {
        $scope.position = localStorageService.get('position');
    });
