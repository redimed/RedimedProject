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
        //TRANLATION TEXT
        $scope.translationTextDept = {};
        $scope.translationTextDept = {
            checkAll: 'Check All Department',
            uncheckAll: 'Uncheck All Department',
            selectionCount: 'Department Selected',
            selectionOf: '/',
            searchPlaceholder: 'Search...',
            buttonDefaultText: '--Choose Department--',
            dynamicButtonTextSuffix: 'Department Selected'
        };
        //END

        //TRANLATION TEXT
        $scope.translationTextEmp = {};
        $scope.translationTextEmp = {
            checkAll: 'Check All Employee',
            uncheckAll: 'Uncheck All Employee',
            selectionCount: 'Employee Selected',
            selectionOf: '/',
            searchPlaceholder: 'Search...',
            buttonDefaultText: '--Choose Employee--',
            dynamicButtonTextSuffix: 'Employee Selected'
        };
        //END
    });
