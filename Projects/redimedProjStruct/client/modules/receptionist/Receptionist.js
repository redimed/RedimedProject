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
    .state("loggedIn.receptionist.appointment", {
        url: "/receptionist/appointment",
        views: {
            "main-content": {
                templateUrl: "modules/receptionist/views/appointment.html",
                controller: "ReceptionistAppointmentController"
            }
        }
    })

    // APPOINTMENT DOCTOR
    .state("loggedIn.receptionist.appointment.doctor", {
        url: "/doctor",
        views: {
            "main-content@loggedIn.receptionist": {
                templateUrl: "modules/receptionist/views/doctor.html",
                controller: "ReceptionistAppointmentDoctorController"
            }
        }
    })

    // APPOINTMENT PATIENT
    .state("loggedIn.receptionist.appointment.detail", {
        url: "/detail/:patient_id/:cal_id",
        views: {
            "main-content@loggedIn.receptionist": {
                templateUrl: "modules/receptionist/views/detail.html",
                controller: "ReceptionistAppointmentDetailController"
            }
        }
    })
})