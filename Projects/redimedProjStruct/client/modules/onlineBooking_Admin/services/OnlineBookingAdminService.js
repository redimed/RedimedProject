/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin.services',[])
    .factory('OnlineBookingAdminService',function(Restangular) {
        var adminBooking = {};
        var api = Restangular.all('api');

        adminBooking.getList = function(){
            var list = api.one('booking/list');
            return list.get();
        }

        adminBooking.editBookingInfo = function(info){
            var edit = api.all('booking/edit');
            return edit.post({info:info});
        }

        adminBooking.confirmBooking = function(info){
            var confirm = api.all('booking/confirm');
            return confirm.post({info:info});
        }

        adminBooking.getAssHeader = function(){
            var head = api.one('assessment/header');
            return head.get();
        }

        adminBooking.getAssessment = function(){
            var a = api.one('assessment');
            return a.get();
        }



        return adminBooking;
})