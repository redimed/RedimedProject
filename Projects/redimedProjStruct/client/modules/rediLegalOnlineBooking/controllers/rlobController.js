angular.module('app.loggedIn.rlob.controller',[])
    .controller("rlobController", function($scope, $http,$state,$window,$q,$stateParams,FileUploader,$cookieStore,$interval) {
    //alert("redilegal")
        $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;
        $scope.bookingTypeObj=rlobConstant.bookingType.REDiLEGAL;

        // console.log($scope.contactDetails.length);
        // if ($scope.contactDetails.length == 0) {
            $scope.contactDetails.splice(0);            
            $scope.contactDetails.push({label:'',content:$scope.bookingTypeObj.display});
            $scope.contactDetails.push({label:'Phone :',content:'(08) 9230 0900'});
            $scope.contactDetails.push({label:'Email :',content:'medicolegal@redimed.com.au'});
            console.log($scope.contactDetails);
        // };
        $scope.have_redilegal_components.value=1;
        // console.log($scope.REDiLEGAL);
	//define in structure
        //-------------------------------------------------------------------------------
        
        $scope.updateDailyNotificationRlobBooking();
});