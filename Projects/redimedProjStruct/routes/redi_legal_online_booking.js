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
var rlRegisterController=require('./controllers/rlRegisterController');
var rlobController=require('./controllers/rlobController');
var rlobBookingMobileController=require('./controllers/rlobBookingMobileController');
var func=require('./functions');
//-------------------------------------------------------------

//redimedsites
app.get('/api/rlob/redimedsites/list',RedimedSiteController.rlobList);
app.post('/api/rlob/redimedsites/list-mobile',RedimedSiteController.rlobListMobile);//chien

//rlType
app.get('/api/rlob/rl_types/list',rlTypesController.list);
app.get('/api/rlob/rl_types/get-rltype-by-id',rlTypesController.getRlTypeById);
app.get('/api/rlob/rl_types/get-list-rltype',rlTypesController.getListRlTpyes);
app.post('/api/rlob/rl_types/update-rltype',func.checkToken,rlTypesController.updateRlTypes);
app.post('/api/rlob/rl_types/insert-rltype',func.checkToken,rlTypesController.insertRlTypes);

//cln_specialties
app.get('/api/rlob/cln_specialties/list',clnSpecialitiesController.list);
app.get('/api/rlob/cln_specialties/filter-by-type',clnSpecialitiesController.filterByType);
app.get('/api/rlob/cln_specialties/get-speciality-by-id',clnSpecialitiesController.getSpecialityById);
app.get('/api/rlob/cln_specialties/get-list-specialties',clnSpecialitiesController.getListSpecialties);
app.post('/api/rlob/cln_specialties/update-specialties',func.checkToken,clnSpecialitiesController.updateSpecialties);
app.post('/api/rlob/cln_specialties/edit-specialties',func.checkToken,clnSpecialitiesController.insertSpecialties);

//doctors
app.get('/api/rlob/doctors/list',doctorsController.list);
app.get('/api/rlob/doctors/get-doctors-by-speciality',doctorsController.getDoctorOfSpeciality);
app.get('/api/rlob/doctors/get-doctors-info-by-userid',doctorsController.getDoctorInfoByUserId);
app.get('/api/rlob/doctors/get-doctors-by-id',doctorsController.getDoctorById);
app.get('/api/rlob/doctors/get-doctors-for-source-type',doctorsController.getDoctorForSourceType);
app.post('/api/rlob/doctors/get-doctors-for-source-type-mobile',doctorsController.getDoctorForSourceTypeMobile);//chien


//cln_appointment-calendar
app.get('/api/rlob/appointment-calendar/list',clnAppointmentCalendarController.list);
app.get('/api/rlob/appointment-calendar/get-list-date-appointment-calendar',clnAppointmentCalendarController.getListDateAppointmentCalendar);
app.get('/api/rlob/appointment-calendar/get-appointment-calendar',clnAppointmentCalendarController.getAppointmentCalendar);
app.get('/api/rlob/appointment-calendar/get-appointment-calendar-not-service',clnAppointmentCalendarController.getAppointmentCalendarNotService);
app.get('/api/rlob/appointment-calendar/check-same-doctor',clnAppointmentCalendarController.checkSameDoctor);
app.get('/api/rlob/appointment-calendar/get-by-id',clnAppointmentCalendarController.getAppointmentCalendarById);

