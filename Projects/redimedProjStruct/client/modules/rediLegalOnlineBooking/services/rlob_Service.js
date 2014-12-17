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

.factory('timeoutService',function(){
        var timeoutService={};
        var stackFunc=[];
        function unshiftFunc(func){
            stackFunc.unshift(func);
        }

        return timeoutService;

})

.factory('rlobService',function(Restangular,$http,$q){
        var rlobService = {};
        var api = Restangular.all('api');

        //RL_TYPE
        //--------------------------------------------------------------------
        rlobService.getRlTypeList=function(sourceType)
        {
            var result = api.one('rlob/rl_types/list');
            return result.get({sourceType:sourceType});
        }
        //--------------------------------------------------------------------


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
	    //chien change document status
        rlobService.changeDocumentStatus=function(bookingId,status)
        {
            var result=api.all('rlob/rl_bookings/lob-change-documents-status');
            return result.post({bookingId:bookingId,status:status});
        }
	    //chien Upcomming booking
        rlobService.getCountReportUpcommingBookings=function(bookingType,doctorId,filterInfo){
            var TotalBookings=api.all('rlob/rl_bookings/count-report-upcomming-bookings');
            return TotalBookings.post({bookingType:bookingType,doctorId:doctorId,filterInfo:filterInfo});
        }
        //chien Upcomming booking
        rlobService.getItemsOfPageReportUpcommingBookings=function(info){
            var getItemsBookings=api.all('rlob/rl_bookings/get-items-of-paging-report-upcomming-bookings');
            return getItemsBookings.post({currentPage:info.currentPage,itemsPerPage:info.itemsPerPage,bookingType:info.bookingType,doctorId:info.doctorId,filterInfo:info.filterInfo});
        }
        //chien Status
        rlobService.getCountReportStatusBookings=function(bookingType,doctorId,filterInfo){
            var TotalBookings=api.all('rlob/rl_bookings/count-report-status-bookings');
            return TotalBookings.post({bookingType:bookingType,doctorId:doctorId,filterInfo:filterInfo});
        }
        //chien Status
        rlobService.getItemsOfPageReportStatusBookings=function(info){
            var getItemsBookings=api.all('rlob/rl_bookings/get-items-of-paging-report-status-bookings');
            return getItemsBookings.post({currentPage:info.currentPage,itemsPerPage:info.itemsPerPage,bookingType:info.bookingType,doctorId:info.doctorId,filterInfo:info.filterInfo});
        }
        //chien list messages
        rlobService.getListBookingMessages=function()
        {
            var getListMessages=api.one('rlob/rl_messages/getListMessages');
            return getListMessages.get();
        }
        //chien add new message
        rlobService.addNewBookingMessages=function(messageContent)
        {
            var addNewMessages=api.one('rlob/rl_messages/addNewMessages');
            return addNewMessages.get({messageContent:messageContent});
        }
        //chien delete message
        rlobService.changeIsenableMessage=function(ID)
        {
            var changeMessages=api.one('rlob/rl_messages/changeIsenableMessages');
            return changeMessages.get({ID:ID});
        }
        // chien update message
        rlobService.updateBookingMessage=function(ID,CONTENTS)
        {
            var changeMessages=api.one('rlob/rl_messages/updateMessages');
            return changeMessages.get({ID:ID,CONTENTS:CONTENTS});
        }
        //chien get list date Appoiment Calendar
        rlobService.getListDateAppoinmentCalendar=function(rlTypeId,specialityId,doctorId,locationId,startDate,endDate,bookingType)
        {
            var result=api.one('rlob/appointment-calendar/get-list-date-appointment-calendar');
            return result.get({RL_TYPE_ID:rlTypeId,Specialties_id:specialityId,DOCTOR_ID:doctorId,SITE_ID:locationId,STARTDATE:startDate,ENDDATE:endDate,sourceType:bookingType});
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

        rlobService.getCountReportPassBookingHaveNotResult=function(bookingType,doctorId,searchKeys){
            var result=api.all('rlob/rl_bookings/admin/report/get-count-pass-booking-have-not-result');
            return result.post({bookingType:bookingType,doctorId:doctorId,searchKeys:searchKeys});
        }

        rlobService.getItemsOfPageReportPassBookingHaveNotResult=function(info){
            var result=api.all('rlob/rl_bookings/admin/report/get-items-of-page-pass-booking-have-not-result');
            return result.post({bookingType:info.bookingType,doctorId:info.doctorId,pageIndex:info.pageIndex,itemsPerPage:info.itemsPerPage,searchKeys:info.searchKeys});
        }

        rlobService.getDocumentStatusSummary=function(fromDate,toDate)
        {
            var result=api.one('rlob/rl_bookings/admin/get-document-status-summary');
            return result.get({fromDate:fromDate,toDate:toDate});
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

        rlobService.checkNotificationExist=function(bookingId,bookingType,appearance)
        {
            var result=api.one('rlob/sys_user_notifications/check-notification-exist');
            return result.get({bookingType:bookingType,bookingId:bookingId,appearance:appearance});
        }
//        recreateNotification

        rlobService.recreateNotification=function(bookingId,appearance)
        {
            var result=api.one('rlob/sys_user_notifications/recreate-notification');
            return result.get({bookingId:bookingId,appearance:appearance});
        }

        return rlobService;
})


