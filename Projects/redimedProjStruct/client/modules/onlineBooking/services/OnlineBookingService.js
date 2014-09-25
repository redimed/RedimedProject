/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.services',[])
.factory('OnlineBookingService',function(Restangular){
        var bookingService = {};
        var api = Restangular.all('api');

        bookingService.getSubCompany = function(id){
            var sub = api.all('company/getSub');
            return sub.post({id:id});
        }

        bookingService.getPackage = function(id){
            var package = api.all('booking/package');
            return package.post({id:id});
        }

        bookingService.getPackageAss = function(id){
            var ass = api.all('booking/packageAss');
            return ass.post({id:id});
        }

        bookingService.getBookingList = function(id){
            var list = api.all('booking/list');
            return list.post({id:id});
        }

        bookingService.getBookingDetail = function(id){
            var detail = api.all('booking/detail');
            return detail.post({id:id});
        }

        bookingService.cancelBooking = function(id){
            var cancel = api.all('booking/cancel');
            return cancel.post({id:id});
        }

        bookingService.getSite = function(){
            var site = api.one('redimedsite/list');
            return site.get();
        }

        bookingService.getCalendar = function(id,from,to){
            var cal = api.all('booking/calendar');
            return cal.post({siteId:id,fromDate:from,toDate:to});
        }

        bookingService.getAppointmentTime = function(id){
            var time = api.all('booking/appointmentTime');
            return time.post({id:id});
        }

        bookingService.changeBookingTime = function(siteId,from,to,calId,appTime,bookId){
            var submit = api.all('booking/changeBookingTime');
            return submit.post({siteId:siteId,from:from,to:to,calId:calId,appTime:appTime, bookId:bookId});
        }


        return bookingService;
    })