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

        return bookingService;
    })