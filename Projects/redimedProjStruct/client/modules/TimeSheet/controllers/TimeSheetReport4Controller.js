angular.module("app.loggedIn.TimeSheet.Report4.Controller", [])
    .controller("Report4Controller", function($scope, localStorageService) {
        $scope.position = localStorageService.get('position');
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
    });
