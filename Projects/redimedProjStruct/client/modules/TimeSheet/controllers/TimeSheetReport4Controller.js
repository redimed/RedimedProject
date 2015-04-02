angular.module("app.loggedIn.TimeSheet.Report4.Controller", [])
    .controller("Report4Controller", function($scope, localStorageService, StaffService) {
        $scope.position = localStorageService.get('position');
        //SHOW WEEK
        StaffService.showWeek();
        //END SHOW WEEK
    });
