/**
 * Created by meditech on 8/27/2014.
 */
 
app.config(function($routeProvider, $locationProvider, $httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider
        .when("/customers/add",{controller:"cusAddController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/customers/edit/:id",{controller:"cusEditController",templateUrl:"/sub/helloWorld/detail.html"})
        .when("/online-booking/booking",{controller:"legalBookingController",templateUrl:"/sub/rediLegalOnlineBooking/booking.html"})
        .when("/online-booking/booking/test",{controller:'testController',templateUrl:'/sub/rediLegalOnlineBooking/test.html'})
        .when("/online-booking/booking/patient-detail/:siteid/:id",{controller:'lob_patientDetailController',templateUrl:'/sub/rediLegalOnlineBooking/patient-detail.html'})
        .when("/online-booking/booking/booking-list",{controller:'lob_bookingListController',templateUrl:'/sub/rediLegalOnlineBooking/booking-list.html'})
        .when("/functions",{controller:'functionController', templateUrl:'/sub/function/function.html'})
        .when("/menus",{controller:'menuController', templateUrl:'/sub/menu/menu.html'})
        .when("/gorgonFA",{controller:'gorgonFAController', templateUrl:'/sub/pemDoc/gorgonFA/gorgonFA.html'})
        .when("/gorgonMH",{controller:'gorgonMHController',templateUrl:'/sub/pemDoc/gorgonMH/gorgonMH.html'})
        .when("/gorgon",{templateUrl:'/sub/pemDoc/gorgon/gorgon.html'})
        .when("/gorgonUQ",{controller:'gorgonUQController',templateUrl:'/sub/pemDoc/gorgonUQ/gorgonUQ.html'})
        .when("/category2",{templateUrl:'/sub/pemDoc/category2/category2.html'})
        .when("/home",{controller:"homeController",template:" "})
		
		.when("/telehealth/form",{controller:"telehealthFormController",templateUrl:"/sub/telehealth/patientForm.html"})
	.when("/online-booking/booking/upload",{controller:'rob_uploadController', templateUrl:'/sub/rediLegalOnlineBooking/upload.html'})
    $locationProvider.html5Mode(true)
});


