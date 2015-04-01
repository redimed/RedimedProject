/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.rlob.booking.controller',[])
    .controller("rlob_bookingController", function($window,$scope,$http,$state,$modal,appointmentCalendarService,$cookieStore,rlobService) {
//    UIDatepaginator.init();
//    Metronic.init();

        $scope.showMsgDialog=function(styleClass,header,status,content)
        {
            $scope.msgHeader=header;
            $scope.msgStatus=status;
            $scope.msgContent=content;
            $(styleClass).modal({show:true,backdrop:'static'});
        };

        $scope.selectedAppointmentCalendarStorage=appointmentCalendarService.getSelectedAppointmentCalendar();
        //Xoa toan bo thong tin cu
        angular.copy({},$scope.selectedAppointmentCalendarStorage);

        $scope.$watch('selectedAppointmentCalendar',function(oldValue,newValue){
            if($scope.selectedAppointmentCalendar && $scope.selectedAppointmentCalendar.CAL_ID)
            {
                // doctorId,siteId,selectedAppFromTime,rlTypeId
                rlobService.core.checkPeriodTimeToBooking(
                    $scope.selectedAppointmentCalendar.DOCTOR_ID,
                    $scope.selectedAppointmentCalendar.SITE_ID,
                    $scope.selectedAppointmentCalendar.FROM_TIME,
                    $scope.selectedAppointmentCalendar.RL_TYPE_ID
                )
                .then(function(data){
                    if(data.status=='success'){
                        angular.copy($scope.selectedAppointmentCalendar,$scope.selectedAppointmentCalendarStorage);
                        if($scope.bookingType==rlobConstant.bookingType.REDiLEGAL.name)
                            $state.go("loggedIn.rlob.rlob_patient_detail");
                        else if($scope.bookingType=rlobConstant.bookingType.Vaccination.name)
                            $state.go("loggedIn.vaccinob.vaccinob_patient_detail");
                    }
                    else
                    {
                        $scope.showMsgDialog('.booking-msg-dialog','Medico-Legal','fail','Not enough time!');
                    }
                },function(err){
                    $scope.showMsgDialog('.booking-msg-dialog','Medico-Legal','fail','Error!');
                });
                
            }

        });


        // var periodRequire=45;
        // rlobService.core.handlePeriodTimeAppointmentCalendar(19,1,new Date (2015,3,14,9,0),2)
        // .then(function(data){
        //     if(data.status=='success')
        //     {
        //         for(var i=0;i<data.data.length;i++)
        //         {
        //             console.log(moment(new Date(data.data[i].FROM_TIME)).format("HH:mm DD/MM/YYYY")+
        //                 " "+moment(new Date(data.data[i].TO_TIME)).format("HH:mm DD/MM/YYYY"));
        //         }
        //     }
        //     else
        //     {

        //     }
        // },function(err){

        // });


    })