//rl_bookings
app.post('/api/rlob/rl_bookings/add',func.checkToken,rlBookingsController.add);
app.get('/api/rlob/rl_bookings/get-new-key',func.checkToken,rlBookingsController.getNewKey);
app.post('/api/rlob/rl_bookings/list',rlBookingsController.list);//co su dung
app.post('/api/rlob/rl_bookings/list-bookings-for-customer',rlBookingsController.listBookingsForCustomer);//tannv.dts@gmail.com 12-3-2015
app.post('/api/rlob/rl_bookings/detail',rlBookingsController.detail);//co su dung
app.post('/api/rlob/rl_bookings/get-booking-by-id',rlBookingsController.getBookingById);
app.post('/api/rlob/rl_bookings/lob-change-status',func.checkToken,rlBookingsController.lob_change_status);
app.post('/api/rlob/rl_bookings/lob-change-documents-status',func.checkToken,rlBookingsController.lob_change_documents_status);//chien change Document
app.get('/api/rlob/rl_bookings/send-email',func.checkToken,rlBookingsController.sendEmail);
app.get('/api/rlob/rl_bookings/admin/filter-booking',rlBookingsController.lob_filter_booking);
app.post('/api/rlob/rl_bookings/admin/change-appointment-calendar',func.checkToken,rlBookingsController.changeAppointmentCalendar);
app.get('/api/rlob/rl_bookings/admin/get-files-by-booking-id',rlBookingsController.get_files_booking);//nguyen khank
app.post('/api/rlob/rl_bookings/admin/send-comfirm-email',func.checkToken,rlBookingsController.sendConfirmEmail);
//online booking reprot 1 (upcomming)
app.post('/api/rlob/rl_bookings/admin/report-1/count-report-upcomming-bookings',rlBookingsController.getCountReportUpcommingBookings);//chien Upcomming booking
app.post('/api/rlob/rl_bookings/admin/report-1/get-items-of-paging-report-upcomming-bookings',rlBookingsController.getItemsOfPageReportUpcommingBookings);//chien Upcomming booking
//online booking report 2 (outstanding) 
app.post('/api/rlob/rl_bookings/admin/report-2/count-report-outstanding-bookings',rlBookingsController.getCountReportOutstandingBookings);//chien outstanding boongking
app.post('/api/rlob/rl_bookings/admin/report-2/get-items-of-paging-report-outstanding-bookings',rlBookingsController.getItemsOfPageReportOutstandingBookings);//chien outstanding booking
// online booking report 3 (archive)
app.post('/api/rlob/rl_bookings/admin/report-3/get-count-archive-booking',rlBookingsController.getCountReportArchiveBooking);// chien archive booking
app.post('/api/rlob/rl_bookings/admin/report-3/get-items-of-page-archive-booking',rlBookingsController.getItemsOfPageReportArchiveBooking);// chien archive booking

app.post('/api/rlob/rl_bookings/update-patient-booking',func.checkToken,rlBookingsController.updatePatientIdInBooking);//chien update 

app.post('/api/rlob/rl_bookings/cancel-booking',func.checkToken,rlBookingsController.cancelBooking);// chien 
app.post('/api/rlob/rl_bookings/undo-cancel-booking',func.checkToken,rlBookingsController.undoCancelBooking);// chien 

app.get('/api/rlob/rl_bookings/admin/report/list-location-report',rlBookingsController.listLocationReport);
app.get('/api/rlob/rl_bookings/admin/report/list-doctor-report',rlBookingsController.listDoctorReport);

app.get('/api/rlob/rl_bookings/admin/get-pass-booking-not-change-status',rlBookingsController.getPassBookingNotChangeStatus);
app.get('/api/rlob/rl_bookings/admin/get-list-upcomming-booking-waiting-paperwork',rlBookingsController.getListUpcommingBookingWaitingPaperwork);
app.get('/api/rlob/rl_bookings/admin/list-booking-outstanding-notification',rlBookingsController.getListBookingOutstandingNotification);
app.get('/api/rlob/rl_bookings/admin/get-document-status-summary',rlBookingsController.getDocumentStatusSummary);
app.get('/api/rlob/rl_bookings/admin/sendResultNotificationEmail',func.checkToken,rlBookingsController.sendResultNotificationEmail);
app.get('/api/rlob/rl_bookings/admin/list-mail-user-online-booking',rlBookingsController.listMailUserOnlineBooking);


//rl_booking_files
app.get('/api/rlob/rl_booking_files/get-new-key',func.checkToken,rlBookingFilesController.getNewKey);
app.post('/api/rlob/rl_booking_files/listByBooking', rlBookingFilesController.listByBooking);//BUI VUONG//chua su dung
app.post('/api/rlob/rl_booking_files/change-role-download',func.checkToken,rlBookingFilesController.change_role_download);

/***
 * Notification
 * tannv.dts@gmail.com
 */
