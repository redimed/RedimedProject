/**
 * Created by meditech on 8/27/2014.
 */
 
app.config(function($routeProvider, $locationProvider, $httpProvider) {



    $routeProvider
        .when('/booking', {controller: "legalBookingController", templateUrl: '/sub/rediLegalOnlineBooking/booking.html'})
        .when("/customers/add",{controller:"cusAddController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/customers/edit/:id",{controller:"cusEditController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/online-booking/booking",{controller:"legalBookingController",templateUrl:"/sub/rediLegalOnlineBooking/booking.html"})
        .when("/online-booking/booking/test",{controller:'testController',templateUrl:'/sub/rediLegalOnlineBooking/test.html'})
        .when("/online-booking/booking/patient-detail/:id",{controller:'lob_patientDetailController',templateUrl:'/sub/rediLegalOnlineBooking/patient-detail.html'})
        .when("/online-booking/booking/booking-list",{controller:'lob_bookingListController',templateUrl:'/sub/rediLegalOnlineBooking/booking-list.html'})

        .when("/home",{controller:"homeController",template:" "})
    $locationProvider.html5Mode(true)
});


