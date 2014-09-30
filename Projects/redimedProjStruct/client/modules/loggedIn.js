angular.module("app.loggedIn",[
	"app.loggedIn.controller", // LOGGED IN CONTROLLER

	"app.loggedIn.home", // HOME MODULE
	"app.loggedIn.user"	,	// USER MODULE
    "app.loggedIn.function", //FUNCTION MODULE
    "app.loggedIn.menu", //MENU MODULE
    "app.loggedIn.telehealth", //Telehealth MODULE
    "app.loggedIn.booking", //ONLINE-BOOKING MODULE
    "app.loggedIn.PmProperties" //PROPERTY MODULE
])

.config(function($stateProvider){
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