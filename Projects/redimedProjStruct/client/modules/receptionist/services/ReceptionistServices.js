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

	receptionistService.deleteBooking = function(options){
		var deleteApi = receptionistApi.all("appointment/delete");
		return deleteApi.post(options);
	}

	receptionistService.updateBooking = function(options){
		var updateApi = receptionistApi.all("appointment/update");
		return updateApi.post(options);
	}
	receptionistService.insertOutdoc = function(options){
		var postData = {
			outdoc: options
		};
		var updateApi = receptionistApi.all("v1/doctors/outside/add");
		return updateApi.post(postData);
	}
	receptionistService.getOutDoc = function(options){
		var postData = {
			outdoc: options
		};
		var updateApi = receptionistApi.all("v1/doctors/outside/get");
		return updateApi.post(postData);
	}
	receptionistService.updateOutDoc = function(options){
		var postData = {
			outdoc: options
		};
		var updateApi = receptionistApi.all("v1/doctors/outside/update");
		return updateApi.post(postData);
	}

	return receptionistService;
})