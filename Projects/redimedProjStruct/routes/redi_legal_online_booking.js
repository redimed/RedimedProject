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
app.get('/api/rlob/redimedsites/list',RedimedSiteController.list);

//rlType
app.get('/api/rlob/rl_types/list',rlTypesController.list);

//cln_specialties
app.get('/api/rlob/cln_specialties/list',clnSpecialitiesController.list);
app.get('/api/rlob/cln_specialties/filter-by-type',clnSpecialitiesController.filterByType);

//doctors
app.get('/api/rlob/doctors/list',doctorsController.list);
app.get('/api/rlob/doctors/get-doctors-by-speciality',doctorsController.getDoctorOfSpeciality);
app.get('/api/rlob/doctors/get-doctors-info-by-userid',doctorsController.getDoctorInfoByUserId);
app.get('/api/rlob/doctors/get-doctors-by-id',doctorsController.getDoctorById);


//cln_appointment-calendar
app.get('/api/rlob/appointment-calendar/list',clnAppointmentCalendarController.list);
app.get('/api/rlob/appointment-calendar/get-appointment-calendar',clnAppointmentCalendarController.getAppointmentCalendar);
app.get('/api/rlob/appointment-calendar/check-same-doctor',clnAppointmentCalendarController.checkSameDoctor);

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


//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();
//var rlobUploadController=require('./controllers/rlobUploadController');
//app.post('/api/rlob/rl_booking_files/upload',multipartMiddleware, rlobUploadController.rlobUploadFile);
