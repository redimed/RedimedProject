/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking.services',[])
.factory('OnlineBookingService',function(Restangular){
        var bookingService = {};
        var api = Restangular.all('api');

        bookingService.getSubCompany = function(id){
            var sub = api.all('company/sub');
            return sub.post({id:id});
        }

        bookingService.getPackage = function(id){
            var package = api.all('booking/packageList');
            return package.post({id:id});
        }

        bookingService.getPackageAssById = function(id){
            var ass = api.all('package/assessment/id');
            return ass.post({id:id});
        }

        bookingService.getPackageAss = function(){
            var ass = api.one('package/assessment');
            return ass.get();
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

        bookingService.deletePackage = function(id,comId){
            var delPackage = api.all('booking/deletePackage');
            return delPackage.post({id:id,comId:comId});
        }

        bookingService.insertPackage = function(name,comId){
            var insert = api.all('package/insert');
            return insert.post({name:name,comId:comId});
        }

        bookingService.getAssList = function(){
            var assList = api.one('booking/assList');
            return assList.get();
        }

        bookingService.getPositionList = function(comId){
            var position = api.all('booking/positionList');
            return position.post({comId:comId});
        }

        bookingService.submitBook = function(info,head){
            var submit = api.all('booking/submit');
            return submit.post({info:info,header:head});
        }

        bookingService.getSubCompanyInfo = function(id){
            var sub = api.all('company/sub/info');
            return sub.post({comId:id});
        }




        return bookingService;
    })