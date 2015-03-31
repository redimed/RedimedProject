angular.module("app.loggedIn.consult.services",[])
	.factory("ConsultationService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");

		services.getPatientProblem = function(patientId){
			return api.all('consultation/getPatientProblem').post({'patient_id': patientId});
		}

		services.submitConsult = function(info){
			return api.all('consultation/submit').post({'info': info});
		}

		services.getPatientCompany = function(patientId){
			return api.all('consultation/patient/company').post({patient_id: patientId});
		}

		services.searchScript = function(info){
			return api.all('erm/v2/medicine/search').post({search: info});
		}

		return services;
	})