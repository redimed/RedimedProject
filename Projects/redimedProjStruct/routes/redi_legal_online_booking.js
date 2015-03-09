/**
 * Created by meditech on 9/27/2014.
 */
var rlTypesController=require('./controllers/rlTypesController');
var clnSpecialitiesController=require('./controllers/clnSpecialitiesController');
var RedimedSiteController=require('./controllers/RedimedSiteController');
var doctorsController = require('./controllers/doctorsController');
var clnAppointmentCalendarController = require('./controllers/clnAppointmentCalendarController');
var rlBookingsController=require('./controllers/rlBookingsController');
var rlBookingFilesController=require('./controllers/rlBookingFilesController');
var sysUserNotificationsController=require('./controllers/sysUserNotificationsController');
var structureController=require('./controllers/structureController');
var rlobBookingPaperlessController=require('./controllers/rlobBookingPaperlessController');

//-------------------------------------------------------------

//redimedsites
app.get('/api/rlob/redimedsites/list',RedimedSiteController.rlobList);

//rlType
app.get('/api/rlob/rl_types/list',rlTypesController.list);
app.get('/api/rlob/rl_types/get-rltype-by-id',rlTypesController.getRlTypeById);

//cln_specialties
app.get('/api/rlob/cln_specialties/list',clnSpecialitiesController.list);
app.get('/api/rlob/cln_specialties/filter-by-type',clnSpecialitiesController.filterByType);
app.get('/api/rlob/cln_specialties/get-speciality-by-id',clnSpecialitiesController.getSpecialityById);

//doctors
app.get('/api/rlob/doctors/list',doctorsController.list);
app.get('/api/rlob/doctors/get-doctors-by-speciality',doctorsController.getDoctorOfSpeciality);
app.get('/api/rlob/doctors/get-doctors-info-by-userid',doctorsController.getDoctorInfoByUserId);
app.get('/api/rlob/doctors/get-doctors-by-id',doctorsController.getDoctorById);
app.get('/api/rlob/doctors/get-doctors-for-source-type',doctorsController.getDoctorForSourceType);


//cln_appointment-calendar
app.get('/api/rlob/appointment-calendar/list',clnAppointmentCalendarController.list);
app.get('/api/rlob/appointment-calendar/get-list-date-appointment-calendar',clnAppointmentCalendarController.getListDateAppointmentCalendar);
app.get('/api/rlob/appointment-calendar/get-appointment-calendar',clnAppointmentCalendarController.getAppointmentCalendar);
app.get('/api/rlob/appointment-calendar/check-same-doctor',clnAppointmentCalendarController.checkSameDoctor);
app.get('/api/rlob/appointment-calendar/get-by-id',clnAppointmentCalendarController.getAppointmentCalendarById);

//rl_bookings
app.post('/api/rlob/rl_bookings/add',rlBookingsController.add);
app.get('/api/rlob/rl_bookings/get-new-key',rlBookingsController.getNewKey);
app.post('/api/rlob/rl_bookings/list',rlBookingsController.list);//co su dung
app.post('/api/rlob/rl_bookings/detail',rlBookingsController.detail);//co su dung
app.post('/api/rlob/rl_bookings/get-booking-by-id',rlBookingsController.getBookingById);
app.post('/api/rlob/rl_bookings/lob-change-status',rlBookingsController.lob_change_status);
app.post('/api/rlob/rl_bookings/lob-change-documents-status',rlBookingsController.lob_change_documents_status);//chien change Document
app.get('/api/rlob/rl_bookings/send-email',rlBookingsController.sendEmail);
app.get('/api/rlob/rl_bookings/admin/filter-booking',rlBookingsController.lob_filter_booking);
app.post('/api/rlob/rl_bookings/admin/change-appointment-calendar',rlBookingsController.changeAppointmentCalendar);
app.get('/api/rlob/rl_bookings/admin/get-files-by-booking-id',rlBookingsController.get_files_booking);//nguyen khank
app.post('/api/rlob/rl_bookings/admin/send-comfirm-email',rlBookingsController.sendConfirmEmail);
app.post('/api/rlob/rl_bookings/count-report-upcomming-bookings',rlBookingsController.getCountReportUpcommingBookings);//chien Upcomming booking
app.post('/api/rlob/rl_bookings/get-items-of-paging-report-upcomming-bookings',rlBookingsController.getItemsOfPageReportUpcommingBookings);//chien Upcomming booking
app.post('/api/rlob/rl_bookings/count-report-status-bookings',rlBookingsController.getCountReportStatusBookings);//chien Status
app.post('/api/rlob/rl_bookings/get-items-of-paging-report-status-bookings',rlBookingsController.getItemsOfPageReportStatusBookings);//chien Status
app.post('/api/rlob/rl_bookings/update-appointment-calendar',rlBookingsController.cln_appointment_calendar_update);//chien update 
app.post('/api/rlob/rl_bookings/update-patient-booking',rlBookingsController.updatePatientIdInBooking);//chien update 

