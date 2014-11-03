angular.module("app.loggedIn.receptionist.services", [])

.factory("ReceptionistService", function(Restangular){
	var receptionistService = {};
	var receptionistApi = Restangular.all("api/erm");

	receptionistService.getAppointmentList = function(options){
		var appointmentApi = receptionistApi.all("appointment/get");
		return appointmentApi.post(options);
	}

	receptionistService.getAppointmentOverview = function(options){
		var overviewApi = receptionistApi.all("appointment/overview");
		return overviewApi.post(options);
	}

	receptionistService.booking = function(options){
		var bookingApi = receptionistApi.all("appointment/booking");
		return bookingApi.post(options);
	}

	receptionistService.getById = function(id){
		var getApi = receptionistApi.all("appointment/getById");
		return getApi.post({'booking_id': id});
	}

	return receptionistService;
})