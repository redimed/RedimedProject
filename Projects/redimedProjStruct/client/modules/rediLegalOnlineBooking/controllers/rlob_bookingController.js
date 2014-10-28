/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.rlob.booking.controller',[])
    .controller("rlob_bookingController", function($window,$scope,$http,$state,$modal,appointmentCalendarService,$cookieStore) {
//    UIDatepaginator.init();
//    Metronic.init();

        $scope.selectedAppointmentCalendarStorage=appointmentCalendarService.getSelectedAppointmentCalendar();
        //Xoa toan bo thong tin cu
        angular.copy({},$scope.selectedAppointmentCalendarStorage);

        $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){
            if($scope.selectedAppointmentCalendar && $scope.selectedAppointmentCalendar.CAL_ID)
            {
                angular.copy($scope.selectedAppointmentCalendar,$scope.selectedAppointmentCalendarStorage);
                if($scope.bookingType==rlobConstant.bookingType.REDiLEGAL.name)
                    $state.go("loggedIn.rlob.rlob_patient_detail");
                else if($scope.bookingType=rlobConstant.bookingType.Vaccination.name)
                    $state.go("loggedIn.vaccinob.vaccinob_patient_detail");
            }

        });



    })






