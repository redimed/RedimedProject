angular.module("app.loggedIn.TimeSheet.Report.Controller", [])
    .controller("ReportController", function($scope, localStorageService) {
        $scope.position = localStorageService.get('position');
    });