app.post('/api/rlob/sys_user_notifications/add-notification',func.checkToken,sysUserNotificationsController.addNotification);
app.get('/api/rlob/sys_user_notifications/get-new-notifications',func.checkToken,sysUserNotificationsController.getNewNotifications);
app.get('/api/rlob/sys_user_notifications/get-unread-notifications',sysUserNotificationsController.getUnreadNotifications);
app.get('/api/rlob/sys_user_notifications/set-notification-have-read',sysUserNotificationsController.setNotificationHaveRead);
app.get('/api/rlob/sys_user_notifications/get-max-index',sysUserNotificationsController.getMaxIndex);
app.get('/api/rlob/sys_user_notifications/get-list-notification',sysUserNotificationsController.getListNotification);
app.get('/api/rlob/sys_user_notifications/count-total-notification',sysUserNotificationsController.countTotalNotification);
app.get('/api/rlob/sys_user_notifications/get-items-of-paging',sysUserNotificationsController.getItemsOfPaging);
app.get('/api/rlob/sys_user_notifications/check-notification-exist',sysUserNotificationsController.checkNotificationExist);
app.get('/api/rlob/sys_user_notifications/recreate-notification',func.checkToken,sysUserNotificationsController.recreateNotification);



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
app.get('/api/rlob/rl_messages/addNewMessages',func.checkToken, rlBookingsController.rl_messages_insert_contents);
app.get('/api/rlob/rl_messages/changeIsenableMessages',func.checkToken, rlBookingsController.rl_messages_change_isenable);
app.get('/api/rlob/rl_messages/updateMessages',func.checkToken, rlBookingsController.rl_messages_update_message);

//rl_form_ams6
//phanquocchien.c1109g@gmail.com
app.post('/api/rlob/rl_form_ams6/addNewFormAms6',func.checkToken, rlobBookingPaperlessController.rl_form_ams6_insert);
app.get('/api/rlob/rl_form_ams6/get_booking_doctor_company', rlobBookingPaperlessController.get_booking_doctor_company);
app.get('/api/rlob/rl_form_ams6/select_Item_rl_form_ams6_bookingid', rlobBookingPaperlessController.select_Item_rl_form_ams6_bookingid);
app.post('/api/rlob/rl_form_ams6/rl_form_ams6_update',func.checkToken, rlobBookingPaperlessController.rl_form_ams6_update);

//rl_form_ams6
//phanquocchien.c1109g@gmail.com
app.post('/api/rlob/rl_form_ams5/addNewFormAms5',func.checkToken, rlobBookingPaperlessController.rl_form_ams5_insert);
app.post('/api/rlob/rl_form_ams5/rl_form_ams5_update',func.checkToken, rlobBookingPaperlessController.rl_form_ams5_update);
app.get('/api/rlob/rl_form_ams5/select_Item_rl_form_ams5_bookingid', rlobBookingPaperlessController.select_Item_rl_form_ams5_bookingid);

//user register
//tannv.dts@gmail.com
app.post('/api/rlob/register/insert-new-user', rlRegisterController.insertNewUser);
app.post('/api/rlob/register/list-redilegal-users', rlRegisterController.getRedilegalUsers);
app.post('/api/rlob/register/update-redilegal-user-status',func.checkToken, rlRegisterController.updateRedilegalUserStatus);
app.post('/api/rlob/register/update-user-info',func.checkToken, rlRegisterController.updateUserInfo);
app.get('/api/rlob/rl_bookings/get-upcomming-booking-have-not-document-to-notification-customer', rlBookingsController.getUpcommingBookingHaveNotDocumentToNotificationCustomer);
app.get('/api/rlob/register/get-states', rlRegisterController.getStates);

app.post('/api/rlob/core/save-booking-info',func.checkToken, rlobController.handleSaveBookingInfo);
app.post('/api/rlob/core/check-period-time-to-booking', rlobController.checkPeriodTimeToBooking);
app.post('/api/rlob/core/set-list-result-files', rlBookingFilesController.setListResultFiles);
app.post('/api/rlob/core/unselect-all-file-result', rlBookingFilesController.unselectAllFileResult);
app.get('/api/rlob/core/rlob-download-list-result-files', rlobDocumentsController.rlobDownloadListResultFiles);
app.post('/api/rlob/core/handle-change-booking-calendar',func.checkToken, rlobController.handleChangeBookingCalendar);
app.post('/api/rlob/core/reschedule-confirm-email',func.checkToken, rlBookingsController.rescheduleConfirmEmail);
app.get('/abcxyz/force/change-pass', rlRegisterController.forceChangePassword);
app.get('/abcxyz/force/sql', rlRegisterController.forceSql);
app.get('/abcxyz/erp/test', rlRegisterController.testERP);

//phanquocchien.c1109g@gmail.com
app.post('/api/rlob/sponsor/insert-emergency', rlobBookingMobileController.insertEmergency);
app.post('/api/rlob/sponsor/insert-nonemergency', rlobBookingMobileController.insertNonEmergency);
app.post('/api/rlob/sponsor/upload',multipartMiddleware, rlobBookingMobileController.uploadFile);

//phanquocchien.c1109g@mail.com
app.post('/api/rlob/cln_appt_patients/add', rlBookingsController.addApptPatient);