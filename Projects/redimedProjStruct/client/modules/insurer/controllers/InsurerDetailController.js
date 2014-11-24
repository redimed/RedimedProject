angular.module("app.loggedIn.insurer.detail.controller", [
])
.controller("InsurerDetailController", function ($scope, $state, localStorageService) {

    $scope.insurerInfo = localStorageService.get('tempInsurerInfo');
    if (!$scope.insurerInfo) {
        $state.go('loggedIn.insurer.list');
    }
})