app.post('/api/rlob/rl_bookings/cancel-booking',rlBookingsController.cancelBooking);// chien 
app.post('/api/rlob/rl_bookings/change-booking',rlBookingsController.changeBooking);// chien 
app.get('/api/rlob/rl_bookings/admin/report/get-pass-booking-have-not-result',rlBookingsController.getReportPassBookingHaveNotResult);//tannv.dts@gmail.com/report: get pass booking have not result
app.post('/api/rlob/rl_bookings/admin/report/get-count-pass-booking-have-not-result',rlBookingsController.getCountReportPassBookingHaveNotResult);//tannv.dts@gmail.com/report: count total number of pass booking have not result
app.post('/api/rlob/rl_bookings/admin/report/get-items-of-page-pass-booking-have-not-result',rlBookingsController.getItemsOfPageReportPassBookingHaveNotResult);//tannv.dts@gmail.com/report: items of page pass booking have not result


app.get('/api/rlob/rl_bookings/admin/get-pass-booking-not-change-status',rlBookingsController.getPassBookingNotChangeStatus);
app.get('/api/rlob/rl_bookings/admin/get-upcomming-booking-have-not-client-document',rlBookingsController.getUpcommingBookingHaveNotClientDocument);
app.get('/api/rlob/rl_bookings/admin/get-pass-booking-have-not-result',rlBookingsController.getPassBookingHaveNotResult);
app.get('/api/rlob/rl_bookings/admin/get-document-status-summary',rlBookingsController.getDocumentStatusSummary);
app.get('/api/rlob/rl_bookings/admin/sendResultNotificationEmail',rlBookingsController.sendResultNotificationEmail);

//rl_booking_files
app.get('/api/rlob/rl_booking_files/get-new-key',rlBookingFilesController.getNewKey);
app.post('/api/rlob/rl_booking_files/listByBooking', rlBookingFilesController.listByBooking);//BUI VUONG//chua su dung
app.post('/api/rlob/rl_booking_files/change-role-download',rlBookingFilesController.change_role_download);

/***
 * Notification
 * tannv.dts@gmail.com
 */
app.post('/api/rlob/sys_user_notifications/add-notification',sysUserNotificationsController.addNotification);
app.get('/api/rlob/sys_user_notifications/get-new-notifications',sysUserNotificationsController.getNewNotifications);
app.get('/api/rlob/sys_user_notifications/get-unread-notifications',sysUserNotificationsController.getUnreadNotifications);
app.get('/api/rlob/sys_user_notifications/set-notification-have-read',sysUserNotificationsController.setNotificationHaveRead);
app.get('/api/rlob/sys_user_notifications/get-max-index',sysUserNotificationsController.getMaxIndex);
app.get('/api/rlob/sys_user_notifications/get-list-notification',sysUserNotificationsController.getListNotification);
app.get('/api/rlob/sys_user_notifications/count-total-notification',sysUserNotificationsController.countTotalNotification);
app.get('/api/rlob/sys_user_notifications/get-items-of-paging',sysUserNotificationsController.getItemsOfPaging);
app.get('/api/rlob/sys_user_notifications/check-notification-exist',sysUserNotificationsController.checkNotificationExist);
app.get('/api/rlob/sys_user_notifications/recreate-notification',sysUserNotificationsController.recreateNotification);



//structure
app.post('/api/structure/list-appointments-upcoming',structureController.list_appointments_calendar_upcoming);
app.get('/api/download/structure/attach-file/:sourceName/:refId', structureController.downloadLetterAttachFile);

//Documents
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var rlobDocumentsController=require('./controllers/rlobDocumentsController');
app.post('/api/rlob/rl_booking_files/upload',multipartMiddleware, rlobDocumentsController.rlobUploadFile);
app.get('/api/download/lob/document/:fileId(*)', rlobDocumentsController.rlobDowloadFile);

//rl_messages
//phanquocchien.c1109g@gmail.com
app.get('/api/rlob/rl_messages/getListMessages', rlBookingsController.rl_messages_select_contents);
app.get('/api/rlob/rl_messages/addNewMessages', rlBookingsController.rl_messages_insert_contents);
app.get('/api/rlob/rl_messages/changeIsenableMessages', rlBookingsController.rl_messages_change_isenable);
app.get('/api/rlob/rl_messages/updateMessages', rlBookingsController.rl_messages_update_message);

//rl_form_ams6
//phanquocchien.c1109g@gmail.com
app.post('/api/rlob/rl_form_ams6/addNewFormAms6', rlobBookingPaperlessController.rl_form_ams6_insert);
app.get('/api/rlob/rl_form_ams6/get_booking_doctor_company', rlobBookingPaperlessController.get_booking_doctor_company);
app.get('/api/rlob/rl_form_ams6/select_Item_rl_form_ams6_bookingid', rlobBookingPaperlessController.select_Item_rl_form_ams6_bookingid);
app.post('/api/rlob/rl_form_ams6/rl_form_ams6_update', rlobBookingPaperlessController.rl_form_ams6_update);

//rl_form_ams6
//phanquocchien.c1109g@gmail.com
app.post('/api/rlob/rl_form_ams5/addNewFormAms5', rlobBookingPaperlessController.rl_form_ams5_insert);
app.post('/api/rlob/rl_form_ams5/rl_form_ams5_update', rlobBookingPaperlessController.rl_form_ams5_update);
app.get('/api/rlob/rl_form_ams5/select_Item_rl_form_ams5_bookingid', rlobBookingPaperlessController.select_Item_rl_form_ams5_bookingid);


