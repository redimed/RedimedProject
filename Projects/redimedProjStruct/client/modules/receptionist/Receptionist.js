angular.module("app.loggedIn.receptionist", [
    "app.loggedIn.receptionist.controller",
    "app.loggedIn.receptionist.services",
    "app.loggedIn.receptionist.directives"
])

.config(function ($stateProvider) {
    $stateProvider

    // STRUCTURE
    .state("loggedIn.receptionist", {
        abstract: true,
        templateUrl: "modules/receptionist/views/structure.html",
        controller: "ReceptionistController"
    })

    // APPOINTMENT
    .state("loggedIn.receptionist.home", {
        url: "/receptionist/home",
        views: {
            "main-content": {
                templateUrl: "modules/receptionist/views/home.html",
                controller: "ReceptionistHomeController"
            }
        }
    })

   
})