angular.module('app.loggedIn.rlob.controller',[])
    .controller("rlobController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval) {
    //alert("redilegal")
        $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;

        $scope.contactDetails.push({label:'',content:$scope.bookingType});
        $scope.contactDetails.push({label:'Phone:',content:'9230 0900'});
        $scope.contactDetails.push({label:'Email:',content:'redilegal@redimed.com.au'});
});