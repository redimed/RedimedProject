angular.module("app.loggedIn.TimeSheet.Admin.Controller", [])
    .controller("AdminController", function($scope, localStorageService) {
        $scope.position = localStorageService.get("position");
    });
