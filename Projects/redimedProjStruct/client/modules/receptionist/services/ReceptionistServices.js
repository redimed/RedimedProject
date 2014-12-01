angular.module("app.loggedIn.receptionist.services", [])

.factory("ReceptionistService", function(Restangular){
	var receptionistService = {};
	var receptionistApi = Restangular.all("api/erm");

	receptionistService.apptDetail =function(cal_id) {
		// http://localhost:3000/api/erm/v2/appt/detail?id=23651
		var appointmentApi = receptionistApi.one("v2/appt/detail");
		return appointmentApi.get({id: cal_id});
	}

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

	receptionistService.deleteBooking = function(options){
		var deleteApi = receptionistApi.all("appointment/delete");
		return deleteApi.post(options);
	}

	receptionistService.updateBooking = function(options){
		var updateApi = receptionistApi.all("appointment/update");
		return updateApi.post(options);
	}

	return receptionistService;
})