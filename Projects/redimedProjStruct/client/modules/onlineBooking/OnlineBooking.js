/**
 * Created by meditech on 24/09/2014.
 */
angular.module('app.loggedIn.booking',
    ['app.loggedIn.booking.make.controller'
    ,'app.loggedIn.booking.list.controller'
    ,'app.loggedIn.booking.package.controller'
    ,'app.loggedIn.booking.position.controller'
    ,'app.loggedIn.booking.setting.controller'
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

            .state('loggedIn.position',{
                url:'/onlineBooking/position',
                templateUrl:'modules/onlineBooking/views/position.html',
                controller: 'PositionController'
            })

            .state('loggedIn.setting',{
                url:'/onlineBooking/setting',
                templateUrl:'modules/onlineBooking/views/settings.html',
                controller:'SettingController'
            })

            .state('loggedIn.newUser',{
                url:'/onlineBooking/setting/newUser',
                templateUrl: 'modules/onlineBooking/views/newUser.html',
                controller:'NewUserSettingController'
            })

            .state('loggedIn.editUser',{
                url:'/onlineBooking/setting/editUser/:id',
                templateUrl:'modules/onlineBooking/views/newUser.html',
                controller:'EditUserSettingController'
            })

    });