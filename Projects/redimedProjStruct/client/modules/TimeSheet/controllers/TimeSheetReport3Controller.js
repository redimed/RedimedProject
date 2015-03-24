angular.module("app.loggedIn.TimeSheet.Report3.Controller", [])
    .controller("Report3Controller", function($scope, localStorageService) {
        $scope.position = localStorageService.get('position');
    });
