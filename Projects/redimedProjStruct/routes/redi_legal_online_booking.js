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
app.get('/api/rlob/rl_bookings/send-email',rlBookingsController.sendEmail);
app.get('/api/rlob/rl_bookings/admin/filter-booking',rlBookingsController.lob_filter_booking);
app.post('/api/rlob/rl_bookings/admin/change-appointment-calendar',rlBookingsController.changeAppointmentCalendar);
app.get('/api/rlob/rl_bookings/admin/get-files-by-booking-id',rlBookingsController.get_files_booking);//nguyen khank
app.post('/api/rlob/rl_bookings/admin/send-comfirm-email',rlBookingsController.sendConfirmEmail);
app.get('/api/rlob/rl_bookings/admin/status',rlBookingsController.bookingsListStatus);//chien
app.get('/api/rlob/rl_bookings/admin/report',rlBookingsController.bookingsList);//chien
app.get('/api/rlob/rl_bookings/admin/report/get-pass-booking-have-not-result',rlBookingsController.getReportPassBookingHaveNotResult);//tannv.dts@gmail.com/report: get pass booking have not result
app.get('/api/rlob/rl_bookings/admin/report/get-count-pass-booking-have-not-result',rlBookingsController.getCountReportPassBookingHaveNotResult);//tannv.dts@gmail.com/report: count total number of pass booking have not result
app.get('/api/rlob/rl_bookings/admin/report/get-items-of-page-pass-booking-have-not-result',rlBookingsController.getItemsOfPageReportPassBookingHaveNotResult);//tannv.dts@gmail.com/report: items of page pass booking have not result


app.get('/api/rlob/rl_bookings/admin/get-pass-booking-not-change-status',rlBookingsController.getPassBookingNotChangeStatus);
app.get('/api/rlob/rl_bookings/admin/get-upcomming-booking-have-not-client-document',rlBookingsController.getUpcommingBookingHaveNotClientDocument);
app.get('/api/rlob/rl_bookings/admin/get-pass-booking-have-not-result',rlBookingsController.getPassBookingHaveNotResult);

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



//structure
app.post('/api/structure/list-appointments-upcoming',structureController.list_appointments_calendar_upcoming);
app.get('/api/download/structure/attach-file/:sourceName/:refId', structureController.downloadLetterAttachFile);

//Documents
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var rlobDocumentsController=require('./controllers/rlobDocumentsController');
app.post('/api/rlob/rl_booking_files/upload',multipartMiddleware, rlobDocumentsController.rlobUploadFile);
app.get('/api/download/lob/document/:fileId(*)', rlobDocumentsController.rlobDowloadFile);
