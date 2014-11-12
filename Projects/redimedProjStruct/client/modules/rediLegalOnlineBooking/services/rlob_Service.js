/**
 * Created by meditech on 8/29/2014.
 */
angular.module('app.loggedIn.rlob.services',[])


.service('appointmentCalendarService',function(){
    var selectedAppointmentCalendar={};
    this.setSelectedAppointmentCalendar=function(appointment){
        selectedAppointmentCalendar=appointment;
    }
    this.getSelectedAppointmentCalendar=function(){
        return selectedAppointmentCalendar;
    }
})

.service('bookingService',function(){
    var selectedInfo={};
    var bookingInfo={};
    var bookingList=[];
    this.getSelectedInfo=function(){
        return selectedInfo;
    }

    this.getBookingInfo=function(){
        return bookingInfo;
    }
    this.setBookingInfo=function(b){
        bookingInfo=JSON.parse(JSON.stringify(b));
    }

    this.getBookingList=function(){
        return bookingList;
    }

})

.factory('rlobService',function(Restangular,$http,$q){
        var rlobService = {};
        var api = Restangular.all('api');


        //BOOKING
        //-------------------------------------------------------------------
        rlobService.getBookingById=function(bookingId)
        {
            var booking = api.all('rlob/rl_bookings/get-booking-by-id');
            return booking.post({bookingId:bookingId});
        }

        rlobService.changeBookingStatus=function(bookingId,status)
        {
            var result=api.all('rlob/rl_bookings/lob-change-status');
            return result.post({bookingId:bookingId,status:status});
        }
	
	    //chien bookingsList
        rlobService.getbookingsList=function(doctorId){
            var bookingsList=api.one('rlob/rl_bookings/admin/report');
            return bookingsList.get({doctorId:doctorId});
        }

	    //chien
        rlobService.getbookingsListStatus=function(doctorId){
            var bookingsListStaus=api.one('rlob/rl_bookings/admin/status');
            return bookingsListStaus.get({doctorId:doctorId});
        }

        rlobService.getReportPassBookingHaveNotResult=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/report/get-pass-booking-have-not-result');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }

        rlobService.getPassBookingNotChangeStatus=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/get-pass-booking-not-change-status');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }

        rlobService.getUpcommingBookingHaveNotClientDocument=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/get-upcomming-booking-have-not-client-document');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }
        rlobService.getPassBookingHaveNotResult=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/get-pass-booking-have-not-result');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }



        //-------------------------------------------------------------------

        rlobService.add_notification=function(assId,refId,sourceName,bellType,notificationType,content)
        {
            var deferred=$q.defer();
            var promise=deferred.promise;
            promise.then(function(data){
                var msg="";
                if(notificationType==rlobConstant.notificationType.letter)
                {
                    msg="["+sourceName+"] - "
                        +data.Rl_TYPE_NAME+" - "
                        +data.WRK_SURNAME+" - "
                        +(sourceName==rlobConstant.bookingType.REDiLEGAL.name?data.CLAIM_NO:"")
                        +(sourceName==rlobConstant.bookingType.Vaccination.name?data.EMPLOYEE_NUMBER:"")
                        +" - "
                        +moment(data.APPOINTMENT_DATE).format("HH:mm DD/MM/YYYY");
                }
                else if(notificationType==rlobConstant.notificationType.bell)
                {
                    msg="["+sourceName+"] - "
                        +data.WRK_SURNAME+ " - "
                        +(sourceName==rlobConstant.bookingType.REDiLEGAL.name?data.CLAIM_NO:"")+
                        +(sourceName==rlobConstant.bookingType.Vaccination.name?data.EMPLOYEE_NUMBER:"")
                        +" - "
                        +bellType+(content!=undefined &&content!=null && content!=""?(":"+content):'')
                        +" - "
                        +moment(data.APPOINTMENT_DATE).format("HH:mm DD/MM/YYYY");
                }
                $http({
                    method:"POST",
                    url:"/api/rlob/sys_user_notifications/add-notification",
                    data:{assId:assId,refId:refId,sourceName:sourceName,type:notificationType,msg:msg}
                })
                    .success(function(data) {
                        if(data.status=='success')
                        {

                        }
                        else
                        {

                        }
                    })
                    .error(function (data) {

                    })
                    .finally(function() {

                    });
            },function(reason){

            });

            $http({
                method:"POST",
                url:"/api/rlob/rl_bookings/get-booking-by-id",
                data:{bookingId:refId}
            })
                .success(function(data) {
                    if(data.status=='success')
                    {
                        deferred.resolve(data.data);
                    }
                    else
                    {
                        alert("data not exist!");
                    }
                })
                .error(function (data) {
                    console.log("error");
                })
                .finally(function() {
                });
        }


        rlobService.showNotificationPopup=function(styleClass,msg,notifyColor)
        {
            $(styleClass).notify({
                message: { text: msg },
                type:notifyColor
            }).show();
        }
        //--------------------------------------------------------------------
        return rlobService;
});

