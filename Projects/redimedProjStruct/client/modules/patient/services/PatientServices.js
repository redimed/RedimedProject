angular.module("app.loggedIn.patient.services", [])

.factory("PatientService", function (Restangular) {
    var instanceService = {};
    var appApi = Restangular.all("api");

    instanceService.getSkinApp = function(image){
        var skinappApi = appApi.all("v1/skinapp/patient/image");
        return skinappApi.post({'image': image});
    }
	
	/**
	 * KHANK API
	 */

	instanceService.getAppointment = function (patient_id, doctor_id) {
		var detailApi = appApi.one("erm/v1/appointment/get_by_patient");
		return detailApi.get({patient_id: patient_id, doctor_id: doctor_id});
	}
	
	instanceService.getById = function (patient_id) {
		var detailApi = appApi.one("erm/v1/patients/get_by_id");
		return detailApi.get({patient_id: patient_id});
	}

	/**
	 * END KHANK API
	 */ 

    instanceService.search = function(option){
        var listApi = appApi.all("erm/v1/patients/search");
        return listApi.post(option);
    }

    instanceService.getByOption = function (option) {
        var detailApi = appApi.all("patient/get_by_option");
        return detailApi.post(option);
    }

    instanceService.getTotals = function () {
        var detailApi = appApi.one("patient/totals");
        return detailApi.get();
    }

    instanceService.listAccType = function () {
        var detailApi = appApi.one("patient/list_account_type");
        return detailApi.get();
    }
    instanceService.listPrvFund = function () {
        var detailApi = appApi.one("patient/list_private_fund");
        return detailApi.get();
    }

    instanceService.insertPatient = function (data) {
        var detailApi = appApi.all("patient/insert");
        return detailApi.post(data);
    }

    instanceService.updatePatient = function (data) {
        var detailApi = appApi.all("patient/update");
        return detailApi.post(data);
    }


    instanceService.getPatient = function (patient_id) {
        var detailApi = appApi.all("patient/get_by_id");
        return detailApi.post({'patient_id': patient_id});
    }

    instanceService.post = function (data) {
        var detailApi = appApi.all("patient/post");
        return detailApi.post(data);
    }

    instanceService.getReferral = function (option) {
        var detailApi = appApi.all("patient/getReferral");
        return detailApi.post(option);
    }
    instanceService.insertReferral = function (data) {
        var detailApi = appApi.all("patient/insertReferral");
        return detailApi.post({'data':data});
    }
    instanceService.updateReferral = function (data) {
        var detailApi = appApi.all("patient/updateReferral");
        return detailApi.post({'data':data});
    }
    instanceService.getScript = function (option) {
        var detailApi = appApi.all("patient/getScript");
        return detailApi.post(option);
    }
    instanceService.updateScript = function (data) {
        var detailApi = appApi.all("patient/updateScript");
        return detailApi.post({'data':data});
    }
    instanceService.insertScript = function (data) {
        var detailApi = appApi.all("patient/insertScript");
        return detailApi.post({'data':data});
    }    

    return instanceService;
})
