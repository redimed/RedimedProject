angular.module("app.loggedIn.TimeSheet.Report5.Controller", [])
    .controller("Report5Controller", function($scope, localStorageService) {
        $scope.position = localStorageService.get('position');
    });
