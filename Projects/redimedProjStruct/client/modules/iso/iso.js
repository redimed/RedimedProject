/**
 * Created by tannv.dts@gmail.com on 12/2/2014.
 */
/**
 * Created by tannv.dts@gmail.com on 9/27/2014.
 */
angular.module('app.loggedIn.iso',
    ['app.loggedIn.iso.controller'
        ,'app.loggedIn.iso.service'
        ,'app.loggedIn.iso.directive'
    ,'app.loggedIn.isoSubmitStatusPendingController.controller'])
    .config(function($stateProvider){
        $stateProvider

            .state("loggedIn.iso",{
                url:'/iso',
                templateUrl: "modules/iso/views/iso.html",
                controller: "isoController"
            })

//            .state("loggedIn.rlob.rlob_booking",{
//                url:"/booking",
//                templateUrl: "modules/rediLegalOnlineBooking/views/booking.html",
//                controller: 'rlob_bookingController'
//            })
            .state("loggedIn.isoSubmitStatusPending",{
                url:'/isoSubmitStatusPending',
                templateUrl:"modules/iso/views/isoSubmitStatusPending.html",
                controller:"isoSubmitStatusPendingController"
            })
    });