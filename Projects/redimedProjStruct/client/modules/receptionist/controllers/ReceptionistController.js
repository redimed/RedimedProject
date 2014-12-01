angular.module("app.loggedIn.receptionist.controller", [
    "app.loggedIn.receptionist.appointment.controller",
    "app.loggedIn.receptionist.appointment.doctor.controller",
    "app.loggedIn.receptionist.appointment.detail.controller"
])

.controller("ReceptionistController", function ($scope, ConfigService) {
	$scope.dateOptions = {
		changeMonth: true,
		changeYear: true
	}

	$scope.modelObject = {
		datepicker: new Date(),
		site: null,
		doctor: null,
		dept: null
	}

	$scope.modelObjectBooking = {
		CAL_ID: 0,
		DOCTOR_ID: 0,
		SITE_ID: 0,
		NOTES: "",
		PHONE: null,
		APP_TYPE: "",
		STATUS: "",
		ARR_TIME: "",
		ATTEND_TIME: "",
		AVAILABLE: null,
		Patient_id: 0,
		PATIENT: null,
		SERVICE_ID: 0,
		CLINICAL_DEPT_ID: 0,
		ACC_TYPE: "",
		bill_to: 0
	}
})