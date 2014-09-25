/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking',
    ['app.loggedIn.booking.make.controller'
    ,'app.loggedIn.booking.list.controller'
    ,'app.loggedIn.booking.package.controller'
    ,'app.loggedIn.booking.services'])
    .config(function($stateProvider){
        $stateProvider

            .state("loggedIn.makeBooking",{
                url:"/onlineBooking/make",
                templateUrl: "modules/onlineBooking/views/makeBooking.html",
                controller: 'MakeBookingController'

            })

            .state('loggedIn.bookingList',{
                url:'/onlineBooking/booking',
                templateUrl: 'modules/onlineBooking/views/booking.html',
                controller: 'BookingListController'
            })

            .state('loggedIn.package',{
                url:'/onlineBooking/package',
                templateUrl: 'modules/onlineBooking/views/package.html',
                controller: 'PackageController'
            })
    });