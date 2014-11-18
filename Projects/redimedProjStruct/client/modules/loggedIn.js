angular.module("app.loggedIn",[
	"app.loggedIn.controller", // LOGGED IN CONTROLLER
	"app.loggedIn.home", // HOME MODULE
	"app.loggedIn.user"	,	// USER MODULE
    "app.loggedIn.function", //FUNCTION MODULE
    "app.loggedIn.menu", //MENU MODULE
    "app.loggedIn.telehealth", //Telehealth MODULE
    "app.loggedIn.booking", //ONLINE-BOOKING MODULE
    "app.loggedIn.booking.admin",
    "app.loggedIn.document", // Document telehealth
    "app.loggedIn.rlob", //Redi Legal Online Booking
    "app.loggedIn.vaccinob",//Vaccination Online Booking
    "app.loggedIn.company", // COMPANY MODULE
    "app.loggedIn.doctor",   // DOCTOR MODULE
    "app.loggedIn.receptionist", // RECEPTIONIST MODULE
    "app.loggedIn.patient",
    "app.loggedIn.waworkcover",
	"app.loggedIn.certificate"
])

.config(function($stateProvider) {
        $stateProvider

            .state("loggedIn", {
                abstract: true,
                views: {
                    "root": {
                        templateUrl: "common/views/structure.html",
                        controller: "loggedInController"
                    }
                }
            })
    })


