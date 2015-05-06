/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.medifood',
    ['app.loggedIn.medifood.controller'
    ,'app.loggedIn.medifood.admin.controller'
    ,'app.loggedIn.medifood.booking.controller'
    ,'app.loggedIn.medifood.service'
    ])
    .config(function($stateProvider){
        $stateProvider

            .state("loggedIn.medifood",{
                url:'/medifood',
                templateUrl: "modules/medifood/views/medifood.html",
                controller: "medifoodController"
            })
            .state("loggedIn.medifood.admin",{
                url:'/admin',
                templateUrl: "modules/medifood/views/admin.html",
                controller:"medifoodAdminController"
            })

            .state("loggedIn.medifood.booking",{
                url:'/booking',
                templateUrl: "modules/medifood/views/booking.html",
                controller:"medifoodBookingController"
            })

            // .state("loggedIn.rlob.rlob_booking",{
            //     url:"/booking",
            //     templateUrl: "modules/rediLegalOnlineBooking/views/booking.html",
            //     controller: 'rlob_bookingController'
            // })
    });