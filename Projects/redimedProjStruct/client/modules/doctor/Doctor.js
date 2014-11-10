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
    //ADD
    .state("loggedIn.doctor.add", {
        url: "/doctor/add",
        views: {
            "main-content": {
                templateUrl: "modules/doctor/views/add.html",
                controller: "DoctorAddController"
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
                        templateUrl: "modules/doctor/views/timetable-casual.html",
                        controller: "DoctorTimetableDetailCasualController"
                    }
                }
            })

	// ITEM SHEET
	.state("loggedIn.doctor.items", {
		url: "/doctor/items",
		views: {
			"main-content": {
				templateUrl: "modules/doctor/views/items.html",
				controller: "DoctorItemsController"
			}
		}
	})
	.state("loggedIn.doctor.items.cat", {
		url: "/cat",
		views: {
			"main-content@loggedIn.doctor": {
				templateUrl: "modules/doctor/views/items-cat.html",
				controller: "DoctorItemsCatController"
			}
		}
	})
	.state("loggedIn.doctor.items.add", {
		url: "/add",
		views: {
			"main-content@loggedIn.doctor": {
				templateUrl: "modules/doctor/views/items-form.html",
				controller: "DoctorItemsAddController"
			}
		}
	})
	.state("loggedIn.doctor.items.edit", {
		url: "/edit",
		views: {
			"main-content@loggedIn.doctor": {
				templateUrl: "modules/doctor/views/items-form.html",
				controller: "DoctorItemsEditController"
			}
		}
	})
	// LIST PATIENTS
	.state("loggedIn.doctor.patients", {
		url: "/doctor/patients",
		views: {
			"main-content": {
				templateUrl: "modules/doctor/views/patients.html",
				controller: "DoctorPatientsController"
			}
		}
	})

            .state("loggedIn.doctor.patients.detail", {
                url: "/detail",
                views: {
                    "main-content@loggedIn.doctor": {
                        templateUrl: "modules/doctor/views/patients-detail.html",
                        controller: "DoctorPatientsDetailController"
                    }
                }
            })
            .state("loggedIn.doctor.patients.detail.appt", {
                url: "/appt",
                views: {
                    "main-content@loggedIn.doctor": {
                        templateUrl: "modules/doctor/views/patients-detail-appt.html",
                        controller: "DoctorPatientsDetailApptController"
                    }
                }
            })
})