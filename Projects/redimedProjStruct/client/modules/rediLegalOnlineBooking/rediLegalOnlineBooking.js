/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.rlob',
    ['app.loggedIn.rlob.booking.controller'
    ,'app.loggedIn.rlob.list.controller'
    ,'app.loggedIn.rlob.patientDetail.controller'
    ,'app.loggedIn.rlob.adminBookingList.controller'
    ,'app.loggedIn.rlob.bookingDetail.controller'
    ,'app.loggedIn.rlob.services'
    ,'app.loggedIn.rlob.directive'])
    .config(function($stateProvider){
        $stateProvider
            .state("loggedIn.rlob_booking",{
                url:"/rlob/booking",
                templateUrl: "modules/rediLegalOnlineBooking/views/booking.html",
                controller: 'rlob_bookingController'
            })
            .state('loggedIn.rlob_patient_detail',{
                url:'/rlob/booking/patient-detail',
                templateUrl: '/modules/rediLegalOnlineBooking/views/patient-detail.html',
                controller: 'rlob_patientDetailController'
            })
            .state('loggedIn.rlob_admin_booking_list',{
                url:'/rlob/booking/admin-booking-list',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-list.html',
                controller: 'rlob_admin_bookingListController'
            })
            .state('loggedIn.rlob_booking_list',{
                url:'/rlob/booking/list',
                templateUrl: '/modules/rediLegalOnlineBooking/views/booking-list.html',
                controller: 'rlob_bookingListController'
            })

            .state('loggedIn.rlob_booking_detail', {
                url: '/rlob/booking/booking-detail/:bookingId',
                views: {
                    "@loggedIn": {
                        templateUrl: '/modules/rediLegalOnlineBooking/views/booking-detail.html',
                        controller: 'rlob_bookingDetailController'
                    }
                }
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