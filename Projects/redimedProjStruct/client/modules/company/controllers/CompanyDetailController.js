angular.module("app.loggedIn.company.detail.controller",[])

.controller("CompanyDetailController", function($scope, $state, localStorageService){
    $scope.companyInfo = localStorageService.get('tempCompanyInfo');
    if(!$scope.companyInfo) {
        $state.go('loggedIn.company.list');
    }

    
})