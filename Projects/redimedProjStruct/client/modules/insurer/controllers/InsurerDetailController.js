angular.module("app.loggedIn.insurer")
.controller("InsurerDetailController", function ($scope, $state, localStorageService) {

    $scope.insurerInfo = localStorageService.get('tempInsurerInfo');
    if (!$scope.insurerInfo) {
        $state.go('loggedIn.insurer_list');
    }
})