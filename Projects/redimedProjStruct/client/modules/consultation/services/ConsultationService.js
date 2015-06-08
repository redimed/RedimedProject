angular.module("app.loggedIn.patient.consult.services",[])
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

		/**
		 * tannv.dts@gmail.com
		 * kiem tra xem doctor co cac appointment nao dang la work in progress hay khong
		 */
		services.beforeStartSession=function(doctorId)
		{
			return api.all('consultation/beforeStartSession').post({doctorId:doctorId});
		}

		/**
		 * tannv.dts@gmail.com
		 * chuyen Appt Patient Status thanh Work in progress
		 */
		services.startSession=function(data)
		{
			return api.all('consultation/startSession').post({data: data});
		}

		/**
		 * tannv.dts@gmail.com
		 * Lay danh sach cac item cua apptPatient
		 */
		services.beforeFinishSession=function(data)
		{
			return api.all('consultation/beforeFinishSession').post({data: data});
		}

		/**
		 * tannv.dts@gmail.com
		 * chuyen Appt Patient Status thanh Finished
		 */
		services.finishSession=function(data)
		{
			return api.all('consultation/finishSession').post({data: data});
		}

		/**
		 * tannv.dts@gmail.com
		 * lay thong tin appt patient
		 */
		services.getApptPatient=function(data)
		{
			return api.all('consultation/getApptPatient').post({data: data});
		}


		
		return services;
	})