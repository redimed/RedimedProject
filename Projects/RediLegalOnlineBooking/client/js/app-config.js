/**
 * Created by meditech on 8/27/2014.
 */
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {controller: "cusListController", templateUrl: '/sub/helloWorld/list.html'})
        .when("/customers/add",{controller:"cusAddController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/customers/edit/:id",{controller:"cusEditController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/online-booking/booking",{controller:"legalBookingController",templateUrl:"/sub/rediLegalOnlineBooking/booking.html"})
    $locationProvider.html5Mode(true)
});
//
//app.config(function($routeProvider,$locationProvider){
//    $routeProvider
//
//    $locationProvider.html5Mode(true)
//});