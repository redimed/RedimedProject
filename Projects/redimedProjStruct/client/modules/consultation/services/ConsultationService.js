angular.module("app.loggedIn.consult.services",[])
	.factory("ConsultationService",function(Restangular){
		var services = {};
		var api = Restangular.all("api");
		var info = {};

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

		services.getConsultInfo = function(){
			return info;
		}

		services.setConsultInfo = function(consultInfo){
			info = angular.copy(consultInfo);
		}

		return services;
	})