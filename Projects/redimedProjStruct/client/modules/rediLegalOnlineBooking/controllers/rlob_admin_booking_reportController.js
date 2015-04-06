/**
 * Created by Phan Quoc Chien on 07/11/2014.
 */

angular.module('app.loggedIn.rlob.adminBookingReport.controller',[])
    .controller("rlob_admin_bookingReportController", function($scope,$http,$cookieStore,$q,$state,rlobService) {
        // chien status
        $scope.report = 'report1';
        $scope.status = "Confirmed";
        $scope.loginInfo=$cookieStore.get('userInfo');

        $scope.reportType={
            report1:'report1',
            report2:'report2',
            report3:'report3'
        }
        $scope.gotoReport=function(reportType)
        {
            switch(reportType)
            {
                case $scope.reportType.report1:
                    $state.go("loggedIn.rlob.rlob_booking_report.type1");
                    break;
                case $scope.reportType.report2:
                    $state.go('loggedIn.rlob.rlob_booking_report.type2');
                    break;
                case $scope.reportType.report3:
                    $state.go("loggedIn.rlob.rlob_booking_report.type3");
                    break;
            }

        }

        $scope.selectedBooking=null;
        $scope.isAdminGetFiles=true;

        $scope.accordionStatus={
            status1:true
        }
        $scope.isAdminUpload=true;

        $scope.removeSelectedBooking=function()
        {
            $scope.selectedBooking=undefined;
        }
        $scope.setSelectedBooking=function(bookingId)
        {
            rlobService.getBookingById(bookingId)
                .then(function(data){
                    if(data.status=='success')
                    {
                        $scope.selectedBooking=data.data;
                    }
                    else
                    {
                        rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Cannot get booking info!");
                    }
                },function(error){
                    rlobMsg.popup(rlobLang.rlobHeader,rlobConstant.msgPopupType.error,"Cannot get booking info!");
                });
        }
        $state.go("loggedIn.rlob.rlob_booking_report.type1");


	    $scope.documentStatusChangedFlag=0;
    	$scope.bookingStatusChangedFlag=0;
    });
