angular.module("app.loggedIn.TimeSheet.Report4.Controller", [])
    .controller("Report4Controller", function($scope, localStorageService, StaffService) {
        $scope.position = localStorageService.get('position');
        //SHOW WEEK
        StaffService.showWeek();
        //END SHOW WEEK
        $scope.example1model = [];
        $scope.example1data = [{
            id: 1,
            label: "David"
        }, {
            id: 2,
            label: "Jhon"
        }, {
            id: 3,
            label: "Danny"
        }];
    });
