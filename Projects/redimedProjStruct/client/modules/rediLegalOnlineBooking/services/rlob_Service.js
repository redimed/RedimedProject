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
    var bookingInfoReuse=null;
    var bookingBehalfInfo=null;
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

    this.setBookingInfoReuse=function(booking)
    {
        bookingInfoReuse=angular.copy(booking);
    }
    this.getBookingInfoResuse=function()
    {
        return bookingInfoReuse;
    }
    this.setBookingBehalfInfo=function(b)
    {
        bookingBehalfInfo=b;
    }
    this.getBookingBehalfInfo=function()
    {
        return bookingBehalfInfo;
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

        rlobService.bookingInfoPaperless={id:null};

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
            var TotalBookings=api.all('rlob/rl_bookings/admin/report-1/count-report-upcomming-bookings');
            return TotalBookings.post({bookingType:bookingType,doctorId:doctorId,filterInfo:filterInfo});
        }
        //chien Upcomming booking
        rlobService.getItemsOfPageReportUpcommingBookings=function(info){
            var getItemsBookings=api.all('rlob/rl_bookings/admin/report-1/get-items-of-paging-report-upcomming-bookings');
            return getItemsBookings.post({currentPage:info.currentPage,itemsPerPage:info.itemsPerPage,bookingType:info.bookingType,doctorId:info.doctorId,filterInfo:info.filterInfo});
        }
        //chien Status
        rlobService.getCountReportOutstandingBookings=function(bookingType,doctorId,filterInfo){
            var TotalBookings=api.all('rlob/rl_bookings/admin/report-2/count-report-outstanding-bookings');
            return TotalBookings.post({bookingType:bookingType,doctorId:doctorId,filterInfo:filterInfo});
        }
        //chien Status
        rlobService.getItemsOfPageReportOutstandingBookings=function(info){
            var getItemsBookings=api.all('rlob/rl_bookings/admin/report-2/get-items-of-paging-report-outstanding-bookings');
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
        rlobService.getListDateAppoinmentCalendar=function(rlTypeId,specialtyName,doctorId,locationId,startDate,endDate,bookingType)
        {
            var result=api.one('rlob/appointment-calendar/get-list-date-appointment-calendar');
            return result.get({RL_TYPE_ID:rlTypeId,Specialties_name:specialtyName,DOCTOR_ID:doctorId,SITE_ID:locationId,STARTDATE:startDate,ENDDATE:endDate,sourceType:bookingType});
        }
        //phanquocchien.c1109g@gmail.com
        //addNewFromAms6
        rlobService.addNewFromAms6=function(info)
        {
            var addAMS6=api.all('rlob/rl_form_ams6/addNewFormAms6');
            return addAMS6.post({info:info});
        } 
        //phanquocchien.c1109g@gmail.com
        //updateFromAms6
        rlobService.updateFromAms6=function(info)
        {
            var addAMS6=api.all('rlob/rl_form_ams6/rl_form_ams6_update');
            return addAMS6.post({info:info});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //get Booking Doctor Company
        rlobService.getBookingDoctorCompany=function(BOOKING_ID)
        {
            var getBooking=api.one('rlob/rl_form_ams6/get_booking_doctor_company');
            return getBooking.get({BOOKING_ID:BOOKING_ID});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //check Booking In FormAms6
        rlobService.checkBookingInFormAms6=function(BOOKING_ID)
        {
            var getMAS6=api.one('rlob/rl_form_ams6/select_Item_rl_form_ams6_bookingid');
            return getMAS6.get({BOOKING_ID:BOOKING_ID});
        }
        //phanquocchien.c1109g@gmail.com
        //addNewFromAms5
        rlobService.addNewFromAms5=function(info)
        {
            var addAMS5=api.all('rlob/rl_form_ams5/addNewFormAms5');
            return addAMS5.post({info:info});
        } 
        //phanquocchien.c1109g@gmail.com
        //updateFromAms5
        rlobService.updateFromAms5=function(info)
        {
            var addAMS5=api.all('rlob/rl_form_ams5/rl_form_ams5_update');
            return addAMS5.post({info:info});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //check Booking In FormAms5
        rlobService.checkBookingInFormAms5=function(BOOKING_ID)
        {
            var getMAS6=api.one('rlob/rl_form_ams5/select_Item_rl_form_ams5_bookingid');
            return getMAS6.get({BOOKING_ID:BOOKING_ID});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //add claim
        rlobService.addClaim=function(data)
        {
            var Claim=api.all('restful/Claim');
            return Claim.post(data);
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //add Patient
        rlobService.addPatient=function(data)
        {
            var Patient=api.all('restful/Patient');
            return Patient.post(data);
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //add ApptPatient
        rlobService.addApptPatient=function(Patient_id,CAL_ID)
        {
            var Patient=api.all('restful/ApptPatient');
            return Patient.post({Patient_id:Patient_id,CAL_ID:CAL_ID});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //add checkApptPatient
        rlobService.checkApptPatient=function(Patient_id,CAL_ID)
        {
            var Patient=api.one('restful/ApptPatient');
            return Patient.get({Patient_id:Patient_id,CAL_ID:CAL_ID});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //add checkApptPatient
        rlobService.updateAppointment=function(CAL_ID,PATIENTS)
        {

            var Patient=api.all('rlob/rl_bookings/update-appointment-calendar');
            return Patient.post({CAL_ID:CAL_ID,PATIENTS:PATIENTS});
            // var zzz = CAL_ID + '';
            // var test = api.all('restful/Appointment').one(zzz);
            // test.PATIENTS = PATIENTS;
            // return test.put();
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //update patient ID in booking
        rlobService.updatePatientIdBooking=function(BOOKING_ID,PATIENT_ID)
        {

            var result=api.all('rlob/rl_bookings/update-patient-booking');
            return result.post({BOOKING_ID:BOOKING_ID,PATIENT_ID:PATIENT_ID});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //select Appointment
        rlobService.selectAppointment=function(CAL_ID)
        {
            var Patient=api.one('restful/Appointment/'+ CAL_ID);
            return Patient.get();
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //cancel booking
        rlobService.cancelBooking=function(CAL_ID,PATIENT_ID)
        {
            var result=api.all('rlob/rl_bookings/cancel-booking');
            return result.post({CAL_ID:CAL_ID,PATIENT_ID:PATIENT_ID});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //change booking
        rlobService.changeBooking=function(CAL_ID,PATIENT_ID,PATIENT_NAME)
        {
            var result=api.all('rlob/rl_bookings/change-booking');
            return result.post({CAL_ID:CAL_ID,PATIENT_ID:PATIENT_ID,PATIENT_NAME:PATIENT_NAME});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //get list tltype
        rlobService.getlistRlType=function()
        {
            var result=api.one('rlob/rl_types/get-list-rltype');
            return result.get();
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //update tltype
        rlobService.updateRlTypes=function(TYPEID,TYPENAME,SOURCETYPE,ISENABLE)
        {
            var result=api.all('rlob/rl_types/update-rltype');
            return result.post({TYPEID:TYPEID,TYPENAME:TYPENAME,SOURCETYPE:SOURCETYPE,ISENABLE:ISENABLE});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //insert tltype
        rlobService.insertRlTypes=function(TYPENAME,SOURCETYPE)
        {
            var result=api.all('rlob/rl_types/insert-rltype');
            return result.post({TYPENAME:TYPENAME,SOURCETYPE:SOURCETYPE});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //get list specialties
        rlobService.getListSpecialties=function()
        {
            var result=api.one('rlob/cln_specialties/get-list-specialties');
            return result.get();
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //update specialties
        rlobService.updateSpecialties=function(SPECIALTIESID,SPECIALTIESNAME,SPECIALTIESTYPE,ISENABLE)
        {
            var result=api.all('rlob/cln_specialties/update-specialties');
            return result.post({SPECIALTIESID:SPECIALTIESID,SPECIALTIESNAME:SPECIALTIESNAME,SPECIALTIESTYPE:SPECIALTIESTYPE,ISENABLE:ISENABLE});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //insert specialties
        rlobService.insertSpecialties=function(SPECIALTIESNAME,SPECIALTIESTYPE)
        {
            var result=api.all('rlob/cln_specialties/edit-specialties');
            return result.post({SPECIALTIESNAME:SPECIALTIESNAME,SPECIALTIESTYPE:SPECIALTIESTYPE});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //insert emergency
        rlobService.insertEmergency=function(info)
        {
            var result=api.all('rlob/sponsor/insert-emergency');
            return result.post({info:info});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //insert nonemergency
        rlobService.insertNonEmergency=function(info)
        {
            var result=api.all('rlob/sponsor/insert-nonemergency');
            return result.post({info:info});
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //list mail user online booking
        rlobService.listMailUserOnlineBooking=function()
        {
            var result=api.one('rlob/rl_bookings/admin/list-mail-user-online-booking');
            return result.get();
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //list dortor
        rlobService.listDoctorReport=function()
        {
            var result=api.one('rlob/rl_bookings/admin/report/list-doctor-report');
            return result.get();
        }
        //chien 
        //phanquocchien.c1109g@gmail.com
        //list location
        rlobService.listLocationReport=function()
        {
            var result=api.one('rlob/rl_bookings/admin/report/list-location-report');
            return result.get();
        }

        rlobService.getPassBookingNotChangeStatus=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/get-pass-booking-not-change-status');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }

        rlobService.getListUpcommingBookingWaitingPaperwork=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/get-list-upcomming-booking-waiting-paperwork');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }

        rlobService.getListBookingOutstandingNotification=function(bookingType,doctorId)
        {
            var result=api.one('rlob/rl_bookings/admin/list-booking-outstanding-notification');
            return result.get({bookingType:bookingType,doctorId:doctorId});
        }

        rlobService.getCountReportArchiveBooking=function(bookingType,doctorId,searchKeys){
            var result=api.all('rlob/rl_bookings/admin/report-3/get-count-archive-booking');
            return result.post({bookingType:bookingType,doctorId:doctorId,searchKeys:searchKeys});
        }

        rlobService.getItemsOfPageReportArchiveBooking=function(info){
            var result=api.all('rlob/rl_bookings/admin/report-3/get-items-of-page-archive-booking');
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
                    msg="["+rlobConstant.bookingType[sourceName].display+"] - "
                        +data.Rl_TYPE_NAME+" - "
                        +data.WRK_SURNAME+" - "
                        +(sourceName==rlobConstant.bookingType.REDiLEGAL.name?data.CLAIM_NO:"")
                        +(sourceName==rlobConstant.bookingType.Vaccination.name?data.EMPLOYEE_NUMBER:"")
                        +" - "
                        +moment(data.APPOINTMENT_DATE).format("HH:mm DD/MM/YYYY");
                }
                else if(notificationType==rlobConstant.notificationType.bell)
                {
                    msg="["+rlobConstant.bookingType[sourceName].display+"] - "
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

        
        rlobService.insertNewUser=function(newUser){
            var result=api.all('rlob/register/insert-new-user');
            return result.post({newUser:newUser});
        }

        rlobService.getUsersList=function(searchInfo)
        {
            var result=api.all('rlob/register/list-redilegal-users');
            return result.post({searchInfo:searchInfo});
        }

        rlobService.updateRedilegalUserStatus=function(redilegalUserName,status)
        {
            var result=api.all('rlob/register/update-redilegal-user-status');
            return result.post({redilegalUserName:redilegalUserName,status:status});
        }

        rlobService.updateUserInfo=function(updateInfo)
        {
            var result=api.all('rlob/register/update-user-info');
            return result.post({updateInfo:updateInfo});
        }

        rlobService.getUpcommingBookingHaveNotDocumentToNotificationCustomer=function(bookingType)
        {
            var result=api.one('rlob/rl_bookings/get-upcomming-booking-have-not-document-to-notification-customer');
            return result.get({bookingType:bookingType});
        }

        rlobService.getStates=function(nation)
        {
            var result=api.one('rlob/register/get-states');
            return result.get({nation:nation});
        }

        rlobService.getDoctorInfoByUserId=function(userId)
        {
            var result=api.one('rlob/doctors/get-doctors-info-by-userid');
            return result.get({userId:userId});
        }

        rlobService.core={
            /**
             * selectedDate: javascript Date Object
             * tannv.dts@gmail.com
             */
            getListAppointmentAfterTime:function(doctorId,siteId,selectedAppFromTime)
            {
                var result=api.all('rlob/core/get-list-appointment-after-time');
                return result.post({doctorId:doctorId,siteId:siteId,selectedAppFromTime:selectedAppFromTime});
            },

            handlePeriodTimeAppointmentCalendar:function(doctorId,siteId,selectedAppFromTime,rlTypeId)
            {
                var result=api.all('rlob/core/handle-periodtime-appointment-calendar');
                return result.post({doctorId:doctorId,siteId:siteId,selectedAppFromTime:selectedAppFromTime,rlTypeId:rlTypeId});
            },

            saveBookingInfo:function(bookingInfo)
            {
                var result=api.all('rlob/core/save-booking-info');
                return result.post({bookingInfo:bookingInfo});
            },

            checkPeriodTimeToBooking:function(doctorId,siteId,selectedAppFromTime,rlTypeId)
            {
                var result=api.all('rlob/core/check-period-time-to-booking');
                return result.post({doctorId:doctorId,siteId:siteId,selectedAppFromTime:selectedAppFromTime,rlTypeId:rlTypeId});
            }
        }

        rlobService.rlobBookingFile={
            setListResultFiles:function(listResult)
            {
                var result=api.all('rlob/core/set-list-result-files');
                return result.post({listResult:listResult});
            },

            unselectAllFileResult:function(bookingId)
            {
                var result=api.all('rlob/core/unselect-all-file-result');
                return result.post({bookingId:bookingId});
            }
        }
        
        return rlobService;
})


