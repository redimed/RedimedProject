/**
 * Created by meditech on 10/28/2014.
 */
angular.module('app.loggedIn.vaccinob.controller',[])
    .controller("vaccinobController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval) {
        //alert("Vaccination")
        $scope.bookingType=rlobConstant.bookingType.Vaccination.name;
        $scope.contactDetails.push({label:'',content:$scope.bookingType});
    });