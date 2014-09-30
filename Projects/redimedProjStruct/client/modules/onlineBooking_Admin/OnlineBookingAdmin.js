/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin',[
    'app.loggedIn.booking.admin.services',
    'app.loggedIn.booking.admin.booking.controller'
])
.config(function($stateProvider){
        $stateProvider
            .state('loggedIn.admin_booking',{
                url:'/admin/onlineBooking/booking',
                templateUrl: 'modules/onlineBooking_Admin/views/booking.html',
                controller: 'BookingController'
            })
    })