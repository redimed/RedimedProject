/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.vaccinob',
    ['app.loggedIn.rlob.booking.controller'
    ,'app.loggedIn.rlob.services'
    ,'app.loggedIn.rlob.directive'])
    .config(function($stateProvider){
        $stateProvider
            .state("loggedIn.vaccinob_booking",{
                url:"/vaccinob/booking/:bookingType",
                templateUrl: "modules/rediLegalOnlineBooking/views/booking.html",
                controller: 'rlob_bookingController'
            })

//
		// VUONG
//            .state('loggedIn.rlob_booking_list.detail', {
//                url: '/:bookingId',
//                views: {
//                    "@loggedIn": {
//                        templateUrl: '/modules/rediLegalOnlineBooking/views/booking-detail.html',
//                        controller: 'rlob_bookingDetailController'
//                    }
//                }
//            })
//            .state('loggedIn.package',{
//                url:'/onlineBooking/package',
//                templateUrl: 'modules/onlineBooking/views/package.html',
//                controller: 'PackageController'
//            })
    });