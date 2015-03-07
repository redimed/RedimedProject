angular.module("app.loggedIn.doctor", [
    "app.loggedIn.doctor.controller",
    "app.loggedIn.doctor.services",
    "app.loggedIn.doctor.directives",

    //MODULES CON
    "app.loggedIn.doctor.waitingList"
])

.config(function ($stateProvider) {
    $stateProvider

    // STRUCTURE
    .state("loggedIn.doctor", {
        abstract: true,
        templateUrl: "modules/doctor/views/structure.html",
        controller: "DoctorController"
    })

    //PAPERLESS
    .state("loggedIn.doctor.paperless", {
        url: "/doctor/paperless/:patient_id/:cal_id",
        views: {
            "main-content":{
                templateUrl: "modules/doctor/views/paperless.html",
                controller: "DoctorPaperlessController"
            }
        }
    })
    //END PAPERLESS
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
    
    //DOCTOR LIST
    .state('loggedIn.doctor.list',{
        url:"/doctor/list",
        views:{
            "main-content":{
                templateUrl:"modules/doctor/views/doclist.html",
                controller:"DoctorListController"
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
  // TIMETABLE DETAIL LEAVE
    .state("loggedIn.doctor.timetable.detail.leave", {
        url: "/leave",
        views: {
            "main-content-timetable": {
                templateUrl: "modules/doctor/views/timetable-leave.html",
                controller: "DoctorTimetableDetailLeaveController"
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
	.state("loggedIn.doctor.patients.detail.appt.more", {
                url: "/more",
                views: {
                    "main-content@loggedIn.doctor": {
                        templateUrl: "modules/doctor/views/patients-detail-appt-more.html",
                        controller: "DoctorPatientsDetailApptMoreController"
                    }
                }
            })
})