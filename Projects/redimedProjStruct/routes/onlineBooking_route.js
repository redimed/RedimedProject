/**
 * Created by meditech on 06/10/2014.
 */
var BookingController = require('./controllers/BookingController');

app.post('/api/booking/packageList', BookingController.packageList);
app.post('/api/booking/list/companyId',BookingController.bookingListByCompany);
app.get('/api/booking/list',BookingController.bookingList);
app.post('/api/booking/detail',BookingController.bookingDetail);
app.post('/api/booking/cancel',BookingController.cancelBooking);
app.post('/api/booking/calendar',BookingController.calendarList);
app.post('/api/booking/appointmentTime',BookingController.appointmentTime);
app.post('/api/booking/changeBookingTime',BookingController.changeBookingTime);
app.post('/api/booking/deletePackage',BookingController.removePackage);
app.get('/api/booking/assList',BookingController.assList);
app.post('/api/booking/position/list',BookingController.positionList);
app.post('/api/booking/position/delete',BookingController.deletePosition);
app.post('/api/booking/position/insert',BookingController.insertPosition);
app.post('/api/booking/submit',BookingController.submitBooking);
app.post('/api/booking/edit',BookingController.editBooking);
app.post('/api/booking/confirm',BookingController.confirmBooking);