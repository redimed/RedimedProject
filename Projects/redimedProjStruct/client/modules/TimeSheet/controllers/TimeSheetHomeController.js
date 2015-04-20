angular.module("app.loggedIn.TimeSheet.Home.Controller", [])
    .controller("TimeSheetHomeController", function($scope, localStorageService, TimeSheetService, $cookieStore, toastr, $state) {
        //close siderba
        $('body').addClass("page-sidebar-closed");
        $('body').find('ul').addClass("page-sidebar-menu-closed");
        //end close siderba
        if (localStorageService.get('position')) {
            $scope.position = localStorageService.get('position');
        }
    });
