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
            .state('loggedIn.vaccinob_patient_detail',{
                url:'/vaccinob/booking/patient-detail/:bookingType/:siteid/:doctorid/:id',
                templateUrl: '/modules/rediLegalOnlineBooking/views/patient-detail.html',
                controller: 'rlob_patientDetailController'
            })
            .state('loggedIn.vaccinob_booking_list',{
                url:'/vaccinob/booking/list/:bookingType',
                templateUrl: '/modules/rediLegalOnlineBooking/views/booking-list.html',
                controller: 'rlob_bookingListController'
            })
            .state('loggedIn.vaccinob_admin_booking_list',{
                url:'/vaccinob/booking/admin-booking-list/:bookingType',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-list.html',
                controller: 'rlob_admin_bookingListController'
            })

            .state('loggedIn.vaccinob_booking_detail', {
                url: '/vaccinob/booking/booking-detail/:bookingType/:bookingId',
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