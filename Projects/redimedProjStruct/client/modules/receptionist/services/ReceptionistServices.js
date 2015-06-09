angular.module("app.loggedIn.receptionist.services", [])

.factory("ReceptionistService", function(Restangular){
	var receptionistService = {};
	var ermApi = Restangular.all('api/erm');
	var restfulAPI = Restangular.all('api/restful');

	receptionistService.getAppointmentList = function(options){
		return ermApi.all('appointment/get').post(options);
	}

	receptionistService.getAppointmentOverview = function(options){
		return ermApi.all('appointment/overview').post(options);
	}

	receptionistService.booking = function(options){
		return ermApi.all('appointment/booking').post(options);
	}

	receptionistService.getById = function(id){
		return ermApi.all('appointment/getById').post({'booking_id':id});
	}

	receptionistService.deleteBooking = function(options){
		return ermApi.all('appointment/delete').post(options);
	}

	receptionistService.updateBooking = function(options){
		return ermApi.all('appointment/update').post(options);
	}

	receptionistService.updateStatus = function(options){
		return ermApi.all('appointment/updateStatus').post(options);
	}

	receptionistService.apptDetail = function(cal_id){
		return ermApi.one('v2/appt/detail').get({id: cal_id});
	}

	receptionistService.getItemAppt = function(appt_id,patient_id){
		return ermApi.all('v1/appointment/get_items').post({'appt_id':appt_id, patient_id: patient_id});
	}

	receptionistService.itemFeeAppt = function(service_id,list_id){
		return ermApi.all('v2/appt/item_fee_appt').post({service_id: service_id, list_id: list_id});
	}

	receptionistService.getReferral = function(appt_id,patient_id){
		return restfulAPI.one('Referral').get({CAL_ID: appt_id, patient_id: patient_id});
	}


	/*=========================RECEPTIONIST========================*/
	var receptionistApi = Restangular.all('api/receptionist');
	receptionistService.getAppointmentByDate = function(date,site){
		return receptionistApi.all('appointment/getByDate').post({date: date,siteId: site});
	}

	receptionistService.getProgressAppt = function(date,site){
		return receptionistApi.all('appointment/progress').post({date: date,siteId: site});
	}

	receptionistService.updateAppointment = function(from,to,state){
		return receptionistApi.all('appointment/update').post({fromAppt:from, toAppt:to, state: state});
	}
	
	receptionistService.getSite = function(){
		return receptionistApi.one('getSites').get();
	}

	return receptionistService;
})