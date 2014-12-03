/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.rlob',
    ['app.loggedIn.rlob.controller'
    ,'app.loggedIn.rlob.booking.controller'
    ,'app.loggedIn.rlob.list.controller'
    ,'app.loggedIn.rlob.patientDetail.controller'
    ,'app.loggedIn.rlob.adminBookingList.controller'
    ,'app.loggedIn.rlob.bookingDetail.controller'
    ,'app.loggedIn.rlob.services'
    ,'app.loggedIn.rlob.directive'
    ,'app.loggedIn.rlob.adminBookingReport.controller'
    ,'app.loggedIn.rlob.adminBookingReport.type3.controller'
    ,'app.loggedIn.rlob.adminBookingReport.type1.controller'
    ,'app.loggedIn.rlob.adminBookingReport.type2.controller'
    ,'app.loggedIn.rlob.adminDocumentStatusSummary.controller'
    ,'app.loggedIn.rlob.adminBookingMessages.controller'])
    .config(function($stateProvider){
        $stateProvider

            .state("loggedIn.rlob",{
                url:'/rlob',
                templateUrl: "modules/rediLegalOnlineBooking/views/rlob.html",
                controller: "rlobController"
            })

            .state("loggedIn.rlob.rlob_booking",{
                url:"/booking",
                templateUrl: "modules/rediLegalOnlineBooking/views/booking.html",
                controller: 'rlob_bookingController'
            })
            .state('loggedIn.rlob.rlob_patient_detail',{
                url:'/booking/patient-detail',
                templateUrl: '/modules/rediLegalOnlineBooking/views/patient-detail.html',
                controller: 'rlob_patientDetailController'
            })
            .state('loggedIn.rlob.rlob_admin_booking_list',{
                url:'/booking/admin-booking-list',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-list.html',
                controller: 'rlob_admin_bookingListController'
            })
            .state('loggedIn.rlob.rlob_booking_list',{
                url:'/booking/list',
                templateUrl: '/modules/rediLegalOnlineBooking/views/booking-list.html',
                controller: 'rlob_bookingListController'
            })

            .state('loggedIn.rlob.rlob_booking_detail', {
                url: '/booking/booking-detail/:bookingId',
                templateUrl: '/modules/rediLegalOnlineBooking/views/booking-detail.html',
                controller: 'rlob_bookingDetailController'
            })
            .state('loggedIn.rlob.rlob_booking_report',{
                url:'/booking/report',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-report.html',
                controller: 'rlob_admin_bookingReportController'
            })

            .state('loggedIn.rlob.rlob_booking_report.type3',{
                url:'/type3',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-report-type3.html',
                controller: 'rlob_admin_bookingReport_type3Controller'
            })

            .state('loggedIn.rlob.rlob_booking_report.type1',{
                url:'/type1',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-report-type1.html',
                controller: 'rlob_admin_bookingReport_type1Controller'
            })

            .state('loggedIn.rlob.rlob_booking_report.type2',{
                url:'/type2',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-report-type2.html',
                controller: 'rlob_admin_bookingReport_type2Controller'
            })

            .state('loggedIn.rlob.rlob_document_status_summary',{
                url:'/booking/document-status-summary',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-document-status-summary.html',
                controller: 'rlob_admin_documentStatusSummaryController'
            })
            .state('loggedIn.rlob.rlob_booking_messages',{
                url:'/booking/messages',
                templateUrl: '/modules/rediLegalOnlineBooking/views/admin-booking-messages.html',
                controller: 'rlob_admin_bookingMessagesController'
            })
//            .state('loggedIn.rlob.rlob_booking_detail', {
//                url: '/booking/booking-detail/:bookingId',
//                views: {
//                    "@loggedIn": {
//                        templateUrl: '/modules/rediLegalOnlineBooking/views/booking-detail.html',
//                        controller: 'rlob_bookingDetailController'
//                    }
//                }
//            })
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