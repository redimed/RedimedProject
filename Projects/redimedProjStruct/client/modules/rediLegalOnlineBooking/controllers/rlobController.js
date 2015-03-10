angular.module('app.loggedIn.rlob.controller',[])
    .controller("rlobController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval) {
    //alert("redilegal")
        $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;
        $scope.bookingTypeObj=rlobConstant.bookingType.REDiLEGAL;
        $scope.contactDetails.push({label:'',content:$scope.bookingTypeObj.display});
        $scope.contactDetails.push({label:'Phone:',content:'9230 0900'});
        $scope.contactDetails.push({label:'Email:',content:'medicolegal@redimed.com.au'});
});