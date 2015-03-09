angular.module("app.loggedIn.receptionist.services", [])

.factory("ReceptionistService", function(Restangular){
	var receptionistService = {};
	var receptionistApi = Restangular.all("api/erm");

	var restfulAPI = Restangular.all("api/restful");

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

	receptionistService.updateStatus = function(options){
		var updateApi = receptionistApi.all("appointment/updateStatus");
		return updateApi.post(options);
	}


	/**
	*	APPOINTMENT ITEM FEE
	*/

	receptionistService.apptDetail =function(cal_id) {
		// http://localhost:3000/api/erm/v2/appt/detail?id=23651
		var appointmentApi = receptionistApi.one("v2/appt/detail");
		return appointmentApi.get({id: cal_id});
	}

	receptionistService.getItemAppt = function (appt_id, patient_id) {
		var instanceApi = doctorApi.all("v1/appointment/get_items");
		return instanceApi.post({'appt_id':appt_id, patient_id: patient_id});
	}

	receptionistService.itemFeeAppt = function(service_id, list_id) {
		if(!service_id || !list_id || list_id.length == 0) {
			console.log('need more data');
			return null;
		}
		var updateApi = receptionistApi.all("v2/appt/item_fee_appt");
		return updateApi.post({service_id: service_id, list_id: list_id});
	}

	/*
	*	RESTFUL 
	*/
	receptionistService.getReferral = function (appt_id, patient_id) {
		var instanceApi = restfulAPI.one("Referral");
		return instanceApi.get({CAL_ID: appt_id, patient_id: patient_id});
	}


	return receptionistService;
})