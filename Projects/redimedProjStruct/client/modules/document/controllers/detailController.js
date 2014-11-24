angular.module('app.loggedIn.document.detail.controllers',[])
    .controller("detailController",function($scope,$filter,DocumentService,$http,$cookieStore,$state,localStorageService) {
        $scope.patient =  localStorageService.get("patientTempInfo");

    })