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



        return adminBooking;
})