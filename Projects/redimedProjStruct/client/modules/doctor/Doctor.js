angular.module("app.loggedIn.doctor", [
    "app.loggedIn.doctor.controller",
    "app.loggedIn.doctor.services"
])

.config(function ($stateProvider) {
    $stateProvider

    // STRUCTURE
    .state("loggedIn.doctor", {
        abstract: true,
        templateUrl: "modules/doctor/views/structure.html",
        controller: "DoctorController"
    })
    // HOME
    .state("loggedIn.doctor.home", {
        url: "/doctor/home",
        views: {
            "main-content": {
                templateUrl: "modules/doctor/views/home.html",
                controller: "DoctorHomeController"
            }
        }
    })
    // TIMETABLE
    .state("loggedIn.doctor.timetable", {
        url: "/doctor/timetable",
        views: {
            "main-content": {
                templateUrl: "modules/doctor/views/timetable.html",
                controller: "DoctorTimetableController"
            }
        }
    })

    // TIMETABLE DETAIL STRUCTURE
    .state("loggedIn.doctor.timetable.detail", {
        abstract: true,
        url: "/:doctorId",
        views: {
            "main-content@loggedIn.doctor": {
                templateUrl: "modules/doctor/views/structure-timetable.html",
                controller: "DoctorTimetableDetailController"
            }
        }
    })

    // TIMETABLE DETAIL CALENDAR DEFINITION
    .state("loggedIn.doctor.timetable.detail.calendar", {
        url: "/calendar",
        views: {
            "main-content-timetable": {
                templateUrl: "modules/doctor/views/timetable-calendar.html",
                controller: "DoctorTimetableDetailCalendarController"
            }
        }
    })

    // TIMETABLE DETAIL PROFILE
    .state("loggedIn.doctor.timetable.detail.profile", {
        url: "/profile",
        views: {
            "main-content-timetable": {
                templateUrl: "modules/doctor/views/timetable-profile.html",
                controller: "DoctorTimetableDetailProfileController"
            }
        }
    })

    // TIMETABLE DETAIL CASUAL
    .state("loggedIn.doctor.timetable.detail.casual", {
        url: "/casual",
        views: {
            "main-content-timetable": {
                templateUrl: "modules/doctor/views/timetable-casual.html"
            }
        }
    })
})