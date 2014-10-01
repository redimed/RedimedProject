/**
 * Created by meditech on 30/09/2014.
 */
angular.module('app.loggedIn.booking.admin',[
    'app.loggedIn.booking.admin.services',
    'app.loggedIn.booking.admin.booking.controller',
    'app.loggedIn.booking.admin.assessment.controller'
])
.config(function($stateProvider){
        $stateProvider
            .state('loggedIn.admin_booking',{
                url:'/admin/booking/booking',
                templateUrl: 'modules/onlineBooking_Admin/views/booking.html',
                controller: 'BookingController'
            })

            .state('loggedIn.admin_assessment',{
                url:'/admin/booking/assessment',
                templateUrl: 'modules/onlineBooking_Admin/views/assessment.html',
                controller: 'AssessmentController'
            })
    })