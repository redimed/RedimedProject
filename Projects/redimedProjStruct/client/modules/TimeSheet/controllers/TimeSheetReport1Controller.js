angular.module("app.loggedIn.TimeSheet.Report1.Controller", [])
    .controller("Report1Controller", function($scope, localStorageService) {
        //POSITION
        $scope.position = localStorageService.get('position');
        //END
        //INPUT DATE
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        //END
        $scope.toDate = new Date();
    });
