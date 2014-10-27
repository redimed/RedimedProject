/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.rlob.booking.controller',[])
    .controller("rlob_bookingController", function($window,$scope,$http,$state,$modal,locationService,rlTypesService,clnSpecialitiesService,doctorsService,appointmentCalendarService,bookingService,$cookieStore) {
//    UIDatepaginator.init();
//    Metronic.init();

        //Check Booking Type
        //alert(JSON.stringify($state.current) );
        if($state.current.name.indexOf(rlobConstant.bookingType.REDiLEGAL.alias)>-1)
            $scope.bookingType=rlobConstant.bookingType.REDiLEGAL.name;
        else if($state.current.name.indexOf(rlobConstant.bookingType.Vaccination.alias)>-1)
            $scope.bookingType=rlobConstant.bookingType.Vaccination.name;
        if(!$scope.bookingType)
            $state.go("loggedIn.home");

        $scope.selectedInfo=bookingService.getSelectedInfo();
        //Xoa toan bo thong tin cu:clearSelectedInfo
        angular.copy({},$scope.selectedInfo);
        $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){
            if($scope.selectedAppointmentCalendar)
            {
                $scope.selectedInfo=angular.copy($scope.selectedAppointmentCalendar);
                alert(JSON.stringify($scope.selectedAppointmentCalendar));
            }

        });



    })






