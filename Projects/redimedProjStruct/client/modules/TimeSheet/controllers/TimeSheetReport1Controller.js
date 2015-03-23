angular.module("app.loggedIn.TimeSheet.Report1.Controller", [])
    .controller("Report1Controller", function($scope, localStorageService) {
        $scope.position = localStorageService.get('position');
    });
