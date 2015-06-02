angular.module("app.loggedIn.receptionist.services", [])

.factory("ReceptionistService", function(Restangular){
	var receptionistService = {};
	var receptionistApi = Restangular.all('api/erm');

	var restfulAPI = Restangular.all('api/restful');

	receptionistService.getAppointmentList = function(options){
		return receptionistApi.all('appointment/get').post(options);
	}

	receptionistService.getAppointmentOverview = function(options){
		return receptionistApi.all('appointment/overview').post(options);
	}

	receptionistService.booking = function(options){
		return receptionistApi.all('appointment/booking').post(options);
	}

	receptionistService.getById = function(id){
		return receptionistApi.all('appointment/getById').post({'booking_id':id});
	}

	receptionistService.deleteBooking = function(options){
		return receptionistApi.all('appointment/delete').post(options);
	}

	receptionistService.updateBooking = function(options){
		return receptionistApi.all('appointment/update').post(options);
	}

	receptionistService.updateStatus = function(options){
		return receptionistApi.all('appointment/updateStatus').post(options);
	}

	receptionistService.apptDetail = function(cal_id){
		return receptionistApi.one('v2/appt/detail').get({id: cal_id});
	}

	receptionistService.getItemAppt = function(appt_id,patient_id){
		return receptionistApi.all('v1/appointment/get_items').post({'appt_id':appt_id, patient_id: patient_id});
	}

	receptionistService.itemFeeAppt = function(service_id,list_id){
		return receptionistApi.all('v2/appt/item_fee_appt').post({service_id: service_id, list_id: list_id});
	}

	receptionistService.getReferral = function(appt_id,patient_id){
		return restfulAPI.one('Referral').get({CAL_ID: appt_id, patient_id: patient_id});
	}

	
	return receptionistService;
})